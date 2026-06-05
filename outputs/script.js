const formatCoins = (value) => new Intl.NumberFormat("pt-BR").format(value);

const API_BASE =
  window.location.protocol === "file:" ? "http://127.0.0.1:3000" : "";

let coins = 1250;
let testModeFree = false;
const DISCORD_CLIENT_ID = "1507207436665229322";
const DISCORD_API = "https://discord.com/api";
const DISCORD_GUILD_ID = "COLOQUE_O_ID_DO_SERVIDOR";
const ADMIN_ROLE_ID = "1503079573124943924";
let discordSession = readDiscordSession();
let isLoggedIn = Boolean(discordSession?.accessToken);
let discordUser = discordSession?.user || {
  name: "ONE HUB",
  avatarInitial: "O",
  roles: [],
};
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
const frameSubfilters = document.querySelector(".frame-subfilters");
const themeSubfilters = document.querySelector(".theme-subfilters");
const toast = document.querySelector("#toast");
const hubCards = document.querySelector("#hubCards");
const shopGrid = document.querySelector("#shopGrid");
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
const testLogin = document.querySelector("#testLogin");
const testModeToggle = document.querySelector("#testModeToggle");
const themeToggle = document.querySelector("#themeToggle");
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
const eventCard = document.querySelector("[data-open-event]");
const joinEvent = document.querySelector("#joinEvent");
const eventDetailAction = document.querySelector("#eventDetailAction");
const eventCardBanner = document.querySelector("#eventCardBanner");
const eventCardTitle = document.querySelector("#eventCardTitle");
const eventCardDescription = document.querySelector("#eventCardDescription");
const eventCardTags = document.querySelector("#eventCardTags");
const eventDetailTitle = document.querySelector("#eventDetailTitle");
const eventDetailMainDescription = document.querySelector(
  "#eventDetailMainDescription",
);
const eventDetailDescription = document.querySelector("#eventDetailDescription");
const eventDetailTags = document.querySelector("#eventDetailTags");
const eventDetailBanner = document.querySelector("#eventDetailBanner");

let rouletteSpins = 0;
let rouletteBusy = false;
let eventJoined = false;
let tickets = 0;
let temporaryMultiplier = 1;
let multiplierSpinsLeft = 0;
let paymentMode = "coins";
let activeShopFilter = "all";
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
const rouletteResults = [];
const carouselPrizeWidth = 146;
const carouselRounds = 4;
const carouselPattern = [
  "coins",
  "ticket",
  "retry",
  "coins",
  "multiplier",
  "ticket",
  "coins",
  "retry",
  "jackpot",
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

function hasAdminRole() {
  return discordUser.roles?.includes(ADMIN_ROLE_ID);
}

async function fetchDiscordRoles(accessToken) {
  if (
    !DISCORD_GUILD_ID ||
    DISCORD_GUILD_ID === "COLOQUE_O_ID_DO_SERVIDOR"
  ) {
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
    imageUrl: "",
  },
};

const eventConfig = {
  title: "BARATA X HUMANOS",
  mainDescription: "Preparem-se para uma guerra caótica dentro do labirinto!",
  bannerUrl:
    "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-04_164833039.png",
  hours: "22:00 Horas",
  location: "Hotel Presságio",
  reward: "350K + 10 One Coins",
  detailDescription:
    "No início do evento, os humanos entrarão primeiro no labirinto para se esconderem e se posicionarem. Logo depois, as baratas serão liberadas e a batalha começará.\n\nTodos os participantes receberão tacos para se defender e atacar. A partir daí, será uma verdadeira guerra entre Baratas x Humanos até uma das equipes sair vencedora.\n\nData: Hoje\nHorário: 22:00\nLocal: Hotel Presságio\n\nPremiação para a equipe vencedora:\n300K + 10 One Coins\n\nRegras básicas:\nProibido abusar de bugs ou animações.\nProibido sair da área do evento.\nUse estratégia, se esconda, ataque e sobreviva com sua equipe.\n\nEscolha seu lado e venha para essa guerra insana.\nHoje, às 22:00, no Hotel Presságio.",
};

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

  if (requested === "settings" && !hasAdminRole()) {
    window.history.replaceState(null, "", "#home");
    showToast("Ajustes liberado apenas para cargo autorizado.");
  }

  const unlockedRequest =
    requested === "login" || (requested === "settings" && !hasAdminRole())
      ? "home"
      : requested;
  const activeId = pages.some(
    (page) => page.id === unlockedRequest && page.id !== "login",
  )
    ? unlockedRequest
    : "home";

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
    syncSettingsForms();
    syncGameConfigForms();
  }
  if (activeId === "games") showGamesMenu();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function syncAuthState() {
  document.body.classList.toggle("auth-locked", !isLoggedIn);
  document.body.classList.toggle("has-admin-role", isLoggedIn && hasAdminRole());
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

function loginWithTestUser() {
  discordUser = {
    id: "test-user",
    name: "ONE HUB",
    username: "onehub",
    avatarInitial: "O",
    avatarUrl: "",
    roles: [ADMIN_ROLE_ID],
  };
  discordSession = {
    accessToken: "test-session",
    user: discordUser,
    test: true,
    createdAt: Date.now(),
  };
  isLoggedIn = true;
  localStorage.setItem("oneDiscordSession", JSON.stringify(discordSession));
  syncAuthState();
  window.location.hash = "home";
  showToast("Login teste ativado.");
  showPage();
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
  if (!isLoggedIn || discordSession?.test || !discordSession?.accessToken) {
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
    card.addEventListener("click", () => {
      window.location.hash = card.dataset.target;
    });
    hubCards.append(card);
  });
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

function renderGameBanners() {
  const roulette = gameConfig.roulette;
  rouletteBannerStatus.textContent = roulette.status;
  rouletteBannerTitle.textContent = roulette.title;
  rouletteBannerDescription.textContent = roulette.description;

  if (roulette.imageUrl) {
    rouletteBannerImage.src = roulette.imageUrl;
    rouletteBannerArt.classList.add("has-image");
    rouletteBannerMark.textContent = "";
  } else {
    rouletteBannerImage.removeAttribute("src");
    rouletteBannerArt.classList.remove("has-image");
    rouletteBannerMark.textContent = "ONE";
  }
}

rouletteBannerImage.addEventListener("error", () => {
  rouletteBannerImage.removeAttribute("src");
  rouletteBannerArt.classList.remove("has-image");
  rouletteBannerMark.textContent = "ONE";
  showToast("Nao foi possivel carregar a imagem do banner.");
});

function syncGameConfigForms() {
  document.querySelectorAll(".game-config").forEach((form) => {
    const config = gameConfig[form.dataset.game];
    form.querySelector('[name="status"]').value = config.status;
    form.querySelector('[name="title"]').value = config.title;
    form.querySelector('[name="description"]').value = config.description;
    form.querySelector('[name="imageUrl"]').value = config.imageUrl;
  });
}

function bindGameConfigForms() {
  document.querySelectorAll(".game-config").forEach((form) => {
    const readForm = () => {
      const config = gameConfig[form.dataset.game];
      config.status = form.querySelector('[name="status"]').value;
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

function renderEventTags(container) {
  container.innerHTML = "";
  container.append(
    createEventTag(eventIcons.hours, eventConfig.hours),
    createEventTag(eventIcons.location, eventConfig.location),
    createEventTag(eventIcons.reward, eventConfig.reward),
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

function renderEventContent() {
  eventCardTitle.textContent = eventConfig.title;
  eventCardDescription.textContent = eventConfig.mainDescription;
  eventDetailTitle.textContent = eventConfig.title;
  eventDetailMainDescription.textContent = eventConfig.mainDescription;
  eventCardBanner.src = eventConfig.bannerUrl;
  eventCardBanner.alt = `Banner ${eventConfig.title}`;
  eventDetailBanner.src = eventConfig.bannerUrl;
  eventDetailBanner.alt = `Banner ${eventConfig.title}`;
  renderEventTags(eventCardTags);
  renderEventTags(eventDetailTags);
  renderEventDescription();

  hubConfig.live.target = "event-detail";
  hubConfig.live.title = eventConfig.title;
  hubConfig.live.description = eventConfig.mainDescription;
  hubConfig.live.imageUrl = eventConfig.bannerUrl;
  renderHubCards();
}

function applyApiEvent(event) {
  if (!event) return;
  eventConfig.title = event.title || eventConfig.title;
  eventConfig.mainDescription =
    event.mainDescription || eventConfig.mainDescription;
  eventConfig.bannerUrl = event.bannerUrl || eventConfig.bannerUrl;
  eventConfig.hours = event.eventTime || eventConfig.hours;
  eventConfig.location = event.location || eventConfig.location;
  eventConfig.reward = event.reward || eventConfig.reward;
  eventConfig.detailDescription =
    event.detailDescription || eventConfig.detailDescription;
}

async function loadLatestEventFromApi() {
  try {
    const response = await fetch(`${API_BASE}/api/events/latest`);
    if (!response.ok) throw new Error("Evento indisponivel");
    applyApiEvent(await response.json());
  } catch (error) {
    console.warn("API events:", error.message);
  }
}

async function saveEventToApi() {
  const response = await fetch(`${API_BASE}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: eventConfig.title,
      mainDescription: eventConfig.mainDescription,
      detailDescription: eventConfig.detailDescription,
      bannerUrl: eventConfig.bannerUrl,
      eventTime: eventConfig.hours,
      location: eventConfig.location,
      reward: eventConfig.reward,
    }),
  });
  if (!response.ok) throw new Error("Nao foi possivel salvar o evento");
  return response.json();
}

function syncEventConfigForm() {
  const form = document.querySelector(".event-config");
  if (!form) return;
  form.querySelector('[name="title"]').value = eventConfig.title;
  form.querySelector('[name="mainDescription"]').value =
    eventConfig.mainDescription;
  form.querySelector('[name="bannerUrl"]').value = eventConfig.bannerUrl;
  form.querySelector('[name="hours"]').value = eventConfig.hours;
  form.querySelector('[name="location"]').value = eventConfig.location;
  form.querySelector('[name="reward"]').value = eventConfig.reward;
  form.querySelector('[name="detailDescription"]').value =
    eventConfig.detailDescription;
}

function bindEventConfigForm() {
  const form = document.querySelector(".event-config");
  if (!form) return;

  const readForm = () => {
    eventConfig.title =
      form.querySelector('[name="title"]').value.trim() || "Novo evento ONE";
    eventConfig.mainDescription =
      form.querySelector('[name="mainDescription"]').value.trim() ||
      "Configure a descricao principal do evento.";
    eventConfig.bannerUrl =
      form.querySelector('[name="bannerUrl"]').value.trim() ||
      "https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/imagem_2026-06-04_164833039.png";
    eventConfig.hours =
      form.querySelector('[name="hours"]').value.trim() || "22:00 Horas";
    eventConfig.location =
      form.querySelector('[name="location"]').value.trim() || "Hotel Presságio";
    eventConfig.reward =
      form.querySelector('[name="reward"]').value.trim() ||
      "350K + 10 One Coins";
    eventConfig.detailDescription =
      form.querySelector('[name="detailDescription"]').value.trim() ||
      eventConfig.mainDescription;
    renderEventContent();
  };

  form.addEventListener("input", readForm);
  form.addEventListener("change", readForm);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    readForm();
    try {
      await saveEventToApi();
      showToast("Evento salvo no MongoDB e sincronizado no Hub.");
    } catch (error) {
      console.warn("API events:", error.message);
      showToast("Evento sincronizado localmente. Verifique o servidor Node.");
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
    products
      .filter(
        (product) => !shopItems.some((item) => item.id === `api-${product.id}`),
      )
      .reverse()
      .forEach((product) => shopItems.unshift(apiProductToShopItem(product)));
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

function createShopProduct(data) {
  const quantity = Math.max(1, Number(data.quantity) || 1);
  const category = data.category;
  const rarity = data.rarity;
  const id = `custom-${category}-${Date.now()}`;

  const item = {
    id,
    name: data.name || buildProductName(category, rarity),
    desc: data.description || buildProductDescription(category, rarity, quantity),
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
    } catch (error) {
      console.warn("API shop-products:", error.message);
      createShopProduct(productData);
      showToast("Produto criado localmente. Verifique o servidor Node.");
    }
    activeShopFilter = "all";
    renderShop();
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
  testModeToggle.classList.toggle("active", testModeFree);
  testModeToggle.textContent = testModeFree ? "Teste grátis" : "Modo teste";

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
        ${isEquipped ? "Equipado" : isOwned ? "Equipar" : testModeFree ? "Grátis" : `${formatCoins(item.price)} ${coinIconSvg}`}
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      if (isOwned) {
        equipItem(item);
        return;
      }

      if (!testModeFree && coins < item.price) {
        showToast("ONE COIN insuficiente. Jogue para ganhar mais moedas.");
        return;
      }

      if (!testModeFree) coins -= item.price;
      owned.push(item);
      updateBalances();
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
  document.body.classList.remove("hub-theme-hello-kit");

  if (equipped.frame) {
    profileAvatar.classList.add(equipped.frame.effect);
    profileAvatarWrap.classList.add(equipped.frame.effect);
    avatarMini.classList.add(equipped.frame.effect);
  }
  if (equipped.theme) {
    profileCard.classList.add(`theme-${equipped.theme.effect}`);
    if (equipped.theme.appliesGlobalPalette)
      document.body.classList.add(`hub-theme-${equipped.theme.effect}`);
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
  [joinEvent, eventDetailAction].forEach((button) => {
    if (!button) return;
    button.textContent = eventJoined ? "Sair do Evento" : "Participar";
    button.classList.toggle("leave", eventJoined);
  });
}

function toggleEventJoin() {
  eventJoined = !eventJoined;
  updateEventButtons();
  showToast(eventJoined ? "Voce esta participando do evento." : "Voce saiu do evento.");
}

eventCard.addEventListener("click", () => {
  window.location.hash = "event-detail";
});

joinEvent.addEventListener("click", (event) => {
  event.stopPropagation();
  window.location.hash = "event-detail";
});

eventDetailAction.addEventListener("click", toggleEventJoin);

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
  const prizes = [
    { type: "coins", short: coinIconSvg, label: "One Coins", weight: 55 },
    { type: "ticket", short: "T", label: "Ticket de sorteio", weight: 26 },
    {
      type: "multiplier",
      short: "2x",
      label: "Multiplicador temporario",
      weight: 16,
    },
    {
      type: "retry",
      short: "P",
      label: "Tente novamente na proxima",
      weight: 12,
    },
    { type: "jackpot", short: "J", label: "Jackpot raro", weight: 1 },
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
  const effectiveMultiplier = temporaryMultiplier;
  const spendMultiplier = multiplierSpinsLeft > 0;
  let message = "";
  let isWin = true;

  if (prize.type === "coins") {
    const amount = Math.round(wager * 1.8 * effectiveMultiplier);
    coins += amount;
    message = `One Coins: voce ganhou ${formatCoins(amount)} ${coinIconSvg}.`;
  }

  if (prize.type === "ticket") {
    tickets += 1;
    message = "Voce ganhou 1 ticket de sorteio.";
  }

  if (prize.type === "multiplier") {
    temporaryMultiplier = 2;
    multiplierSpinsLeft = 3;
    message = "Multiplicador 2x ativado pelos proximos 3 giros.";
  }

  if (prize.type === "jackpot") {
    const amount = wager * 25;
    coins += amount;
    tickets += 3;
    message = `Jackpot raro! ${formatCoins(amount)} ${coinIconSvg} e 3 tickets.`;
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

testModeToggle.addEventListener("click", () => {
  testModeFree = !testModeFree;
  renderShop();
  showToast(
    testModeFree
      ? "Modo teste ativado: shop gratuito."
      : "Modo teste desativado.",
  );
});

backToGames.addEventListener("click", showGamesMenu);
spinRoulette.addEventListener("click", spinCasinoRoulette);
discordLogin.addEventListener("click", loginWithDiscord);
testLogin.addEventListener("click", loginWithTestUser);
discordLogout.addEventListener("click", logoutDiscord);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "Modo claro" : "Modo escuro";
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
  await loadShopProductsFromApi();
  await loadLatestEventFromApi();
  updateBalances();
  renderHubCards();
  renderEventContent();
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
