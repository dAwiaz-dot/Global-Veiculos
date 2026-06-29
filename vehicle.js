const STORE = {
  name: "Global Veículos",
  whatsappNumber: "5535999740120",
  defaultMessage: "Olá, tenho interesse em um veículo da Global Veículos.",
};

const STORAGE_KEY = "globalVehiclesInventory";
const PAGE_CACHE_KEY = "globalVehiclesLastInventory";
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

const content = document.querySelector("[data-vehicle-page-content]");
const params = new URLSearchParams(window.location.search);
const vehicleId = params.get("id");

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("globalTheme", theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.innerHTML = `<i data-lucide="${theme === "dark" ? "sun" : "moon"}"></i>`;
    button.setAttribute("aria-label", theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro");
  });
  createIcons();
}

function initThemeToggle() {
  const currentTheme = document.documentElement.dataset.theme || "light";
  applyTheme(currentTheme);
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  });
}

function whatsappUrl(message = STORE.defaultMessage) {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

async function readVehicles() {
  try {
    const response = await fetch("/api/vehicles", { cache: "no-store" });
    if (response.ok) {
      const vehicles = await response.json();
      if (Array.isArray(vehicles)) {
        localStorage.setItem(PAGE_CACHE_KEY, JSON.stringify(vehicles));
        return vehicles;
      }
    }
  } catch (error) {
    console.warn("Nao foi possivel ler o estoque do servidor.", error);
  }

  const sources = [STORAGE_KEY, PAGE_CACHE_KEY];

  for (const source of sources) {
    try {
      const vehicles = JSON.parse(localStorage.getItem(source));
      if (Array.isArray(vehicles) && vehicles.length > 0) {
        return vehicles;
      }
    } catch (error) {
      console.warn("Nao foi possivel ler o estoque salvo.", error);
    }
  }

  return [];
}

function initWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl(link.dataset.message || STORE.defaultMessage);
    link.target = "_blank";
    link.rel = "noreferrer";
  });
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function initMobileContentGuard() {
  const blockMobileCopy = (event) => {
    if (!isMobileViewport() || isEditableTarget(event.target)) return;
    event.preventDefault();
  };

  document.addEventListener("copy", blockMobileCopy);
  document.addEventListener("cut", blockMobileCopy);
  document.addEventListener("contextmenu", blockMobileCopy);
  document.addEventListener("selectstart", blockMobileCopy);
}

function notFoundTemplate() {
  return `
    <div class="empty-state">
      <h1>Veículo não encontrado</h1>
      <p>Abra o estoque pela página inicial ou cadastre veículos no ADM para gerar páginas individuais.</p>
      <a class="btn btn-primary" href="veiculos.html">
        <i data-lucide="car-front"></i>
        <span>Ver estoque</span>
      </a>
    </div>
  `;
}

function detailsTemplate(vehicle) {
  const images = vehicle.images?.length ? vehicle.images : [PLACEHOLDER_IMAGE];
  const options = vehicle.options?.length ? vehicle.options : ["Procedência conferida"];
  const isSold = (vehicle.status || "").toLowerCase() === "vendido";
  const interestMessage = isSold
    ? `Olá, vi que o ${vehicle.name} está vendido. Quero consultar veículos similares na Global Veículos.`
    : `Olá, tenho interesse no ${vehicle.name} da Global Veículos.`;
  const financeInfo =
    vehicle.finance?.installments && vehicle.finance?.monthlyPayment
      ? `${vehicle.finance.installments}x de ${currency.format(vehicle.finance.monthlyPayment)}`
      : "";

  document.title = `${vehicle.name} | Global Veículos`;

  return `
    <div class="details-layout">
      <div class="details-gallery">
        <div class="details-main-image">
          <img src="${images[0]}" alt="${vehicle.name}" data-main-detail-image>
        </div>
        <div class="details-thumbs">
          ${images
            .map(
              (image, index) => `
                <button class="${index === 0 ? "is-active" : ""}" type="button" data-gallery-image="${image}" aria-label="Ver foto ${index + 1} de ${vehicle.name}">
                  <img src="${image}" alt="${vehicle.name} - foto ${index + 1}">
                </button>
              `
            )
            .join("")}
        </div>
      </div>

      <div class="details-info">
        <p class="eyebrow">${vehicle.brand || "Global Veículos"}</p>
        <h1 id="vehicle-modal-title">${vehicle.name}</h1>
        <div class="details-price">${isSold ? "Vendido" : currency.format(vehicle.price)}</div>
        <div class="details-specs">
          <span><small>Ano</small><strong>${vehicle.year || "-"}</strong></span>
          <span><small>Quilometragem</small><strong>${vehicle.mileage || "-"}</strong></span>
          <span><small>Câmbio</small><strong>${vehicle.transmission || "-"}</strong></span>
          <span><small>Combustível</small><strong>${vehicle.fuel || "-"}</strong></span>
          <span><small>Cor</small><strong>${vehicle.color || "-"}</strong></span>
          <span><small>Status</small><strong>${vehicle.status || "Disponível"}</strong></span>
          ${financeInfo ? `<span><small>Financeiro</small><strong>${financeInfo}</strong></span>` : ""}
          ${
            vehicle.finance?.downPayment
              ? `<span><small>Entrada sugerida</small><strong>${currency.format(vehicle.finance.downPayment)}</strong></span>`
              : ""
          }
        </div>

        <h3>Opcionais</h3>
        <ul class="optional-list">
          ${options.map((option) => `<li>${option}</li>`).join("")}
        </ul>

        <h3>Descrição</h3>
        <p class="details-description">${
          vehicle.description ||
          "Veículo anunciado pela Global Veículos em Alfenas-MG. Entre em contato para confirmar disponibilidade, condições e detalhes."
        }</p>

        <div class="vehicle-detail-actions">
          <a class="btn btn-primary" href="${whatsappUrl(interestMessage)}" target="_blank" rel="noreferrer">
            <i data-lucide="message-circle"></i>
            <span>${isSold ? "Consultar similares" : "Tenho interesse"}</span>
          </a>
          <a
            class="btn btn-outline"
            href="${whatsappUrl(`Olá, quero simular financiamento para o ${vehicle.name} na Global Veículos.`)}"
            target="_blank"
            rel="noreferrer"
          >
            <i data-lucide="calculator"></i>
            <span>Simular financiamento</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

async function render() {
  const vehicles = await readVehicles();
  const vehicle = vehicles.find((item) => item.id === vehicleId);

  content.innerHTML = vehicle ? detailsTemplate(vehicle) : notFoundTemplate();
  initThemeToggle();
  createIcons();
  initWhatsAppLinks();
  initMobileContentGuard();
}

content.addEventListener("click", (event) => {
  const galleryButton = event.target.closest("[data-gallery-image]");
  if (!galleryButton) return;

  content.querySelectorAll("[data-gallery-image]").forEach((button) => button.classList.remove("is-active"));
  galleryButton.classList.add("is-active");
  content.querySelector("[data-main-detail-image]").src = galleryButton.dataset.galleryImage;
});

render();
