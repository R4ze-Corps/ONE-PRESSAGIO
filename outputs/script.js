const formatCoins = (value) => new Intl.NumberFormat("pt-BR").format(value);

let coins = 1250;
let isLoggedIn = localStorage.getItem("oneDiscordSession") === "connected";
const discordUser = {
  name: "Kawanone",
  avatarInitial: "K",
};
const owned = [];
const equipped = {
  frame: null,
  theme: null,
  title: null,
};

const pages = Array.from(document.querySelectorAll(".page"));
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const shopFilterButtons = Array.from(document.querySelectorAll("[data-shop-filter]"));
const toast = document.querySelector("#toast");
const hubCards = document.querySelector("#hubCards");
const shopGrid = document.querySelector("#shopGrid");
const inventoryList = document.querySelector("#inventoryList");
const inventoryCount = document.querySelector("#inventoryCount");
const inventoryBadge = document.querySelector("#inventoryBadge");
const profileAvatar = document.querySelector("#profileAvatar");
const profileTitle = document.querySelector("#profileTitle");
const equippedFrame = document.querySelector("#equippedFrame");
const equippedTheme = document.querySelector("#equippedTheme");
const equippedTitle = document.querySelector("#equippedTitle");
const discordLogin = document.querySelector("#discordLogin");
const discordLogout = document.querySelector("#discordLogout");
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
const rouletteBannerDescription = document.querySelector("#rouletteBannerDescription");
const rouletteBannerMark = document.querySelector("#rouletteBannerMark");
const rouletteBannerArt = document.querySelector("#rouletteBannerArt");
const rouletteBannerImage = document.querySelector("#rouletteBannerImage");

let rouletteSpins = 0;
let rouletteBusy = false;
let tickets = 0;
let temporaryMultiplier = 1;
let multiplierSpinsLeft = 0;
let paymentMode = "coins";
let activeShopFilter = "all";
const rouletteResults = [];
const carouselPrizeWidth = 146;
const carouselRounds = 4;
const carouselPattern = ["coins", "ticket", "retry", "coins", "multiplier", "ticket", "coins", "retry", "jackpot", "ticket", "coins", "multiplier"];
const coinIconSvg =
  '<span class="coin-inline" aria-label="ONE COIN"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/></svg></span>';

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
    description: "Ganhe moedas em partidas rapidas e desbloqueie itens de perfil.",
  },
  live: {
    badge: "Ao vivo",
    target: "events",
    title: "Liga ONE",
    description: "Entre em torneios sazonais, suba no ranking e conquiste recompensas exclusivas.",
  },
};

const gameConfig = {
  roulette: {
    status: "Disponivel",
    title: "Roleta ONE",
    description: "Aposte em azul, branco ou preto em uma roleta limpa estilo cassino.",
    imageUrl: "",
  },
};

const shopItems = [
  {
    id: "frame-neon",
    name: "Borda Neon ONE",
    desc: "Contorno azul com presenca de arcade no perfil.",
    price: 420,
    type: "frame",
    typeLabel: "Borda",
    effect: "neon",
    image: "neon-frame",
  },
  {
    id: "frame-gold",
    name: "Borda Jackpot",
    desc: "Acabamento dourado para vencedores raros.",
    price: 680,
    type: "frame",
    typeLabel: "Borda",
    effect: "solar",
    image: "gold-frame",
  },
  {
    id: "theme-blueprint",
    name: "Tema Blueprint",
    desc: "Fundo frio com linhas luminosas no card do perfil.",
    price: 520,
    type: "theme",
    typeLabel: "Tema",
    effect: "blueprint",
    image: "theme-blueprint",
  },
  {
    id: "theme-midnight",
    name: "Tema Midnight",
    desc: "Visual escuro premium sincronizado com seu perfil.",
    price: 760,
    type: "theme",
    typeLabel: "Tema",
    effect: "midnight",
    image: "theme-midnight",
  },
  {
    id: "title-pro",
    name: "Titulo PRO",
    desc: "Selo de jogador avancado abaixo do nome.",
    price: 600,
    type: "title",
    typeLabel: "Titulo",
    effect: "PRO Player",
    image: "title-pro",
  },
  {
    id: "title-founder",
    name: "Titulo Fundador",
    desc: "Titulo exclusivo para aparecer no perfil.",
    price: 900,
    type: "title",
    typeLabel: "Titulo",
    effect: "Fundador ONE",
    image: "title-founder",
  },
];

function showPage() {
  const requested = window.location.hash.replace("#", "") || "home";
  syncAuthState();

  if (!isLoggedIn) {
    pages.forEach((page) => page.classList.toggle("active", page.id === "login"));
    navLinks.forEach((link) => link.classList.remove("active"));
    if (window.location.hash && window.location.hash !== "#login") {
      window.history.replaceState(null, "", "#login");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  const unlockedRequest = requested === "login" ? "home" : requested;
  const activeId = pages.some((page) => page.id === unlockedRequest && page.id !== "login") ? unlockedRequest : "home";

  if (requested === "login") {
    window.history.replaceState(null, "", "#home");
  }

  pages.forEach((page) => page.classList.toggle("active", page.id === activeId));
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`));

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
  document.querySelectorAll("[data-user-name]").forEach((element) => {
    element.textContent = discordUser.name;
  });
  if (profileAvatar) profileAvatar.textContent = discordUser.avatarInitial;
}

function loginWithDiscord() {
  isLoggedIn = true;
  localStorage.setItem("oneDiscordSession", "connected");
  syncAuthState();
  window.location.hash = "home";
  showToast("Bem-vindo ao ONE HUB.");
  showPage();
}

function logoutDiscord() {
  isLoggedIn = false;
  localStorage.removeItem("oneDiscordSession");
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
    const meta = categoryMeta[config.target];
    const card = document.createElement("article");
    card.className = "feature-card";
    card.dataset.target = `#${config.target}`;
    card.innerHTML = `
      <div class="feature-visual ${meta.visual}">
        ${key === "live" ? '<span class="live-dot"></span>' : ""}
        <span class="big-icon">${meta.symbol}</span>
        <strong>${config.title}</strong>
      </div>
      <div class="feature-body">
        <span>${config.badge}  ${meta.label}</span>
        <h2>${config.target === "games" ? "Chamada para jogar" : config.target === "events" ? "Chamada para eventos" : "Chamada para o shop"}</h2>
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
      config.title = form.querySelector('[name="title"]').value.trim() || categoryMeta[config.target].label;
      config.description = form.querySelector('[name="description"]').value.trim() || "Configure esta chamada nos Ajustes.";
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
      config.title = form.querySelector('[name="title"]').value.trim() || "Roleta ONE";
      config.description = form.querySelector('[name="description"]').value.trim() || "Configure a descricao do jogo nos Ajustes.";
      config.imageUrl = form.querySelector('[name="imageUrl"]').value.trim();
      renderGameBanners();
    };

    form.addEventListener("input", readForm);
    form.addEventListener("change", readForm);
  });
}

function updateBalances() {
  document.querySelectorAll("#coinBalance, #shopBalance, #gameBalance").forEach((element) => {
    element.textContent = formatCoins(coins);
  });
  if (ticketBalance) ticketBalance.textContent = formatCoins(tickets);
  if (multiplierStatus) {
    multiplierStatus.textContent = multiplierSpinsLeft > 0 ? `${temporaryMultiplier}x por ${multiplierSpinsLeft} giro${multiplierSpinsLeft === 1 ? "" : "s"}` : "1x";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function addCoins(amount, message) {
  coins += amount;
  updateBalances();
  if (message) showToast(message);
}

function renderShop() {
  shopGrid.innerHTML = "";

  shopFilterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.shopFilter === activeShopFilter);
  });

  const visibleItems = shopItems.filter((item) => {
    const isOwned = owned.some((ownedItem) => ownedItem.id === item.id);
    return activeShopFilter === "all" || item.type === activeShopFilter || (activeShopFilter === "owned" && isOwned);
  });

  if (!visibleItems.length) {
    const empty = document.createElement("span");
    empty.className = "shop-empty";
    empty.textContent = activeShopFilter === "owned" ? "Nenhum item comprado ainda." : "Nenhum item nessa categoria.";
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
        <span>${item.typeLabel}</span>
      </div>
      <div>
        <span class="shop-type">${item.typeLabel}</span>
        <h2>${item.name}</h2>
        <p>${item.desc}</p>
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
      renderShop();
      equipItem(item);
    });

    shopGrid.append(card);
  });
}

function renderInventory() {
  inventoryList.innerHTML = "";
  inventoryCount.textContent = owned.length;
  if (inventoryBadge) inventoryBadge.textContent = `${owned.length} ${owned.length === 1 ? "item" : "itens"}`;

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
    button.textContent = equipped[item.type]?.id === item.id ? `${item.name} equipado` : `Equipar ${item.name}`;
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
  profileAvatar.classList.remove("neon", "solar", "rift");
  profileCard.classList.remove("theme-blueprint", "theme-midnight");

  if (equipped.frame) profileAvatar.classList.add(equipped.frame.effect);
  if (equipped.theme) profileCard.classList.add(`theme-${equipped.theme.effect}`);
  profileTitle.textContent = equipped.title?.effect || "Novato";
  if (equippedFrame) equippedFrame.textContent = equipped.frame?.name || "Nenhuma";
  if (equippedTheme) equippedTheme.textContent = equipped.theme?.name || "Nenhum";
  if (equippedTitle) equippedTitle.textContent = equipped.title?.effect || "Novato";
}

document.querySelector("#joinEvent").addEventListener("click", () => {
  addCoins(150, "Voce entrou no evento e recebeu 150 ONE COIN.");
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
  const prizes = [
    { type: "coins", short: coinIconSvg, label: "One Coins", weight: 55 },
    { type: "ticket", short: "T", label: "Ticket de sorteio", weight: 26 },
    { type: "multiplier", short: "2x", label: "Multiplicador temporario", weight: 16 },
    { type: "retry", short: "P", label: "Tente novamente na proxima", weight: 12 },
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
    .filter(({ item, index }) => item.dataset.prize === result.type && index > carouselPattern.length * 2);
  const targetIndex = matchingIndexes[Math.min(matchingIndexes.length - 1, carouselRounds + (rouletteSpins % 2))]?.index || 24;
  const windowWidth = rouletteWheel.parentElement.clientWidth;
  const offset = 8 + targetIndex * carouselPrizeWidth - windowWidth / 2 + carouselPrizeWidth / 2;
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
    document.querySelectorAll("[data-payment]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    if (paymentMode === "ticket") {
      betAmount.value = "1";
      paymentIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>';
      return;
    }

    betAmount.value = "50";
    paymentIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/></svg>';
  });
});

shopFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeShopFilter = button.dataset.shopFilter;
    renderShop();
  });
});

backToGames.addEventListener("click", showGamesMenu);
spinRoulette.addEventListener("click", spinCasinoRoulette);
discordLogin.addEventListener("click", loginWithDiscord);
discordLogout.addEventListener("click", logoutDiscord);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "Modo claro" : "Modo escuro";
  showToast(isDark ? "Modo escuro ativado para teste." : "Modo claro ativado para teste.");
});

window.addEventListener("hashchange", showPage);
updateBalances();
renderHubCards();
renderGameBanners();
renderShop();
renderInventory();
renderRouletteHistory();
renderRouletteCarousel();
bindSettingsForms();
bindGameConfigForms();
syncSettingsForms();
syncGameConfigForms();
showPage();

