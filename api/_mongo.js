import { existsSync, promises as fs } from "node:fs";
import { join } from "node:path";
import { MongoClient, ObjectId } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "one_hub";
const dataFile = join(process.cwd(), "data.json");

let cachedClient;
let cachedDb;
let localDb;
let useLocalFallback = !mongoUri;

function createEmptyData() {
  return {
    shop_products: [],
    events: [],
    event_participants: [],
    users: [],
    settings: {},
  };
}

async function readDataFile() {
  if (!existsSync(dataFile)) return createEmptyData();
  const content = await fs.readFile(dataFile, "utf8");
  const data = content.trim() ? JSON.parse(content) : createEmptyData();
  if (!data.settings) data.settings = {};
  return data;
}

async function writeDataFile(data) {
  await fs.writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function collectionKey(name) {
  return name === "site_settings" ? "settings" : name;
}

function normalizeLocalDoc(doc) {
  if (!doc) return doc;
  return {
    ...doc,
    _id: {
      toString: () => String(doc._id || doc.id || doc.key || createLocalId()),
    },
  };
}

function matchesFilter(doc, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    const actual = key === "_id" ? doc._id || doc.id : doc[key];

    if (expected && typeof expected === "object" && "$ne" in expected) {
      return actual !== expected.$ne;
    }

    if (expected instanceof ObjectId) {
      return String(actual) === expected.toString() || String(doc.id) === expected.toString();
    }

    return actual === expected;
  });
}

function sortRows(rows, sortSpec = {}) {
  const [[key, direction] = []] = Object.entries(sortSpec);
  if (!key) return rows;
  return rows.slice().sort((a, b) => {
    const left = new Date(a[key]).getTime() || a[key] || "";
    const right = new Date(b[key]).getTime() || b[key] || "";
    if (left === right) return 0;
    return left > right ? direction : -direction;
  });
}

function createCursor(rows) {
  let current = rows.slice();
  return {
    sort(sortSpec) {
      current = sortRows(current, sortSpec);
      return this;
    },
    limit(count) {
      current = current.slice(0, count);
      return this;
    },
    async toArray() {
      return current.map(normalizeLocalDoc);
    },
    async next() {
      return normalizeLocalDoc(current[0] || null);
    },
  };
}

function settingsToRows(settings = {}) {
  return Object.entries(settings)
    .filter(([key]) => key !== "discordBotToken" && key !== "updatedAt")
    .map(([key, value]) => ({
      key,
      value,
      updatedAt: settings.updatedAt || null,
      id: key,
    }));
}

function rowsToSettings(data, rows) {
  const preserved = {
    discordBotToken: data.settings?.discordBotToken || "",
    updatedAt: data.settings?.updatedAt || null,
  };
  data.settings = rows.reduce((settings, row) => {
    settings[row.key] = row.value;
    if (row.updatedAt) settings.updatedAt = row.updatedAt;
    return settings;
  }, preserved);
}

function createLocalCollection(name) {
  const key = collectionKey(name);

  async function readRows(data) {
    return key === "settings" ? settingsToRows(data.settings) : data[key] || [];
  }

  async function writeRows(data, rows) {
    if (key === "settings") rowsToSettings(data, rows);
    else data[key] = rows;
    await writeDataFile(data);
  }

  return {
    async findOne(filter) {
      const data = await readDataFile();
      const rows = await readRows(data);
      return normalizeLocalDoc(rows.find((row) => matchesFilter(row, filter)) || null);
    },

    find(filter = {}) {
      return createCursorFromStore(async () => {
        const data = await readDataFile();
        const rows = await readRows(data);
        return rows.filter((row) => matchesFilter(row, filter));
      });
    },

    async insertOne(document) {
      const data = await readDataFile();
      const rows = await readRows(data);
      const id = createLocalId();
      rows.unshift({ ...document, id });
      await writeRows(data, rows);
      return { insertedId: { toString: () => id } };
    },

    async findOneAndUpdate(filter, update, options = {}) {
      const data = await readDataFile();
      const rows = await readRows(data);
      let row = rows.find((item) => matchesFilter(item, filter));

      if (!row && options.upsert) {
        row = { id: createLocalId(), ...filter, ...(update.$setOnInsert || {}) };
        rows.unshift(row);
      }

      if (!row) return null;
      Object.assign(row, update.$set || {});
      await writeRows(data, rows);
      return normalizeLocalDoc(row);
    },

    async updateOne(filter, update) {
      const data = await readDataFile();
      const rows = await readRows(data);
      const row = rows.find((item) => matchesFilter(item, filter));
      if (!row) return { modifiedCount: 0 };
      Object.assign(row, update.$set || {});
      await writeRows(data, rows);
      return { modifiedCount: 1 };
    },

    async deleteOne(filter) {
      const data = await readDataFile();
      const rows = await readRows(data);
      const nextRows = rows.filter((row) => !matchesFilter(row, filter));
      await writeRows(data, nextRows);
      return { deletedCount: rows.length - nextRows.length };
    },

    async deleteMany(filter) {
      const data = await readDataFile();
      const rows = await readRows(data);
      const nextRows = rows.filter((row) => !matchesFilter(row, filter));
      await writeRows(data, nextRows);
      return { deletedCount: rows.length - nextRows.length };
    },
  };
}

function createCursorFromStore(loadRows) {
  let sortSpec = null;
  let limitCount = null;
  return {
    sort(spec) {
      sortSpec = spec;
      return this;
    },
    limit(count) {
      limitCount = count;
      return this;
    },
    async toArray() {
      let rows = await loadRows();
      if (sortSpec) rows = sortRows(rows, sortSpec);
      if (limitCount !== null) rows = rows.slice(0, limitCount);
      return rows.map(normalizeLocalDoc);
    },
    async next() {
      const rows = await this.toArray();
      return rows[0] || null;
    },
  };
}

function createLocalDb() {
  return {
    collection(name) {
      return createLocalCollection(name);
    },
  };
}

export async function getDb() {
  if (useLocalFallback) {
    if (!localDb) localDb = createLocalDb();
    return localDb;
  }

  if (!cachedClient) {
    try {
      cachedClient = new MongoClient(mongoUri);
      await cachedClient.connect();
      cachedDb = cachedClient.db(mongoDbName);
    } catch (error) {
      console.warn(`MongoDB indisponivel, usando data.json: ${error.message}`);
      useLocalFallback = true;
      cachedClient = null;
      cachedDb = null;
      if (!localDb) localDb = createLocalDb();
      return localDb;
    }
  }

  return cachedDb;
}

export async function getLocalDiscordBotToken() {
  const data = await readDataFile();
  return data.settings?.discordBotToken || "";
}

export async function saveLocalDiscordBotToken(token) {
  const data = await readDataFile();
  data.settings = {
    ...(data.settings || {}),
    discordBotToken: token,
  };
  await writeDataFile(data);
}

export function normalizeProduct(product) {
  return {
    id: (product._id || product.id).toString(),
    name: product.name,
    description: product.description || "",
    category: product.category || "fivem",
    rarity: product.rarity || "common",
    bannerUrl: product.bannerUrl || "",
    price: Number(product.price) || 0,
    quantity: Number(product.quantity) || 1,
    isActive: product.isActive !== false,
    createdAt: product.createdAt,
  };
}

export function normalizeEvent(event) {
  return {
    id: (event._id || event.id).toString(),
    title: event.title,
    mainDescription: event.mainDescription,
    detailDescription: event.detailDescription || "",
    bannerUrl: event.bannerUrl || "",
    eventTime: event.eventTime || "",
    location: event.location || "",
    reward: event.reward || "",
    status: event.status || "active",
    createdAt: event.createdAt,
  };
}
