const formatCoins = (value) => new Intl.NumberFormat("pt-BR").format(value);

const API_BASE =
  window.location.protocol === "file:" ? "http://127.0.0.1:3000" : "";

let coins = 0;
const DISCORD_CLIENT_ID = "1507207436665229322";
const DISCORD_API = "https://discord.com/api";
const DISCORD_GUILD_ID = "1500607972605296713";
const ADMIN_ROLE_ID = "1503079573124943924";
const SETTINGS_ACCESS_CODE = "1507";
const TEST_LOGIN_USERNAME = "Megan";
const TEST_LOGIN_PASSWORD = "1507";
let discordSession = readDiscordSession();
let isLoggedIn = Boolean(discordSession?.accessToken);
let discordUser = discordSession?.user || {
  name: "ONE HUB",
  avatarInitial: "O",
  roles: [],
};
coins = Number(discordUser.coins) || 0;
function getCurrentUserId() {
  return discordUser.hubId || discordUser.id || null;
}
const owned = [];
const equipped = {
  frame: null,
  theme: null,
  title: null,
};

const pages = Array.from(document.querySelectorAll(".page"));
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const shopFilterButtons = Array.from(
  document.querySelectorAll("[data-shop-filter]"),
);
const settingsTabButtons = Array.from(
  document.querySelectorAll("[data-settings-tab]"),
);
const settingsOpenButtons = Array.from(
  document.querySelectorAll("[data-settings-open]"),
);
const settingsSections = Array.from(
  document.querySelectorAll("[data-settings-section]"),
);
const settingsContentTitle = document.querySelector("#settingsContentTitle");
const settingsSidebarSearch = document.querySelector("#settingsSidebarSearch");
const settingsThemeText = document.querySelector("#settingsThemeText");
const coinPlayerSearch = document.querySelector("#coinPlayerSearch");
const hubCoinRows = document.querySelector("#hubCoinRows");
const settingsAccessGate = document.querySelector("#settingsAccessGate");
const settingsAccessInput = document.querySelector("#settingsAccessInput");
const settingsAccessSubmit = document.querySelector("#settingsAccessSubmit");
const settingsPinDots = Array.from(
  document.querySelectorAll(".settings-pin-dots span"),
);
const settingsKeyButtons = Array.from(
  document.querySelectorAll("[data-settings-key]"),
);
const settingsShell = document.querySelector("#settingsShell");
const frameSubfilters = document.querySelector(".frame-subfilters");
const themeSubfilters = document.querySelector(".theme-subfilters");
const toast = document.querySelector("#toast");
const hubCards = document.querySelector("#hubCards");
const shopGrid = document.querySelector("#shopGrid");
const shopProductEditorList = document.querySelector("#shopProductEditorList");
const inventoryList = document.querySelector("#inventoryList");
const inventoryCount = document.querySelector("#inventoryCount");
const inventoryBadge = document.querySelector("#inventoryBadge");
const profileAvatar = document.querySelector("#profileAvatar");
const profileAvatarWrap = document.querySelector(".profile-avatar-wrap");
const avatarMini = document.querySelector(".avatar-mini");
const profileTitle = document.querySelector("#profileTitle");
const equippedFrame = document.querySelector("#equippedFrame");
const equippedTheme = document.querySelector("#equippedTheme");
const equippedTitle = document.querySelector("#equippedTitle");
const discordLogin = document.querySelector("#discordLogin");
const discordLogout = document.querySelector("#discordLogout");
const topbarLogout = document.querySelector("#topbarLogout");
const notificationsButton = document.querySelector("#notificationsButton");
const usersDirectoryButton = document.querySelector("#usersDirectoryButton");
const usersDirectoryOverlay = document.querySelector("#usersDirectoryOverlay");
const usersDirectoryClose = document.querySelector("#usersDirectoryClose");
const usersDirectoryTabs = Array.from(
  document.querySelectorAll("[data-users-view]"),
);
const usersDirectorySidebar = document.querySelector("#usersDirectorySidebar");
const directoryDiscordCount = document.querySelector("#directoryDiscordCount");
const directoryHubCount = document.querySelector("#directoryHubCount");
const directoryDiscordOnlyTotal = document.querySelector(
  "#directoryDiscordOnlyTotal",
);
const directoryHubUsersTotal = document.querySelector("#directoryHubUsersTotal");
const directoryDiscordOnlyList = document.querySelector(
  "#directoryDiscordOnlyList",
);
const directoryHubUsersList = document.querySelector("#directoryHubUsersList");
const discordTokenForm = document.querySelector("#discordTokenForm");
const discordBotTokenInput = document.querySelector("#discordBotTokenInput");
const accountForm = document.querySelector("#accountForm");
const accountUsername = document.querySelector("#accountUsername");
const accountPassword = document.querySelector("#accountPassword");
const accountSubmit = document.querySelector("#accountSubmit");
const accountModeToggle = document.querySelector("#accountModeToggle");
const hourglassLogin = document.querySelector("#hourglassLogin");
const themeToggle = document.querySelector("#themeToggle");
const globalThemeButtons = Array.from(
  document.querySelectorAll("[data-global-theme]"),
);
const rouletteWheel = document.querySelector("#rouletteWheel");
const spinRoulette = document.querySelector("#spinRoulette");
const rouletteFeedback = document.querySelector("#rouletteFeedback");
const rouletteHistory = document.querySelector("#rouletteHistory");
const ticketBalance = document.querySelector("#ticketBalance");
const multiplierStatus = document.querySelector("#multiplierStatus");
const betAmount = document.querySelector("#betAmount");
const paymentIcon = document.querySelector("#paymentIcon");
const gamesMenu = document.querySelector("#gamesMenu");
const rouletteGame = document.querySelector("#rouletteGame");
const backToGames = document.querySelector("#backToGames");
const rouletteBannerStatus = document.querySelector("#rouletteBannerStatus");
const rouletteBannerTitle = document.querySelector("#rouletteBannerTitle");
const rouletteBannerDescription = document.querySelector(
  "#rouletteBannerDescription",
);
const rouletteBannerMark = document.querySelector("#rouletteBannerMark");
const rouletteBannerArt = document.querySelector("#rouletteBannerArt");
const rouletteBannerImage = document.querySelector("#rouletteBannerImage");
const settingsGamePreviewImage = document.querySelector(
  "#settingsGamePreviewImage",
);
const settingsGamePreviewTitle = document.querySelector(
  "#settingsGamePreviewTitle",
);
const settingsGamePreviewDescription = document.querySelector(
  "#settingsGamePreviewDescription",
);
const eventsList = document.querySelector("#eventsList");
const eventDetailAction = document.querySelector("#eventDetailAction");
const eventDetailStatus = document.querySelector("#eventDetailStatus");
const eventDetailTitle = document.querySelector("#eventDetailTitle");
const eventDetailMainDescription = document.querySelector(
  "#eventDetailMainDescription",
);
const eventDetailDescription = document.querySelector(
  "#eventDetailDescription",
);
const eventDetailTags = document.querySelector("#eventDetailTags");
const eventDetailBanner = document.querySelector("#eventDetailBanner");
const settingsEventsRows = document.querySelector("#settingsEventsRows");
const eventEditOverlay = document.querySelector("#eventEditOverlay");
const eventEditClose = document.querySelector("#eventEditClose");
const eventEditForm = document.querySelector("#eventEditForm");
const eventParticipantsOverlay = document.querySelector(
  "#eventParticipantsOverlay",
);
const eventParticipantsClose = document.querySelector("#eventParticipantsClose");
const eventParticipantsTitle = document.querySelector("#eventParticipantsTitle");
const eventParticipantsSubtitle = document.querySelector(
  "#eventParticipantsSubtitle",
);
const eventParticipantsList = document.querySelector("#eventParticipantsList");

let rouletteSpins = 0;
let rouletteBusy = false;
let eventJoined = false;
async function checkUserParticipation() {
  if (!eventConfig?.id) return;
  const userId = discordUser.id || discordUser.username || "anonymous";
  try {
    const response = await fetch(
      `${API_BASE}/api/event-participants?eventId=${encodeURIComponent(eventConfig.id)}`,
    );
    if (!response.ok) return;
    const participants = await response.json();
    eventJoined = participants.some((p) => p.userId === userId);
  } catch (error) {
    console.warn("checkUserParticipation:", error.message);
  }
}
let tickets = 0;
let temporaryMultiplier = 1;
let multiplierSpinsLeft = 0;
let paymentMode = "coins";
let activeShopFilter = "all";
let currentPageId = "login";
let usersDirectoryView = "discord-only";
let usersDirectoryData = {
  discordOnly: [],
  hubUsers: [],
};
let hubCoinUsers = [];
let globalTheme = "default";
const frameRarities = ["common", "rare", "epic", "legendary", "ultra"];
const themeRarities = [
  "theme-common",
  "theme-rare",
  "theme-epic",
  "theme-legendary",
  "theme-ultra",
];
const shopRarityLabels = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
  ultra: "Ultra",
};
const shopCategoryLabels = {
  fivem: "Fivem",
  frame: "Moldura",
  theme: "Tema",
  title: "Tag",
};
const settingsTabTitles = {
  "one-coins": "One Coins",
  "events-create": "Eventos",
  "hub-featured": "Cards do Hub",
  themes: "Temas",
  changelogs: "Changelogs",
  "hub-live": "Cards Ao Vivo",
  "events-edit": "Editar Eventos",
  "games-status": "Games",
  "games-edit": "Editar game",
  "shop-create": "Shop",
  "shop-edit": "Editar Produtos",
};
const rouletteResults = [];
const carouselPrizeWidth = 146;
const carouselRounds = 4;
const roulettePrizeWeights = {
  coins: 7,
  ticket: 30,
  retry: 70,
  multiplier: 50,
};
const rouletteCoinReward = 30;
const carouselPattern = [
  "coins",
  "ticket",
  "retry",
  "coins",
  "multiplier",
  "ticket",
  "coins",
  "retry",
  "ticket",
  "coins",
  "multiplier",
];
const coinIconSvg =
  '<span class="coin-inline" aria-label="ONE COIN"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/></svg></span>';

function readDiscordSession() {
  try {
    return JSON.parse(localStorage.getItem("oneDiscordSession") || "null");
  } catch {
    localStorage.removeItem("oneDiscordSession");
    return null;
  }
}

function getDiscordRedirectUri() {
  return `${window.location.origin}${window.location.pathname}`;
}

function getDiscordAvatarUrl(user) {
  if (!user?.id || !user.avatar) return "";
  const extension = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
}

function normalizeDiscordUser(user) {
  const displayName = user.global_name || user.username || "Kawanone";
  return {
    id: user.id,
    name: displayName,
    username: user.username,
    avatarUrl: getDiscordAvatarUrl(user),
    avatarInitial: displayName.slice(0, 1).toUpperCase(),
    roles: [],
  };
}

function readLocalAccounts() {
  try {
    return JSON.parse(localStorage.getItem("oneLocalAccounts") || "[]");
  } catch {
    localStorage.removeItem("oneLocalAccounts");
    return [];
  }
}

function saveLocalAccounts(accounts) {
  localStorage.setItem("oneLocalAccounts", JSON.stringify(accounts));
}

function setLoggedUser(user, sessionType = "local") {
  coins = Number(user.coins) || 0;
  discordUser = user;
  discordSession = {
    accessToken: `${sessionType}-session`,
    user: discordUser,
    test: sessionType === "test",
    local: sessionType === "local",
    createdAt: Date.now(),
  };
  isLoggedIn = true;
  localStorage.setItem("oneDiscordSession", JSON.stringify(discordSession));
  syncAuthState();
  updateBalances();
  window.location.hash = "home";
  showPage();
}

function hasAdminRole() {
  return discordUser.roles?.includes(ADMIN_ROLE_ID);
}

function hasSettingsAccess() {
  return (
    hasAdminRole() || sessionStorage.getItem("oneSettingsAccess") === "true"
  );
}

function updateSettingsAccessView() {
  const canAccess = hasSettingsAccess();
  settingsAccessGate?.classList.toggle("hidden", canAccess);
  settingsShell?.classList.toggle("hidden", !canAccess);
  if (!canAccess) {
    updateSettingsPinDots();
  }
}

function updateSettingsPinDots() {
  const size = settingsAccessInput?.value.length || 0;
  settingsPinDots.forEach((dot, index) => {
    dot.classList.toggle("active", index < size);
  });
}

function clearSettingsCode() {
  if (!settingsAccessInput) return;
  settingsAccessInput.value = "";
  updateSettingsPinDots();
}

function unlockSettingsWithCode() {
  const code = settingsAccessInput?.value.trim();
  if (code === SETTINGS_ACCESS_CODE) {
    sessionStorage.setItem("oneSettingsAccess", "true");
    syncAuthState();
    updateSettingsAccessView();
    showToast("Acesso aos Ajustes liberado.");
    clearSettingsCode();
    return true;
  }
  showToast("Codigo de acesso invalido.");
  clearSettingsCode();
  return false;
}

function handleSettingsKey(key) {
  if (!settingsAccessInput) return;
  if (key === "back") {
    settingsAccessInput.value = settingsAccessInput.value.slice(0, -1);
    updateSettingsPinDots();
    return;
  }
  if (!/^\d$/.test(key) || settingsAccessInput.value.length >= 4) return;
  settingsAccessInput.value += key;
  updateSettingsPinDots();
  if (settingsAccessInput.value.length === SETTINGS_ACCESS_CODE.length) {
    unlockSettingsWithCode();
  }
}

async function fetchDiscordRoles(accessToken) {
  if (!DISCORD_GUILD_ID || DISCORD_GUILD_ID === "COLOQUE_O_ID_DO_SERVIDOR") {
    console.warn("Configure DISCORD_GUILD_ID para validar cargos do Discord.");
    return [];
  }

  const response = await fetch(
    `${DISCORD_API}/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    console.warn("Nao foi possivel carregar cargos do Discord.");
    return [];
  }

  const member = await response.json();
  return Array.isArray(member.roles) ? member.roles : [];
}

const categoryMeta = {
  games: {
    label: "Games",
    visual: "blue",
    symbol: "~",
  },
  events: {
    label: "Eventos",
    visual: "violet",
    symbol: "*",
  },
  shop: {
    label: "Shop",
    visual: "blue",
    symbol: "O",
  },
};

const hubConfig = {
  featured: {
    badge: "Destaque",
    target: "games",
    title: "Coin Clicker",
    description:
      "Ganhe moedas em partidas rapidas e desbloqueie itens de perfil.",
  },
  live: {
    badge: "Ao vivo",
    target: "event-detail",
    title: "BARATA X HUMANOS",
    description: "Preparem-se para uma guerra caótica dentro do labirinto!",
    imageUrl:
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-04_164833039.png",
  },
};

const gameConfig = {
  roulette: {
    status: "Disponivel",
    title: "Roleta ONE",
    description:
      "Aposte em azul, branco ou preto em uma roleta limpa estilo cassino.",
    imageUrl:
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/ChatGPTImage3dejun.de202610_01_03.png",
  },
};

const eventConfig = {
  id: "barata-x-humanos",
  title: "BARATA X HUMANOS",
  date: "2026-06-06",
  status: "active",
  mainDescription: "Preparem-se para uma guerra caótica dentro do labirinto!",
  bannerUrl:
    "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-04_164833039.png",
  hours: "22:00 Horas",
  location: "Hotel Presságio",
  reward: "350K + 10 One Coins",
  detailDescription:
    "No início do evento, os humanos entrarão primeiro no labirinto para se esconderem e se posicionarem. Logo depois, as baratas serão liberadas e a batalha começará.\n\nTodos os participantes receberão tacos para se defender e atacar. A partir daí, será uma verdadeira guerra entre Baratas x Humanos até uma das equipes sair vencedora.\n\nData: Hoje\nHorário: 22:00\nLocal: Hotel Presságio\n\nPremiação para a equipe vencedora:\n300K + 10 One Coins\n\nRegras básicas:\nProibido abusar de bugs ou animações.\nProibido sair da área do evento.\nUse estratégia, se esconda, ataque e sobreviva com sua equipe.\n\nEscolha seu lado e venha para essa guerra insana.\nHoje, às 22:00, no Hotel Presságio.",
};

let eventItems = [{ ...eventConfig }];

const shopItems = [
  {
    id: "frame-neon",
    name: "Angel White",
    desc: "Uma moldura angelical em branco prateado, feita para iluminar o perfil com leveza e protecao.",
    price: 420,
    type: "frame",
    typeLabel: "Comum",
    rarity: "common",
    effect: "common-frame-equipped",
    image: "common-frame",
    imageUrl:
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-03_213603907-removebg-preview.png",
  },
  {
    id: "frame-gold",
    name: "Angel Gold",
    desc: "Uma moldura angelical dourada, criada para destacar o perfil com brilho sagrado e presenca lendaria.",
    price: 680,
    type: "frame",
    typeLabel: "Lendário",
    rarity: "legendary",
    effect: "legendary-frame-equipped",
    image: "gold-frame",
    imageUrl:
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/-removebg-preview.png",
  },
  {
    id: "frame-safirium",
    name: "Safirium",
    desc: "Uma moldura ultra rara lapidada em tons de safira, feita para envolver o perfil com brilho cristalino e energia celestial.",
    price: 1400,
    type: "frame",
    typeLabel: "Ultra",
    rarity: "ultra",
    effect: "safirium-frame-equipped",
    image: "safirium-frame",
    imageUrl:
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/download__36_-removebg-preview(1).png",
  },
  {
    id: "frame-rubi-prism",
    name: "Rubi Prism",
    desc: "Uma moldura lendaria com brilho rubi prismático, criada para destacar o perfil com intensidade, luxo e poder celestial.",
    price: 1100,
    type: "frame",
    typeLabel: "Lendário",
    rarity: "legendary",
    effect: "rubi-prism-frame-equipped",
    image: "rubi-prism-frame",
    imageUrl:
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/download__38_-removebg-preview.png",
  },
  {
    id: "theme-blueprint",
    name: "Tema Blueprint",
    desc: "Fundo frio com linhas luminosas no card do perfil.",
    price: 520,
    type: "theme",
    typeLabel: "Comum",
    rarity: "theme-common",
    effect: "blueprint",
    image: "theme-blueprint",
  },
  {
    id: "theme-midnight",
    name: "Tema Midnight",
    desc: "Visual escuro premium sincronizado com seu perfil.",
    price: 760,
    type: "theme",
    typeLabel: "Raro",
    rarity: "theme-rare",
    effect: "midnight",
    image: "theme-midnight",
  },
  {
    id: "theme-hello-kit",
    name: "Hello Kit",
    desc: "Tema ultra em rosa doce e brilhante, criado para transformar todo o HUB com uma paleta delicada, charmosa e premium.",
    price: 1600,
    type: "theme",
    typeLabel: "Ultra",
    rarity: "theme-ultra",
    effect: "hello-kit",
    image: "theme-hello-kit",
    appliesGlobalPalette: true,
  },
  {
    id: "title-pro",
    name: "Tag PRO",
    desc: "Tag de jogador avancado abaixo do nome.",
    price: 600,
    type: "title",
    typeLabel: "Tag",
    effect: "PRO Player",
    image: "title-pro",
  },
  {
    id: "title-founder",
    name: "Tag Fundador",
    desc: "Tag exclusiva para aparecer no perfil.",
    price: 900,
    type: "title",
    typeLabel: "Tag",
    effect: "Fundador ONE",
    image: "title-founder",
  },
];

function showPage() {
  const requested = window.location.hash.replace("#", "") || "home";
  syncAuthState();

  if (!isLoggedIn) {
    pages.forEach((page) =>
      page.classList.toggle("active", page.id === "login"),
    );
    navLinks.forEach((link) => link.classList.remove("active"));
    if (window.location.hash && window.location.hash !== "#login") {
      window.history.replaceState(null, "", "#login");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  const unlockedRequest = requested === "login" ? "home" : requested;
  const activeId = pages.some(
    (page) => page.id === unlockedRequest && page.id !== "login",
  )
    ? unlockedRequest
    : "home";

  if (currentPageId === "settings" && activeId !== "settings") {
    sessionStorage.removeItem("oneSettingsAccess");
    syncAuthState();
  }
  currentPageId = activeId;

  if (requested === "login") {
    window.history.replaceState(null, "", "#home");
  }

  pages.forEach((page) =>
    page.classList.toggle("active", page.id === activeId),
  );
  navLinks.forEach((link) =>
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${activeId}`,
    ),
  );

  if (activeId === "shop") renderShop();
  if (activeId === "profile") renderInventory();
  if (activeId === "settings") {
    updateSettingsAccessView();
    loadHubCoinUsers();
    renderShopProductEditorList();
    syncSettingsForms();
    syncGameConfigForms();
    syncEventConfigForm();
  }
  if (activeId === "games") showGamesMenu();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function syncAuthState() {
  document.body.classList.toggle("auth-locked", !isLoggedIn);
  document.body.classList.toggle(
    "has-admin-role",
    isLoggedIn && hasSettingsAccess(),
  );
  document.querySelectorAll("[data-user-name]").forEach((element) => {
    element.textContent = discordUser.name;
  });
  if (profileAvatar) profileAvatar.textContent = discordUser.avatarInitial;
  document
    .querySelectorAll(".avatar-mini, .profile-avatar")
    .forEach((element) => {
      element.style.backgroundImage = discordUser.avatarUrl
        ? `url("${discordUser.avatarUrl}")`
        : "";
      element.classList.toggle(
        "has-discord-avatar",
        Boolean(discordUser.avatarUrl),
      );
    });
}

async function loginWithDiscord() {
  if (
    !DISCORD_CLIENT_ID ||
    DISCORD_CLIENT_ID === "COLOQUE_SEU_CLIENT_ID_AQUI"
  ) {
    showToast("Configure o Client ID do Discord no script.js.");
    return;
  }

  const state = crypto.randomUUID();
  localStorage.setItem("oneDiscordOAuthState", state);
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: getDiscordRedirectUri(),
    response_type: "token",
    scope: "identify guilds.members.read",
    state,
    prompt: "none",
  });
  window.location.href = `${DISCORD_API}/oauth2/authorize?${params.toString()}`;
}

let accountMode = "login";

function getAccountFormData() {
  return {
    username: accountUsername?.value.trim() || "",
    password: accountPassword?.value || "",
  };
}

function updateAccountMode() {
  const isSignup = accountMode === "signup";
  if (accountSubmit) accountSubmit.textContent = isSignup ? "Criar conta" : "Entrar";
  if (accountModeToggle) {
    accountModeToggle.textContent = isSignup
      ? "Já tenho uma conta"
      : "Criar conta";
  }
  if (accountPassword) {
    accountPassword.autocomplete = isSignup ? "new-password" : "current-password";
  }
}

function loginWithLocalAccount(user) {
  const displayName = user.username || user.name || "ONE HUB";
  setLoggedUser({
    id: user.id,
    name: displayName,
    username: displayName,
    avatarInitial: displayName.slice(0, 1).toUpperCase(),
    avatarUrl: "",
    roles: [],
    coins: Number(user.coins) || 0,
  });
  showToast(`Bem-vindo, ${displayName}.`);
}

async function saveAccountToDatabase(action, data) {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      username: data.username,
      password: data.password,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "Nao foi possivel autenticar.");
  }
  return result;
}

async function saveDiscordAccountToDatabase(user) {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "discord",
      discordId: user.id,
      username: user.name || user.username || "Usuario Discord",
      avatarUrl: user.avatarUrl || "",
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "Nao foi possivel salvar login Discord.");
  }
  return result;
}

function normalizeDirectoryKey(value) {
  return String(value || "").trim().toLowerCase();
}

function renderUsersDirectoryTabs() {
  usersDirectoryTabs.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.usersView === usersDirectoryView,
    );
  });
}

function renderDirectoryGroup(container, list, emptyText, type) {
  if (!container) return;
  container.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "directory-empty";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }

  list.forEach((user) => {
    const row = document.createElement("div");
    row.className = "directory-member-row";
    const avatar = document.createElement("span");
    avatar.className = "directory-member-avatar";
    if (user.avatarUrl) {
      avatar.style.backgroundImage = `url("${user.avatarUrl}")`;
      avatar.classList.add("has-image");
    } else {
      avatar.textContent = (user.username || "U").slice(0, 1).toUpperCase();
    }

    const copy = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = user.username || "Usuario";
    const meta = document.createElement("small");
    meta.textContent =
      type === "hub"
        ? user.provider === "discord"
          ? "Login via Discord no Hub"
          : "Login cadastrado no Hub"
        : "Discord sem login";
    copy.append(name, meta);
    row.append(avatar, copy);
    container.append(row);
  });
}

function renderUserDirectoryList() {
  renderUsersDirectoryTabs();
  const discordOnly = usersDirectoryData.discordOnly;
  const hubUsers = usersDirectoryData.hubUsers;
  if (directoryDiscordCount) directoryDiscordCount.textContent = discordOnly.length;
  if (directoryHubCount) directoryHubCount.textContent = hubUsers.length;
  if (directoryDiscordOnlyTotal)
    directoryDiscordOnlyTotal.textContent = discordOnly.length;
  if (directoryHubUsersTotal) directoryHubUsersTotal.textContent = hubUsers.length;
  renderDirectoryGroup(
    directoryDiscordOnlyList,
    discordOnly,
    "Nenhum usuário do Discord sem login encontrado.",
    "discord",
  );
  renderDirectoryGroup(
    directoryHubUsersList,
    hubUsers,
    "Nenhum login cadastrado no Hub ainda.",
    "hub",
  );
}

async function fetchUsersDirectory() {
  const [hubResponse, discordResponse] = await Promise.all([
    fetch(`${API_BASE}/api/users`),
    fetch(`${API_BASE}/api/discord-users`),
  ]);
  const hubUsers = hubResponse.ok ? await hubResponse.json() : [];
  const discordUsers = discordResponse.ok ? await discordResponse.json() : [];
  const hubNames = new Set(
    hubUsers.map((user) => normalizeDirectoryKey(user.username)),
  );
  const hubDiscordIds = new Set(
    hubUsers
      .map((user) => String(user.discordId || "").trim())
      .filter(Boolean),
  );
  const discordOnly = discordUsers.filter(
    (user) =>
      !hubDiscordIds.has(String(user.id || "").trim()) &&
      !hubNames.has(normalizeDirectoryKey(user.username)),
  );

  usersDirectoryData = {
    hubUsers,
    discordOnly,
  };
}

async function refreshUsersDirectory() {
  try {
    await fetchUsersDirectory();
    renderUserDirectoryList();
  } catch (error) {
    console.warn("API users directory:", error.message);
    renderDirectoryGroup(
      directoryDiscordOnlyList,
      [],
      "Nao foi possivel carregar usuários agora.",
      "discord",
    );
  }
}

function openUsersDirectoryConfig() {
  usersDirectoryOverlay?.classList.remove("hidden");
  renderUsersDirectoryTabs();
}

function closeUsersDirectory() {
  usersDirectoryOverlay?.classList.add("hidden");
}

async function toggleUsersDirectorySidebar() {
  const willOpen = usersDirectorySidebar?.classList.contains("hidden");
  usersDirectorySidebar?.classList.toggle("hidden", !willOpen);
  usersDirectoryButton?.classList.toggle("active", willOpen);
  document.body.classList.toggle("directory-open", willOpen);
  if (willOpen) await refreshUsersDirectory();
}

async function saveDiscordBotToken(event) {
  event.preventDefault();
  const token = discordBotTokenInput?.value.trim() || "";
  if (!token) {
    showToast("Cole o token do bot Discord.");
    return;
  }

  const button = discordTokenForm.querySelector("button");
  if (button) button.disabled = true;
  try {
    const response = await fetch(`${API_BASE}/api/discord-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Nao foi possivel salvar.");
    discordBotTokenInput.value = "";
    showToast(
      result.configured
        ? "Token já configurado na Vercel. Recarregando diretório."
        : "Token salvo no servidor local.",
    );
    await refreshUsersDirectory();
    usersDirectoryView = "discord-only";
    renderUsersDirectoryTabs();
  } catch (error) {
    console.warn("API discord-token:", error.message);
    showToast(
      window.location.protocol === "file:"
        ? "Servidor Node local desligado. Inicie o servidor para salvar o token."
        : "Nao foi possivel salvar o token no servidor.",
    );
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleAccountSubmit(event) {
  event.preventDefault();
  const data = getAccountFormData();
  if (!data.username || !data.password) {
    showToast("Informe usuario e senha.");
    return;
  }

  const action = accountMode === "signup" ? "signup" : "login";
  if (accountSubmit) accountSubmit.disabled = true;
  try {
    const user = await saveAccountToDatabase(action, data);
    loginWithLocalAccount(user);
  } catch (error) {
    console.warn("API users:", error.message);
    showToast(error.message || "Verifique o servidor Node.");
  } finally {
    if (accountSubmit) accountSubmit.disabled = false;
  }
}

function loginWithTestUser() {
  setLoggedUser({
    id: "test-user",
    name: TEST_LOGIN_USERNAME,
    username: TEST_LOGIN_USERNAME,
    avatarInitial: TEST_LOGIN_USERNAME.slice(0, 1).toUpperCase(),
    avatarUrl: "",
    roles: [ADMIN_ROLE_ID],
    coins: 0,
  }, "test");
  showToast("Login teste ativado.");
}

function loginWithTestCredentials() {
  const data = getAccountFormData();
  if (
    data.username === TEST_LOGIN_USERNAME &&
    data.password === TEST_LOGIN_PASSWORD
  ) {
    loginWithTestUser();
    return;
  }
  showToast("Usuario teste ou senha invalida.");
}

async function finishDiscordLoginFromCallback() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  if (!accessToken) return false;

  const expectedState = localStorage.getItem("oneDiscordOAuthState");
  if (expectedState && params.get("state") !== expectedState) {
    localStorage.removeItem("oneDiscordOAuthState");
    showToast("Login Discord recusado por seguranca.");
    return false;
  }

  localStorage.removeItem("oneDiscordOAuthState");
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    showToast("Nao foi possivel validar o Discord.");
    return false;
  }

  discordUser = normalizeDiscordUser(await response.json());
  discordUser.roles = await fetchDiscordRoles(accessToken);
  try {
    const hubUser = await saveDiscordAccountToDatabase(discordUser);
    discordUser.hubId = hubUser.id;
    discordUser.coins = Number(hubUser.coins) || 0;
  } catch (error) {
    console.warn("API users discord:", error.message);
    discordUser.coins = Number(discordUser.coins) || 0;
  }
  discordSession = {
    accessToken,
    user: discordUser,
    createdAt: Date.now(),
  };
  isLoggedIn = true;
  localStorage.setItem("oneDiscordSession", JSON.stringify(discordSession));
  syncAuthState();
  window.location.hash = "home";
  showToast("Bem-vindo ao ONE HUB.");
  showPage();
  return true;
}

async function refreshSavedDiscordRoles() {
  if (
    !isLoggedIn ||
    discordSession?.test ||
    discordSession?.local ||
    !discordSession?.accessToken
  ) {
    return;
  }
  if (Array.isArray(discordUser.roles) && discordUser.roles.length) {
    return;
  }

  discordUser.roles = await fetchDiscordRoles(discordSession.accessToken);
  discordSession.user = discordUser;
  localStorage.setItem("oneDiscordSession", JSON.stringify(discordSession));
}

function logoutDiscord() {
  isLoggedIn = false;
  discordSession = null;
  discordUser = {
    name: "Kawanone",
    avatarInitial: "K",
    roles: [],
  };
  localStorage.removeItem("oneDiscordSession");
  localStorage.removeItem("oneDiscordOAuthState");
  sessionStorage.removeItem("oneSettingsAccess");
  syncAuthState();
  window.location.hash = "login";
  showToast("Conta Discord desconectada.");
  showPage();
}

function showGamesMenu() {
  gamesMenu.classList.remove("hidden");
  rouletteGame.classList.add("hidden");
}

function openGame(gameId) {
  if (gameId !== "roulette") return;
  gamesMenu.classList.add("hidden");
  rouletteGame.classList.remove("hidden");
  rouletteWheel.style.transform = "translateX(0)";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHubCards() {
  hubCards.innerHTML = "";

  Object.entries(hubConfig).forEach(([key, config]) => {
    const meta = categoryMeta[config.target] || categoryMeta.events;
    const card = document.createElement("article");
    card.className = "feature-card";
    card.dataset.target = `#${config.target}`;
    card.innerHTML = `
      <div class="feature-visual ${meta.visual} ${config.imageUrl ? "has-image" : ""}">
        ${config.imageUrl ? `<img src="${config.imageUrl}" alt="" />` : ""}
        ${key === "live" ? '<span class="live-dot"></span>' : ""}
        <span class="big-icon">${meta.symbol}</span>
        <strong>${config.title}</strong>
      </div>
      <div class="feature-body">
        <span>${config.badge}  ${meta.label}</span>
        <h2>${config.title}</h2>
        <p>${config.description}</p>
      </div>
    `;
    card.addEventListener("click", async () => {
      if (key === "live" && config.eventId) {
        const event = eventItems.find((item) => item.id === config.eventId);
        if (event) {
          setCurrentEvent(event);
          eventJoined = false;
          await renderEventContent();
        }
      }
      window.location.hash = card.dataset.target;
    });
    hubCards.append(card);
  });
}

function syncHubLiveWithLatestEvent() {
  const latestEvent = eventItems[0] || eventConfig;
  hubConfig.live.target = "event-detail";
  hubConfig.live.eventId = latestEvent.id;
  hubConfig.live.title = latestEvent.title;
  hubConfig.live.description = latestEvent.mainDescription;
  hubConfig.live.imageUrl = latestEvent.bannerUrl;
}

function syncSettingsForms() {
  document.querySelectorAll(".hub-config").forEach((form) => {
    const config = hubConfig[form.dataset.card];
    form.querySelector('[name="target"]').value = config.target;
    form.querySelector('[name="title"]').value = config.title;
    form.querySelector('[name="description"]').value = config.description;
  });
}

function bindSettingsForms() {
  document.querySelectorAll(".hub-config").forEach((form) => {
    const readForm = () => {
      const config = hubConfig[form.dataset.card];
      config.target = form.querySelector('[name="target"]').value;
      config.title =
        form.querySelector('[name="title"]').value.trim() ||
        categoryMeta[config.target].label;
      config.description =
        form.querySelector('[name="description"]').value.trim() ||
        "Configure esta chamada nos Ajustes.";
      renderHubCards();
    };

    form.addEventListener("input", readForm);
    form.addEventListener("change", readForm);
  });
}

function showSettingsTab(tabId) {
  settingsTabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.settingsTab === tabId);
  });
  if (settingsContentTitle) {
    settingsContentTitle.textContent = settingsTabTitles[tabId] || "Ajustes";
  }
  settingsSections.forEach((section) => {
    section.classList.toggle(
      "active",
      section.dataset.settingsSection === tabId,
    );
  });
}

const globalThemeClasses = [
  "hub-theme-blueprint",
  "hub-theme-midnight",
  "hub-theme-hello-kit",
  "hub-theme-cartas-megan",
];

function applyGlobalTheme(theme = "default") {
  globalTheme = theme || "default";
  document.body.classList.remove(...globalThemeClasses);
  if (globalTheme !== "default") {
    document.body.classList.add(`hub-theme-${globalTheme}`);
  }
  globalThemeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.globalTheme === globalTheme);
  });
}

async function loadGlobalThemeFromApi() {
  try {
    const response = await fetch(`${API_BASE}/api/site-settings?key=globalTheme`);
    if (!response.ok) throw new Error("Tema indisponivel");
    const setting = await response.json();
    applyGlobalTheme(setting?.value || "default");
  } catch (error) {
    console.warn("API site-settings:", error.message);
    applyGlobalTheme(globalTheme);
  }
}

async function saveGlobalTheme(theme) {
  applyGlobalTheme(theme);
  try {
    const response = await fetch(`${API_BASE}/api/site-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "globalTheme", value: theme }),
    });
    if (!response.ok) throw new Error("Nao foi possivel salvar tema");
    showToast("Tema global salvo no banco de dados.");
  } catch (error) {
    console.warn("API site-settings:", error.message);
    showToast("Nao foi possivel salvar o tema global.");
  }
}

function filterSettingsSidebar() {
  const term = settingsSidebarSearch?.value.trim().toLowerCase() || "";
  settingsTabButtons.forEach((button) => {
    const label = button.textContent.trim().toLowerCase();
    button.classList.toggle("hidden", term && !label.includes(term));
  });
}

function filterCoinRows() {
  const term = coinPlayerSearch?.value.trim().toLowerCase() || "";
  Array.from(hubCoinRows?.querySelectorAll("[data-player-balance]") || []).forEach((row) => {
    const player = row.querySelector(".coin-player")?.textContent.toLowerCase() || "";
    row.classList.toggle("hidden", term && !player.includes(term));
  });
}

function renderHubCoinUsers() {
  if (!hubCoinRows) return;
  const term = coinPlayerSearch?.value.trim().toLowerCase() || "";
  hubCoinRows.innerHTML = "";

  if (!hubCoinUsers.length) {
    const empty = document.createElement("div");
    empty.className = "one-coins-row one-coins-empty";
    empty.textContent = "Nenhum usuário com login no Hub ainda.";
    hubCoinRows.append(empty);
    return;
  }

  hubCoinUsers.forEach((user) => {
    const row = document.createElement("div");
    row.className = "one-coins-row";
    row.dataset.playerBalance = String(Number(user.coins) || 0);
    row.dataset.userId = user.id;

    const player = document.createElement("span");
    player.className = "coin-player";
    const initial = document.createElement("b");
    initial.textContent = (user.username || "U").slice(0, 1).toUpperCase();
    player.append(initial, document.createTextNode(user.username || "Usuario"));

    const balance = document.createElement("span");
    balance.className = "coin-balance";
    balance.textContent = formatCoins(Number(user.coins) || 0);

    const actions = document.createElement("span");
    actions.className = "coin-actions";
    const add = document.createElement("button");
    add.className = "coin-add";
    add.type = "button";
    add.textContent = "+ Adicionar";
    add.addEventListener("click", () => askCoinAmount(user, "add"));
    const remove = document.createElement("button");
    remove.className = "coin-remove";
    remove.type = "button";
    remove.textContent = "- Remover";
    remove.addEventListener("click", () => askCoinAmount(user, "remove"));
    actions.append(add, remove);

    row.append(player, balance, actions);
    row.classList.toggle(
      "hidden",
      Boolean(term && !player.textContent.toLowerCase().includes(term)),
    );
    hubCoinRows.append(row);
  });
}

async function loadHubCoinUsers() {
  if (!hubCoinRows) return;
  try {
    const response = await fetch(`${API_BASE}/api/users`);
    if (!response.ok) throw new Error("Usuarios indisponiveis");
    hubCoinUsers = await response.json();
    renderHubCoinUsers();
    syncCurrentUserCoinsFromDb();
  } catch (error) {
    console.warn("API users:", error.message);
    hubCoinUsers = [];
    renderHubCoinUsers();
  }
}

function syncCurrentUserCoinsFromDb() {
  const userId = getCurrentUserId();
  if (!userId) return;
  const user = hubCoinUsers.find(
    (u) => u.id === userId || u.discordId === userId,
  );
  if (!user) return;
  coins = Number(user.coins) || 0;
  discordUser.coins = coins;
  if (discordSession?.user) {
    discordSession.user = discordUser;
    localStorage.setItem("oneDiscordSession", JSON.stringify(discordSession));
  }
  updateBalances();
}

function askCoinAmount(user, action) {
  const actionLabel = action === "add" ? "adicionar" : "remover";
  const value = window.prompt(
    `Informe quantos ONE COINS deseja ${actionLabel} para ${user.username}:`,
    "100",
  );
  if (value === null) return;

  const amount = Math.floor(Number(value));
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast("Informe um valor maior que zero.");
    return;
  }

  updateUserCoins(user.id, action === "add" ? amount : -amount);
}

async function updateUserCoins(userId, delta) {
  try {
    const response = await fetch(`${API_BASE}/api/users/coins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, delta }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Nao foi possivel atualizar.");
    const index = hubCoinUsers.findIndex((user) => user.id === userId);
    if (index >= 0) hubCoinUsers[index] = result;
    if (discordUser.id === userId || discordUser.hubId === userId) {
      coins = Number(result.coins) || 0;
      discordUser.coins = coins;
      if (discordSession?.user) {
        discordSession.user = discordUser;
        localStorage.setItem("oneDiscordSession", JSON.stringify(discordSession));
      }
      updateBalances();
    }
    renderHubCoinUsers();
    showToast("Saldo atualizado no banco de dados.");
  } catch (error) {
    console.warn("API users/coins:", error.message);
    showToast("Nao foi possivel atualizar os coins.");
  }
}

function getCurrentUserCoins() {
  return coins;
}

async function saveUserCoinDelta(delta) {
  const userId = getCurrentUserId();
  if (!userId || delta === 0) return;
  try {
    const response = await fetch(`${API_BASE}/api/users/coins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, delta }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Falha ao salvar coins");
    coins = Number(result.coins) || 0;
    discordUser.coins = coins;
    if (discordSession?.user) {
      discordSession.user = discordUser;
      localStorage.setItem("oneDiscordSession", JSON.stringify(discordSession));
    }
    updateBalances();
  } catch (error) {
    console.warn("saveUserCoinDelta:", error.message);
  }
}

function renderGameBanners() {
  const roulette = gameConfig.roulette;
  rouletteBannerStatus.textContent = roulette.status;
  rouletteBannerTitle.textContent = roulette.title;
  rouletteBannerDescription.textContent = roulette.description;
  if (settingsGamePreviewTitle) {
    settingsGamePreviewTitle.textContent = roulette.title;
  }
  if (settingsGamePreviewDescription) {
    settingsGamePreviewDescription.textContent = roulette.description;
  }

  if (roulette.imageUrl) {
    rouletteBannerImage.src = roulette.imageUrl;
    rouletteBannerArt.classList.add("has-image");
    rouletteBannerMark.textContent = "";
    if (settingsGamePreviewImage) {
      settingsGamePreviewImage.src = roulette.imageUrl;
    }
  } else {
    rouletteBannerImage.removeAttribute("src");
    rouletteBannerArt.classList.remove("has-image");
    rouletteBannerMark.textContent = "ONE";
    if (settingsGamePreviewImage) {
      settingsGamePreviewImage.src =
        "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-04_164833039.png";
    }
  }
}

rouletteBannerImage.addEventListener("error", () => {
  rouletteBannerImage.removeAttribute("src");
  rouletteBannerArt.classList.remove("has-image");
  rouletteBannerMark.textContent = "ONE";
  showToast("Nao foi possivel carregar a imagem do banner.");
});

function syncGameConfigForms() {
  document.querySelectorAll(".game-status-config").forEach((form) => {
    const config = gameConfig[form.dataset.game];
    form.querySelector('[name="status"]').value = config.status;
  });

  document.querySelectorAll(".game-config").forEach((form) => {
    const config = gameConfig[form.dataset.game];
    form.querySelector('[name="title"]').value = config.title;
    form.querySelector('[name="description"]').value = config.description;
    form.querySelector('[name="imageUrl"]').value = config.imageUrl;
  });
}

function bindGameConfigForms() {
  document.querySelectorAll(".game-status-config").forEach((form) => {
    const readForm = () => {
      const config = gameConfig[form.dataset.game];
      config.status = form.querySelector('[name="status"]').value;
      renderGameBanners();
    };

    form.addEventListener("input", readForm);
    form.addEventListener("change", readForm);
  });

  document.querySelectorAll(".game-config").forEach((form) => {
    const readForm = () => {
      const config = gameConfig[form.dataset.game];
      config.title =
        form.querySelector('[name="title"]').value.trim() || "Roleta ONE";
      config.description =
        form.querySelector('[name="description"]').value.trim() ||
        "Configure a descricao do jogo nos Ajustes.";
      config.imageUrl = form.querySelector('[name="imageUrl"]').value.trim();
      renderGameBanners();
    };

    form.addEventListener("input", readForm);
    form.addEventListener("change", readForm);
  });
}

function createEventTag(icon, text) {
  const tag = document.createElement("span");
  const iconWrap = document.createElement("span");
  iconWrap.className = "event-tag-icon";
  iconWrap.innerHTML = icon;
  tag.append(iconWrap, document.createTextNode(text));
  return tag;
}

const eventIcons = {
  hours:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg>',
  location:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  reward:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>',
};

function renderEventTags(container, config = eventConfig) {
  container.innerHTML = "";
  container.append(
    createEventTag(eventIcons.hours, config.hours),
    createEventTag(eventIcons.location, config.location),
    createEventTag(eventIcons.reward, config.reward),
  );
}

function renderEventDescription() {
  eventDetailDescription.innerHTML = "";
  eventConfig.detailDescription
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .forEach((block) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = block;
      eventDetailDescription.append(paragraph);
    });
}

function isEventClosed(config = eventConfig) {
  return config.status === "closed";
}

function getEventStatusLabel(config = eventConfig) {
  return isEventClosed(config) ? "ENCERRADO" : "ATIVO";
}

function apiEventToConfig(event) {
  return {
    id: event.id || event._id || event.title || "evento-one",
    title: event.title || "Novo evento ONE",
    date: event.createdAt
      ? new Date(event.createdAt).toISOString().slice(0, 10)
      : event.date || new Date().toISOString().slice(0, 10),
    status: event.status || "active",
    mainDescription:
      event.mainDescription || "Configure a descricao principal do evento.",
    bannerUrl:
      event.bannerUrl ||
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-04_164833039.png",
    hours: event.eventTime || event.hours || "22:00 Horas",
    location: event.location || "Hotel Presságio",
    reward: event.reward || "350K + 10 One Coins",
    detailDescription:
      event.detailDescription ||
      event.mainDescription ||
      "Configure a descricao do evento.",
  };
}

function setCurrentEvent(event) {
  Object.assign(eventConfig, apiEventToConfig(event));
}

function createPublicEventCard(config) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.dataset.eventId = config.id;

  const mark = document.createElement("div");
  mark.className = "event-mark banner-mark";
  const image = document.createElement("img");
  image.src = config.bannerUrl;
  image.alt = `Banner ${config.title}`;
  mark.append(image);

  const copy = document.createElement("div");
  copy.className = "event-copy";
  const status = document.createElement("span");
  status.className = "status";
  status.textContent = isEventClosed(config) ? "Encerrado" : "Ativo agora";
  const title = document.createElement("h2");
  title.textContent = config.title;
  const description = document.createElement("p");
  description.textContent = config.mainDescription;
  const tags = document.createElement("div");
  tags.className = "event-stats";
  renderEventTags(tags, config);
  copy.append(status, title, description, tags);

  const button = document.createElement("button");
  button.className = `button primary${isEventClosed(config) ? " ended" : ""}`;
  button.type = "button";
  button.textContent = isEventClosed(config) ? "EVENTO ENCERRADO" : "Participar";
  button.disabled = isEventClosed(config);

  const openEvent = async () => {
    setCurrentEvent(config);
    eventJoined = false;
    await renderEventContent();
    window.location.hash = "event-detail";
  };

  card.addEventListener("click", openEvent);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openEvent();
  });

  card.append(mark, copy, button);
  return card;
}

function renderEventsList() {
  if (!eventsList) return;
  eventsList.innerHTML = "";
  eventItems.forEach((event) => eventsList.append(createPublicEventCard(event)));
  renderSettingsEventsRows();
}

function createIconButton(label, icon, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.innerHTML = icon;
  button.addEventListener("click", onClick);
  return button;
}

function closeEventParticipantsModal() {
  eventParticipantsOverlay?.classList.add("hidden");
}

function renderParticipantsModal(config, participants) {
  if (!eventParticipantsList) return;
  eventParticipantsTitle.textContent = config.title;
  eventParticipantsSubtitle.textContent = `${participants.length} participante${participants.length === 1 ? "" : "s"} inscrito${participants.length === 1 ? "" : "s"}.`;
  eventParticipantsList.innerHTML = "";

  if (!participants.length) {
    const empty = document.createElement("p");
    empty.className = "participants-empty";
    empty.textContent = "Nenhum participante inscrito neste evento ainda.";
    eventParticipantsList.append(empty);
    return;
  }

  participants.forEach((participant) => {
    const row = document.createElement("div");
    row.className = "participant-row";
    const avatar = document.createElement("span");
    avatar.className = "participant-avatar";
    avatar.textContent = (participant.username || "O").trim().charAt(0).toUpperCase();
    const info = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = participant.username || "ONE HUB";
    const status = document.createElement("small");
    status.textContent = "Participando";
    info.append(name, status);
    row.append(avatar, info);
    eventParticipantsList.append(row);
  });
}

async function fetchEventParticipants(eventId) {
  const response = await fetch(
    `${API_BASE}/api/event-participants?eventId=${encodeURIComponent(eventId)}`,
  );
  if (!response.ok) throw new Error("Nao foi possivel carregar inscritos");
  return response.json();
}

async function showEventParticipants(config) {
  eventParticipantsOverlay?.classList.remove("hidden");
  if (eventParticipantsTitle) eventParticipantsTitle.textContent = config.title;
  if (eventParticipantsSubtitle)
    eventParticipantsSubtitle.textContent = "Carregando participantes...";
  if (eventParticipantsList) eventParticipantsList.innerHTML = "";

  try {
    const participants = await fetchEventParticipants(config.id);
    renderParticipantsModal(config, participants);
  } catch (error) {
    console.warn("API event-participants:", error.message);
    if (eventParticipantsSubtitle)
      eventParticipantsSubtitle.textContent = "Nao foi possivel carregar.";
    if (eventParticipantsList) {
      eventParticipantsList.innerHTML = "";
      const empty = document.createElement("p");
      empty.className = "participants-empty";
      empty.textContent = "Verifique o servidor Node ou a conexao com o MongoDB.";
      eventParticipantsList.append(empty);
    }
  }
}

async function updateEventParticipantCount(config, target) {
  try {
    const participants = await fetchEventParticipants(config.id);
    target.textContent = participants.length;
  } catch (error) {
    console.warn("API event-participants:", error.message);
  }
}

async function deleteEventFromApi(eventId) {
  const response = await fetch(
    `${API_BASE}/api/events?id=${encodeURIComponent(eventId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new Error("Nao foi possivel excluir o evento");
  return response.json();
}

async function updateEventInApi(eventId, eventData) {
  const response = await fetch(
    `${API_BASE}/api/events?id=${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    },
  );
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    const error = new Error(result.error || "Nao foi possivel atualizar o evento");
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function deleteEvent(config) {
  const confirmed = window.confirm(`Excluir o evento "${config.title}"?`);
  if (!confirmed) return;

  try {
    await deleteEventFromApi(config.id);
    eventItems = eventItems.filter((event) => event.id !== config.id);
    if (!eventItems.length) {
      syncHubLiveWithLatestEvent();
      renderEventsList();
      renderSettingsEventsRows();
      renderHubCards();
      showToast("Evento excluido do banco de dados.");
      return;
    }
    if (eventConfig.id === config.id) {
      setCurrentEvent(eventItems[0]);
    }
    syncHubLiveWithLatestEvent();
    await renderEventContent();
    showToast("Evento excluido do banco de dados.");
  } catch (error) {
    console.warn("API events:", error.message);
    showToast("Nao foi possivel excluir no banco de dados.");
  }
}

async function closeEvent(config) {
  try {
    const event = await updateEventInApi(config.id, { status: "closed" });
    const updatedConfig = apiEventToConfig(event);
    const itemIndex = eventItems.findIndex((item) => item.id === config.id);
    if (itemIndex >= 0) eventItems[itemIndex] = updatedConfig;
    syncHubLiveWithLatestEvent();
    if (eventConfig.id === config.id) {
      setCurrentEvent(updatedConfig);
      eventJoined = false;
    }
    await renderEventContent();
    showToast("Evento encerrado e salvo no banco de dados.");
  } catch (error) {
    console.warn("API events:", error.message);
    if (error.status === 404) {
      try {
        const event = await saveEventToApi({ ...config, status: "closed" }, { apply: false });
        const updatedConfig = apiEventToConfig(event);
        const itemIndex = eventItems.findIndex((item) => item.id === config.id);
        if (itemIndex >= 0) eventItems[itemIndex] = updatedConfig;
        syncHubLiveWithLatestEvent();
        if (eventConfig.id === config.id) {
          setCurrentEvent(updatedConfig);
          eventJoined = false;
        }
        await renderEventContent();
        showToast("Evento encerrado e criado no banco de dados.");
        return;
      } catch (createError) {
        console.warn("API events:", createError.message);
      }
    }
    showToast("Nao foi possivel encerrar no banco de dados.");
  }
}

const settingsEventActionIcons = {
  edit:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  close:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>',
  delete:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
  users:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>',
};

function renderSettingsEventsRows() {
  if (!settingsEventsRows) return;
  settingsEventsRows.innerHTML = "";

  if (!eventItems.length) {
    const empty = document.createElement("div");
    empty.className = "settings-events-row settings-events-empty";
    empty.textContent = "Nenhum evento criado ainda.";
    settingsEventsRows.append(empty);
    return;
  }

  eventItems.forEach((config, index) => {
    const row = document.createElement("div");
    row.className = "settings-events-row";
    row.setAttribute("role", "row");

    const title = document.createElement("strong");
    title.setAttribute("role", "cell");
    title.textContent = config.title;

    const date = document.createElement("span");
    date.setAttribute("role", "cell");
    date.textContent = config.date;

    const statusCell = document.createElement("span");
    statusCell.setAttribute("role", "cell");
    const status = document.createElement("mark");
    status.textContent = getEventStatusLabel(config);
    status.classList.toggle("closed", isEventClosed(config));
    statusCell.append(status);

    const users = document.createElement("button");
    users.type = "button";
    users.setAttribute("role", "cell");
    users.className = "settings-event-users settings-event-users-button";
    users.innerHTML = `${settingsEventActionIcons.users}<span>0</span>`;
    users.addEventListener("click", () => showEventParticipants(config));
    updateEventParticipantCount(config, users.querySelector("span"));

    const actions = document.createElement("span");
    actions.setAttribute("role", "cell");
    actions.className = "settings-event-actions";
    actions.append(
      createIconButton("Editar evento", settingsEventActionIcons.edit, async () => {
        setCurrentEvent(config);
        await renderEventContent();
        openEventEditModal();
      }),
      createIconButton("Encerrar evento", settingsEventActionIcons.close, () => {
        closeEvent(config);
      }),
      createIconButton("Excluir evento", settingsEventActionIcons.delete, () => {
        deleteEvent(config);
      }),
    );

    row.append(title, date, statusCell, users, actions);
    settingsEventsRows.append(row);
  });
}

function syncCurrentEventInList() {
  const index = eventItems.findIndex((event) => event.id === eventConfig.id);
  const current = { ...eventConfig };
  if (index >= 0) {
    eventItems[index] = current;
  } else {
    eventItems.unshift(current);
  }
}

function fillEventEditForm() {
  if (!eventEditForm) return;
  eventEditForm.querySelector('[name="title"]').value = eventConfig.title;
  eventEditForm.querySelector('[name="mainDescription"]').value =
    eventConfig.mainDescription;
  eventEditForm.querySelector('[name="bannerUrl"]').value =
    eventConfig.bannerUrl;
  eventEditForm.querySelector('[name="hours"]').value = eventConfig.hours;
  eventEditForm.querySelector('[name="location"]').value =
    eventConfig.location;
  eventEditForm.querySelector('[name="reward"]').value = eventConfig.reward;
  eventEditForm.querySelector('[name="detailDescription"]').value =
    eventConfig.detailDescription;
}

function openEventEditModal() {
  fillEventEditForm();
  eventEditOverlay?.classList.remove("hidden");
}

function closeEventEditModal() {
  eventEditOverlay?.classList.add("hidden");
}

async function applyEventEditForm() {
  if (!eventEditForm) return;
  eventConfig.title =
    eventEditForm.querySelector('[name="title"]').value.trim() ||
    eventConfig.title;
  eventConfig.mainDescription =
    eventEditForm.querySelector('[name="mainDescription"]').value.trim() ||
    eventConfig.mainDescription;
  eventConfig.bannerUrl =
    eventEditForm.querySelector('[name="bannerUrl"]').value.trim() ||
    eventConfig.bannerUrl;
  eventConfig.hours =
    eventEditForm.querySelector('[name="hours"]').value.trim() ||
    eventConfig.hours;
  eventConfig.location =
    eventEditForm.querySelector('[name="location"]').value.trim() ||
    eventConfig.location;
  eventConfig.reward =
    eventEditForm.querySelector('[name="reward"]').value.trim() ||
    eventConfig.reward;
  eventConfig.detailDescription =
    eventEditForm.querySelector('[name="detailDescription"]').value.trim() ||
    eventConfig.detailDescription;
  await renderEventContent();
  syncEventConfigForm();
}

async function renderEventContent() {
  syncCurrentEventInList();
  syncHubLiveWithLatestEvent();
  eventDetailTitle.textContent = eventConfig.title;
  eventDetailMainDescription.textContent = eventConfig.mainDescription;
  if (eventDetailStatus) eventDetailStatus.textContent = isEventClosed() ? "Encerrado" : "Ativo agora";
  eventDetailBanner.src = eventConfig.bannerUrl;
  eventDetailBanner.alt = `Banner ${eventConfig.title}`;
  renderEventTags(eventDetailTags);
  renderEventDescription();
  renderSettingsEventsRows();
  await checkUserParticipation();
  updateEventButtons();
  renderEventsList();
  renderHubCards();
}

function applyApiEvent(event) {
  if (!event) return;
  setCurrentEvent(event);
}

async function loadEventsFromApi({ selectLatest = false } = {}) {
  try {
    const response = await fetch(`${API_BASE}/api/events`);
    if (!response.ok) throw new Error("Eventos indisponiveis");
    const events = await response.json();
    if (!Array.isArray(events) || !events.length) {
      eventItems = [{ ...eventConfig }];
      syncHubLiveWithLatestEvent();
      renderEventsList();
      return;
    }
    eventItems = events.map(apiEventToConfig);
    syncHubLiveWithLatestEvent();
    const selectedStillExists = eventItems.some(
      (event) => event.id === eventConfig.id,
    );
    if (selectLatest || !selectedStillExists) setCurrentEvent(eventItems[0]);
    renderEventsList();
  } catch (error) {
    console.warn("API events:", error.message);
    eventItems = [{ ...eventConfig }];
    syncHubLiveWithLatestEvent();
    renderEventsList();
  }
}

async function saveEventToApi(eventData = eventConfig, { apply = true } = {}) {
  const response = await fetch(`${API_BASE}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: eventData.title,
      mainDescription: eventData.mainDescription,
      detailDescription: eventData.detailDescription,
      bannerUrl: eventData.bannerUrl,
      eventTime: eventData.hours,
      location: eventData.location,
      reward: eventData.reward,
      status: eventData.status,
    }),
  });
  if (!response.ok) throw new Error("Nao foi possivel salvar o evento");
  const event = await response.json();
  if (apply) applyApiEvent(event);
  return event;
}

function syncEventConfigForm() {
  const form = document.querySelector("#eventCreateForm");
  if (!form) return;
  form.reset();
  form.querySelector('[name="title"]').value = "";
  form.querySelector('[name="mainDescription"]').value = "";
  form.querySelector('[name="bannerUrl"]').value = "";
  form.querySelector('[name="hours"]').value = "";
  form.querySelector('[name="location"]').value = "";
  form.querySelector('[name="reward"]').value = "";
  form.querySelector('[name="detailDescription"]').value = "";
}

function bindEventConfigForm() {
  const form = document.querySelector("#eventCreateForm");
  if (!form) return;

  const readForm = () => {
    const mainDescription =
      form.querySelector('[name="mainDescription"]').value.trim() ||
      "Configure a descricao principal do evento.";
    return {
      title:
        form.querySelector('[name="title"]').value.trim() || "Novo evento ONE",
      mainDescription,
      bannerUrl:
        form.querySelector('[name="bannerUrl"]').value.trim() ||
        "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-04_164833039.png",
      hours:
        form.querySelector('[name="hours"]').value.trim() || "22:00 Horas",
      location:
        form.querySelector('[name="location"]').value.trim() || "Hotel Presságio",
      reward:
        form.querySelector('[name="reward"]').value.trim() ||
        "350K + 10 One Coins",
      detailDescription:
        form.querySelector('[name="detailDescription"]').value.trim() ||
        mainDescription,
      status: "active",
    };
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newEvent = readForm();
    try {
      await saveEventToApi(newEvent, { apply: false });
      await loadEventsFromApi();
      syncEventConfigForm();
      showToast("Novo evento criado e adicionado na categoria Eventos.");
    } catch (error) {
      console.warn("API events:", error.message);
      showToast("Nao foi possivel criar o evento. Verifique o servidor Node.");
    }
  });
}

function getProductRarity(category, rarity) {
  return category === "theme" ? `theme-${rarity}` : rarity;
}

function buildProductName(category, rarity) {
  const categoryLabel = shopCategoryLabels[category] || "Produto";
  const rarityLabel = shopRarityLabels[rarity] || "Comum";
  return `${categoryLabel} ${rarityLabel}`;
}

function buildProductDescription(category, rarity, quantity) {
  const categoryLabel = shopCategoryLabels[category] || "Produto";
  const rarityLabel = shopRarityLabels[rarity] || "Comum";
  return `${categoryLabel} ${rarityLabel.toLowerCase()} criado nos Ajustes com ${quantity} unidade${quantity === 1 ? "" : "s"} disponiveis.`;
}

function apiProductToShopItem(product) {
  const categoryMap = {
    moldura: "frame",
    molduras: "frame",
    tema: "theme",
    temas: "theme",
    tag: "title",
    tags: "title",
  };
  const type = categoryMap[product.category] || product.category || "fivem";
  const rarity = product.rarity || "common";

  return {
    id: `api-${product.id}`,
    apiId: product.id,
    name: product.name || buildProductName(type, rarity),
    desc:
      product.description ||
      buildProductDescription(type, rarity, Number(product.quantity) || 1),
    price: Math.max(0, Number(product.price) || 0),
    type,
    typeLabel: shopRarityLabels[rarity] || "Comum",
    rarity: getProductRarity(type, rarity),
    effect: type === "title" ? product.name : `custom-${type}-${rarity}`,
    image: `custom-product ${type}-product ${rarity}-product`,
    imageUrl: product.bannerUrl || "",
    quantity: Math.max(1, Number(product.quantity) || 1),
  };
}

async function loadShopProductsFromApi() {
  try {
    const response = await fetch(`${API_BASE}/api/shop-products`);
    if (!response.ok) throw new Error("Produtos indisponiveis");
    const products = await response.json();
    for (let index = shopItems.length - 1; index >= 0; index -= 1) {
      if (shopItems[index].apiId) shopItems.splice(index, 1);
    }
    products
      .reverse()
      .forEach((product) => shopItems.unshift(apiProductToShopItem(product)));
    renderShopProductEditorList();
  } catch (error) {
    console.warn("API shop-products:", error.message);
  }
}

async function saveProductToApi(data) {
  const response = await fetch(`${API_BASE}/api/shop-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Nao foi possivel salvar o produto");
  return apiProductToShopItem(await response.json());
}

async function updateProductInApi(productId, data) {
  const response = await fetch(
    `${API_BASE}/api/shop-products?id=${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Nao foi possivel atualizar.");
  return apiProductToShopItem(result);
}

async function deleteProductFromApi(productId) {
  const response = await fetch(
    `${API_BASE}/api/shop-products?id=${encodeURIComponent(productId)}`,
    { method: "DELETE" },
  );
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Nao foi possivel remover.");
  return result;
}

function createShopProduct(data) {
  const quantity = Math.max(1, Number(data.quantity) || 1);
  const category = data.category;
  const rarity = data.rarity;
  const id = `custom-${category}-${Date.now()}`;

  const item = {
    id,
    name: data.name || buildProductName(category, rarity),
    desc:
      data.description || buildProductDescription(category, rarity, quantity),
    price: Math.max(0, Number(data.price) || 0),
    type: category,
    typeLabel: shopRarityLabels[rarity] || "Comum",
    rarity: getProductRarity(category, rarity),
    effect:
      category === "title"
        ? `${shopRarityLabels[rarity] || "Comum"} ONE`
        : `custom-${category}-${rarity}`,
    image: `custom-product ${category}-product ${rarity}-product`,
    imageUrl: data.bannerUrl,
    quantity,
  };
  shopItems.unshift(item);
  return item;
}

function renderShopProductEditorList() {
  if (!shopProductEditorList) return;
  const apiItems = shopItems.filter((item) => item.apiId);
  shopProductEditorList.innerHTML = "";

  if (!apiItems.length) {
    const empty = document.createElement("div");
    empty.className = "settings-placeholder";
    empty.innerHTML = "<strong>Nenhum produto criado</strong><span>Crie um produto para editar aqui.</span>";
    shopProductEditorList.append(empty);
    return;
  }

  apiItems.forEach((item) => {
    const form = document.createElement("form");
    form.className = "shop-product-edit-card";
    form.innerHTML = `
      <div class="shop-product-edit-preview">
        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="" />` : `<span>${item.name.slice(0, 1)}</span>`}
      </div>
      <div class="shop-product-edit-fields">
        <label>Nome<input name="name" type="text" value="${item.name.replace(/"/g, "&quot;")}" /></label>
        <label>Descrição<textarea name="description" rows="2">${item.desc}</textarea></label>
        <div class="form-row">
          <label>Categoria
            <select name="category">
              <option value="fivem"${item.type === "fivem" ? " selected" : ""}>Fivem</option>
              <option value="frame"${item.type === "frame" ? " selected" : ""}>Molduras</option>
              <option value="theme"${item.type === "theme" ? " selected" : ""}>Temas</option>
              <option value="title"${item.type === "title" ? " selected" : ""}>Tag</option>
            </select>
          </label>
          <label>Raridade
            <select name="rarity">
              ${["common", "rare", "epic", "legendary", "ultra"]
                .map((rarity) => `<option value="${rarity}"${item.rarity === getProductRarity(item.type, rarity) || item.rarity === rarity ? " selected" : ""}>${shopRarityLabels[rarity]}</option>`)
                .join("")}
            </select>
          </label>
          <label>Valor<input name="price" type="number" min="0" step="1" value="${item.price}" /></label>
          <label>Quantidade<input name="quantity" type="number" min="1" step="1" value="${item.quantity || 1}" /></label>
        </div>
        <label>Banner<input name="bannerUrl" type="url" value="${(item.imageUrl || "").replace(/"/g, "&quot;")}" /></label>
        <div class="shop-product-edit-actions">
          <button class="button primary" type="submit">Salvar</button>
          <button class="button secondary" type="button" data-remove-product>Remover</button>
        </div>
      </div>
    `;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const updated = await updateProductInApi(item.apiId, data);
        const index = shopItems.findIndex((product) => product.apiId === item.apiId);
        if (index >= 0) shopItems[index] = updated;
        renderShop();
        renderShopProductEditorList();
        showToast("Produto atualizado no banco de dados.");
      } catch (error) {
        console.warn("API shop-products:", error.message);
        showToast("Nao foi possivel atualizar o produto.");
      }
    });

    form.querySelector("[data-remove-product]").addEventListener("click", async () => {
      if (!window.confirm(`Remover "${item.name}" do Shop?`)) return;
      try {
        await deleteProductFromApi(item.apiId);
        const index = shopItems.findIndex((product) => product.apiId === item.apiId);
        if (index >= 0) shopItems.splice(index, 1);
        renderShop();
        renderShopProductEditorList();
        showToast("Produto removido do banco de dados.");
      } catch (error) {
        console.warn("API shop-products:", error.message);
        showToast("Nao foi possivel remover o produto.");
      }
    });

    shopProductEditorList.append(form);
  });
}

function bindProductConfigForm() {
  const form = document.querySelector(".product-config");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const productData = {
      name: form.querySelector('[name="name"]').value.trim(),
      description: form.querySelector('[name="description"]').value.trim(),
      category: form.querySelector('[name="category"]').value,
      rarity: form.querySelector('[name="rarity"]').value,
      bannerUrl: form.querySelector('[name="bannerUrl"]').value.trim(),
      price: form.querySelector('[name="price"]').value,
      quantity: form.querySelector('[name="quantity"]').value,
    };
    try {
      shopItems.unshift(await saveProductToApi(productData));
      showToast("Produto salvo no MongoDB e adicionado ao Shop.");
      form.reset();
      form.querySelector('[name="price"]').value = "0";
      form.querySelector('[name="quantity"]').value = "1";
    } catch (error) {
      console.warn("API shop-products:", error.message);
      createShopProduct(productData);
      showToast("Produto criado localmente. Verifique o servidor Node.");
    }
    activeShopFilter = "all";
    renderShop();
    renderShopProductEditorList();
  });
}

function updateBalances() {
  document
    .querySelectorAll("#coinBalance, #shopBalance, #gameBalance")
    .forEach((element) => {
      element.textContent = formatCoins(coins);
    });
  if (ticketBalance) ticketBalance.textContent = formatCoins(tickets);
  if (multiplierStatus) {
    multiplierStatus.textContent =
      multiplierSpinsLeft > 0
        ? `${temporaryMultiplier}x por ${multiplierSpinsLeft} giro${multiplierSpinsLeft === 1 ? "" : "s"}`
        : "1x";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(
    () => toast.classList.remove("show"),
    2400,
  );
}

function addCoins(amount, message) {
  coins += amount;
  updateBalances();
  if (message) showToast(message);
}

function renderShop() {
  shopGrid.innerHTML = "";

  shopFilterButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.shopFilter === activeShopFilter,
    );
  });
  const isFrameFilterOpen =
    activeShopFilter === "frame" || frameRarities.includes(activeShopFilter);
  const isThemeFilterOpen =
    activeShopFilter === "theme" || themeRarities.includes(activeShopFilter);
  frameSubfilters.classList.toggle("hidden", !isFrameFilterOpen);
  themeSubfilters.classList.toggle("hidden", !isThemeFilterOpen);
  document
    .querySelector("[data-frame-toggle]")
    .classList.toggle("expanded", isFrameFilterOpen);
  document
    .querySelector("[data-theme-toggle]")
    .classList.toggle("expanded", isThemeFilterOpen);

  const visibleItems = shopItems.filter((item) => {
    const isOwned = owned.some((ownedItem) => ownedItem.id === item.id);
    return (
      activeShopFilter === "all" ||
      item.type === activeShopFilter ||
      item.rarity === activeShopFilter ||
      (activeShopFilter === "owned" && isOwned)
    );
  });

  if (!visibleItems.length) {
    const empty = document.createElement("span");
    empty.className = "shop-empty";
    empty.textContent =
      activeShopFilter === "owned"
        ? "Nenhum item comprado ainda."
        : "Nenhum item nessa categoria.";
    shopGrid.append(empty);
    return;
  }

  visibleItems.forEach((item) => {
    const isOwned = owned.some((ownedItem) => ownedItem.id === item.id);
    const isEquipped = equipped[item.type]?.id === item.id;
    const card = document.createElement("article");
    card.className = "shop-item";
    card.innerHTML = `
      <div class="shop-art ${item.image}">
        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="" />` : ""}
        ${item.imageUrl ? "" : `<span>${item.typeLabel}</span>`}
      </div>
      <div>
        <span class="shop-type">${item.typeLabel}</span>
        <h2>${item.name}</h2>
        <p>${item.desc}</p>
        ${item.quantity ? `<small class="shop-stock">Quantidade: ${formatCoins(item.quantity)}</small>` : ""}
      </div>
      <button type="button" class="${isOwned ? "owned" : ""}">
        ${isEquipped ? "Equipado" : isOwned ? "Equipar" : `${formatCoins(item.price)} ${coinIconSvg}`}
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      if (isOwned) {
        equipItem(item);
        return;
      }

      if (coins < item.price) {
        showToast("ONE COIN insuficiente. Jogue para ganhar mais moedas.");
        return;
      }

      coins -= item.price;
      owned.push(item);
      updateBalances();
      saveUserCoinDelta(-item.price);
      renderShop();
      equipItem(item);
    });

    shopGrid.append(card);
  });
}

function renderInventory() {
  inventoryList.innerHTML = "";
  inventoryCount.textContent = owned.length;
  if (inventoryBadge)
    inventoryBadge.textContent = `${owned.length} ${owned.length === 1 ? "item" : "itens"}`;

  if (!owned.length) {
    const empty = document.createElement("span");
    empty.className = "empty-state";
    empty.textContent = "Compre itens no shop para equipar aqui.";
    inventoryList.append(empty);
    return;
  }

  owned.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent =
      equipped[item.type]?.id === item.id
        ? `${item.name} equipado`
        : `Equipar ${item.name}`;
    button.addEventListener("click", () => equipItem(item));
    inventoryList.append(button);
  });
}

function equipItem(item) {
  equipped[item.type] = item;
  applyProfileEquipment();

  renderInventory();
  renderShop();
  showToast(`${item.name} sincronizado com seu perfil.`);
}

function applyProfileEquipment() {
  const profileCard = document.querySelector(".profile-showcase");
  const frameClasses = [
    "common-frame-equipped",
    "legendary-frame-equipped",
    "safirium-frame-equipped",
    "rubi-prism-frame-equipped",
    "neon",
    "solar",
    "rift",
  ];
  profileAvatar.classList.remove(...frameClasses);
  profileAvatarWrap.classList.remove(...frameClasses);
  avatarMini.classList.remove(...frameClasses);
  profileCard.classList.remove(
    "theme-blueprint",
    "theme-midnight",
    "theme-hello-kit",
  );

  if (equipped.frame) {
    profileAvatar.classList.add(equipped.frame.effect);
    profileAvatarWrap.classList.add(equipped.frame.effect);
    avatarMini.classList.add(equipped.frame.effect);
  }
  if (equipped.theme) {
    profileCard.classList.add(`theme-${equipped.theme.effect}`);
  }
  profileTitle.textContent = equipped.title?.effect || "Novato";
  if (equippedFrame)
    equippedFrame.textContent = equipped.frame?.name || "Nenhuma";
  if (equippedTheme)
    equippedTheme.textContent = equipped.theme?.name || "Nenhum";
  if (equippedTitle)
    equippedTitle.textContent = equipped.title?.effect || "Novato";
}

function updateEventButtons() {
  [eventDetailAction].forEach((button) => {
    if (!button) return;
    if (isEventClosed()) {
      button.textContent = "EVENTO ENCERRADO";
      button.classList.remove("leave");
      button.classList.add("ended");
      button.disabled = true;
      return;
    }
    button.disabled = false;
    button.classList.remove("ended");
    button.textContent = eventJoined ? "Sair do Evento" : "Participar";
    button.classList.toggle("leave", eventJoined);
  });
}

async function saveEventParticipation(joined) {
  const response = await fetch(`${API_BASE}/api/event-participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: eventConfig.id || eventConfig.title,
      eventTitle: eventConfig.title,
      userId: discordUser.id || discordUser.username || "anonymous",
      username: discordUser.name || "ONE HUB",
      avatarUrl: discordUser.avatarUrl || "",
      joined,
    }),
  });
  if (!response.ok) throw new Error("Nao foi possivel salvar participacao");
  return response.json();
}

async function toggleEventJoin() {
  if (isEventClosed()) return;
  const nextState = !eventJoined;
  eventJoined = nextState;
  updateEventButtons();
  try {
    await saveEventParticipation(nextState);
    showToast(
      nextState ? "Voce esta participando do evento." : "Voce saiu do evento.",
    );
  } catch (error) {
    eventJoined = !nextState;
    updateEventButtons();
    console.warn("API event-participants:", error.message);
    showToast("Nao foi possivel salvar sua participacao.");
  }
}

eventDetailAction.addEventListener("click", toggleEventJoin);
eventEditClose?.addEventListener("click", closeEventEditModal);
eventEditOverlay?.addEventListener("click", (event) => {
  if (event.target === eventEditOverlay) closeEventEditModal();
});
eventParticipantsClose?.addEventListener("click", closeEventParticipantsModal);
eventParticipantsOverlay?.addEventListener("click", (event) => {
  if (event.target === eventParticipantsOverlay) closeEventParticipantsModal();
});
eventEditForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await applyEventEditForm();
  closeEventEditModal();
  showToast("Evento atualizado.");
});

function renderRouletteHistory() {
  if (!rouletteHistory) return;
  rouletteHistory.innerHTML = "";

  if (!rouletteResults.length) {
    const empty = document.createElement("span");
    empty.className = "history-empty";
    empty.textContent = "Sem giros ainda";
    rouletteHistory.append(empty);
    return;
  }

  rouletteResults.slice(0, 10).forEach((result) => {
    const dot = document.createElement("span");
    dot.className = `history-dot ${result.type}`;
    dot.innerHTML = result.short;
    dot.title = result.label;
    rouletteHistory.append(dot);
  });
}

function renderRouletteCarousel() {
  rouletteWheel.innerHTML = "";
  const repeated = Array.from({ length: 8 }, () => carouselPattern).flat();
  repeated.forEach((type) => {
    const icons = {
      coins:
        '<svg class="prize-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/></svg>',
      ticket:
        '<svg class="prize-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>',
      retry:
        '<svg class="prize-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
      jackpot:
        '<svg class="prize-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>',
    };
    const labels = {
      coins: [icons.coins, "One Coins"],
      ticket: [icons.ticket, "Ticket"],
      multiplier: ["2x", "Multiplicador"],
      retry: [icons.retry, "Tente novamente"],
      jackpot: [icons.jackpot, "Jackpot raro"],
    };
    const item = document.createElement("div");
    item.className = `carousel-prize ${type}`;
    item.dataset.prize = type;
    item.innerHTML = `<strong>${labels[type][0]}</strong><span>${labels[type][1]}</span>`;
    rouletteWheel.append(item);
  });
}

function getRouletteResult() {
  const chanceMultiplier = multiplierSpinsLeft > 0 ? temporaryMultiplier : 1;
  const prizes = [
    {
      type: "coins",
      short: coinIconSvg,
      label: "One Coins",
      weight: roulettePrizeWeights.coins * chanceMultiplier,
    },
    {
      type: "ticket",
      short: "T",
      label: "Ticket de sorteio",
      weight: roulettePrizeWeights.ticket * chanceMultiplier,
    },
    {
      type: "multiplier",
      short: "2x",
      label: "Multiplicador temporario",
      weight: roulettePrizeWeights.multiplier,
    },
    {
      type: "retry",
      short: "P",
      label: "Tente novamente na proxima",
      weight: roulettePrizeWeights.retry,
    },
  ];
  const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const prize of prizes) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }

  return prizes[0];
}

function applyRoulettePrize(prize, wager) {
  const spendMultiplier = multiplierSpinsLeft > 0;
  let message = "";
  let isWin = true;

  if (prize.type === "coins") {
    const amount = rouletteCoinReward * (spendMultiplier ? temporaryMultiplier : 1);
    coins += amount;
    message = `One Coins: voce ganhou ${formatCoins(amount)} ${coinIconSvg}.`;
  }

  if (prize.type === "ticket") {
    tickets += 1;
    message = "Voce ganhou 1 ticket de sorteio.";
  }

  if (prize.type === "multiplier") {
    temporaryMultiplier = 2;
    multiplierSpinsLeft = 1;
    message = "Multiplicador 2x ativado para a proxima rodada.";
  }

  if (prize.type === "retry") {
    isWin = false;
    message = "Preto: tente novamente na proxima.";
  }

  if (spendMultiplier && prize.type !== "multiplier") {
    multiplierSpinsLeft -= 1;
    if (multiplierSpinsLeft <= 0) temporaryMultiplier = 1;
  }

  return { message, isWin };
}

function spinCasinoRoulette() {
  if (rouletteBusy) return;

  const wager = paymentMode === "ticket" ? 1 : 50;
  betAmount.value = wager;

  if (paymentMode === "coins" && wager > coins) {
    rouletteFeedback.className = "game-feedback lose";
    rouletteFeedback.textContent = "Saldo insuficiente para essa aposta.";
    showToast("ONE COIN insuficiente para girar.");
    return;
  }

  if (paymentMode === "ticket" && wager > tickets) {
    rouletteFeedback.className = "game-feedback lose";
    rouletteFeedback.textContent = "Tickets insuficientes para esse giro.";
    showToast("Ticket insuficiente para girar.");
    return;
  }

  const result = getRouletteResult();

  const coinsBefore = paymentMode === "coins" ? coins : 0;
  rouletteBusy = true;
  spinRoulette.disabled = true;
  spinRoulette.textContent = "Girando...";
  if (paymentMode === "coins") {
    coins -= wager;
  } else {
    tickets -= wager;
  }
  updateBalances();
  rouletteSpins += 1;
  const matchingIndexes = Array.from(rouletteWheel.children)
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item, index }) =>
        item.dataset.prize === result.type &&
        index > carouselPattern.length * 2,
    );
  const targetIndex =
    matchingIndexes[
      Math.min(matchingIndexes.length - 1, carouselRounds + (rouletteSpins % 2))
    ]?.index || 24;
  const windowWidth = rouletteWheel.parentElement.clientWidth;
  const offset =
    8 +
    targetIndex * carouselPrizeWidth -
    windowWidth / 2 +
    carouselPrizeWidth / 2;
  rouletteWheel.style.transform = `translateX(-${offset}px)`;

  window.setTimeout(() => {
    rouletteResults.unshift(result);
    const outcome = applyRoulettePrize(result, wager);
    rouletteFeedback.className = `game-feedback ${outcome.isWin ? "win" : "lose"}`;
    rouletteFeedback.innerHTML = outcome.message;

    updateBalances();
    if (paymentMode === "coins") {
      saveUserCoinDelta(coins - coinsBefore);
    }
    renderRouletteHistory();
    renderInventory();
    rouletteBusy = false;
    spinRoulette.disabled = false;
    spinRoulette.textContent = "Girar roleta";
  }, 900);
}

document.querySelectorAll("[data-open-game]").forEach((card) => {
  card.addEventListener("click", () => openGame(card.dataset.openGame));
});

document.querySelectorAll("[data-payment]").forEach((button) => {
  button.addEventListener("click", () => {
    paymentMode = button.dataset.payment;
    document
      .querySelectorAll("[data-payment]")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    if (paymentMode === "ticket") {
      betAmount.value = "1";
      paymentIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>';
      return;
    }

    betAmount.value = "50";
    paymentIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/></svg>';
  });
});

shopFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      button.dataset.shopFilter === "frame" &&
      (activeShopFilter === "frame" || frameRarities.includes(activeShopFilter))
    ) {
      activeShopFilter = "all";
    } else if (
      button.dataset.shopFilter === "theme" &&
      (activeShopFilter === "theme" || themeRarities.includes(activeShopFilter))
    ) {
      activeShopFilter = "all";
    } else {
      activeShopFilter = button.dataset.shopFilter;
    }
    renderShop();
  });
});

settingsTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSettingsTab(button.dataset.settingsTab);
    if (button.dataset.settingsTab === "shop-create") {
      loadShopProductsFromApi();
    }
  });
});

settingsOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSettingsTab(button.dataset.settingsOpen);
    if (button.dataset.settingsOpen === "events-edit") {
      syncEventConfigForm();
    }
    if (button.dataset.settingsOpen === "shop-edit") {
      loadShopProductsFromApi();
    }
  });
});

settingsSidebarSearch?.addEventListener("input", filterSettingsSidebar);
globalThemeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    saveGlobalTheme(button.dataset.globalTheme || "default");
  });
});
coinPlayerSearch?.addEventListener("input", filterCoinRows);

settingsAccessSubmit?.addEventListener("click", unlockSettingsWithCode);
settingsAccessInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockSettingsWithCode();
});
settingsAccessInput?.addEventListener("input", () => {
  settingsAccessInput.value = settingsAccessInput.value
    .replace(/\D/g, "")
    .slice(0, SETTINGS_ACCESS_CODE.length);
  updateSettingsPinDots();
});
settingsKeyButtons.forEach((button) => {
  button.addEventListener("click", () => handleSettingsKey(button.dataset.settingsKey));
});
document.addEventListener("keydown", (event) => {
  if (settingsAccessGate?.classList.contains("hidden")) return;
  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    handleSettingsKey(event.key);
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    handleSettingsKey("back");
  }
});

backToGames.addEventListener("click", showGamesMenu);
spinRoulette.addEventListener("click", spinCasinoRoulette);
accountForm?.addEventListener("submit", handleAccountSubmit);
accountModeToggle?.addEventListener("click", () => {
  accountMode = accountMode === "login" ? "signup" : "login";
  updateAccountMode();
});
discordLogin.addEventListener("click", loginWithDiscord);
hourglassLogin?.addEventListener("click", () => {
  loginWithTestCredentials();
});
discordLogout.addEventListener("click", logoutDiscord);
topbarLogout?.addEventListener("click", logoutDiscord);
notificationsButton?.addEventListener("click", () => {
  showToast("Nenhuma notificação nova.");
});
let usersDirectoryClickTimer;
usersDirectoryButton?.addEventListener("click", () => {
  clearTimeout(usersDirectoryClickTimer);
  usersDirectoryClickTimer = setTimeout(() => {
    toggleUsersDirectorySidebar();
  }, 180);
});
usersDirectoryButton?.addEventListener("dblclick", () => {
  clearTimeout(usersDirectoryClickTimer);
  openUsersDirectoryConfig();
});
usersDirectoryClose?.addEventListener("click", closeUsersDirectory);
usersDirectoryOverlay?.addEventListener("click", (event) => {
  if (event.target === usersDirectoryOverlay) closeUsersDirectory();
});
usersDirectoryTabs.forEach((button) => {
  button.addEventListener("click", () => {
    usersDirectoryView = button.dataset.usersView;
    renderUsersDirectoryTabs();
  });
});
discordTokenForm?.addEventListener("submit", saveDiscordBotToken);

const devModeToggle = document.getElementById("devModeToggle");
if (devModeToggle) {
  devModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("developer-mode");
    const isDev = document.body.classList.contains("developer-mode");
    if (isDev) {
      showToast("Modo Developer ativado.");
    } else {
      showToast("Modo Developer desativado.");
    }
  });
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  if (settingsThemeText) {
    settingsThemeText.textContent = isDark ? "Modo Escuro" : "Modo Claro";
  } else {
    themeToggle.textContent = isDark ? "Modo claro" : "Modo escuro";
  }
  themeToggle.classList.toggle("active", isDark);
  showToast(
    isDark
      ? "Modo escuro ativado para teste."
      : "Modo claro ativado para teste.",
  );
});

window.addEventListener("hashchange", () => {
  if (window.location.hash.includes("access_token=")) {
    finishDiscordLoginFromCallback();
    return;
  }
  showPage();
});

async function initApp() {
  updateAccountMode();
  await loadGlobalThemeFromApi();
  await loadShopProductsFromApi();
  await loadHubCoinUsers();
  syncCurrentUserCoinsFromDb();
  await   loadEventsFromApi({ selectLatest: true });
  updateBalances();
  renderHubCards();
  await renderEventContent();
  renderGameBanners();
  renderShop();
  renderInventory();
  renderRouletteHistory();
  renderRouletteCarousel();
  updateEventButtons();
  bindSettingsForms();
  bindGameConfigForms();
  bindEventConfigForm();
  bindProductConfigForm();
  syncSettingsForms();
  syncGameConfigForms();
  syncEventConfigForm();

  if (await finishDiscordLoginFromCallback()) return;
  await refreshSavedDiscordRoles();
  showPage();
}

initApp();
