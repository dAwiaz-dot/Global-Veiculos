// Edite as informações principais da loja aqui.
const STORE = {
  name: "Global Veículos",
  city: "Alfenas - MG",
  // Numero vindo do Instagram. Troque sem +, espacos ou tracos se mudar.
  whatsappNumber: "5535999740120",
  defaultMessage: "Olá, tenho interesse em um veículo da Global Veículos.",
};

const STORAGE_KEY = "globalVehiclesInventory";
const PAGE_CACHE_KEY = "globalVehiclesLastInventory";
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

// Troque, remova ou adicione veículos nesta lista.
const defaultVehicles = [
  {
    id: "chevrolet-onix-lt",
    brand: "Chevrolet",
    name: "Chevrolet Onix LT 1.0",
    year: "2020/2021",
    yearNumber: 2021,
    mileage: "68.000 km",
    transmission: "Manual",
    fuel: "Flex",
    color: "Prata",
    price: 62900,
    badge: "Econômico",
    images: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Direção elétrica", "Ar-condicionado", "Multimídia", "Airbag duplo", "Freios ABS"],
    description:
      "Hatch seminovo com ótima aceitação, baixo consumo e manutenção acessível. Boa opção para uso diário, aplicativos e primeira compra.",
  },
  {
    id: "hyundai-hb20-comfort",
    brand: "Hyundai",
    name: "Hyundai HB20 Comfort",
    year: "2019/2020",
    yearNumber: 2020,
    mileage: "72.500 km",
    transmission: "Manual",
    fuel: "Flex",
    color: "Branco",
    price: 58900,
    badge: "Revisado",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Ar-condicionado", "Vidros elétricos", "Travas elétricas", "Som original", "Computador de bordo"],
    description:
      "Compacto confortável, fácil de dirigir e com bom espaço interno. Veículo ideal para quem busca custo-benefício e liquidez na revenda.",
  },
  {
    id: "fiat-strada-endurance",
    brand: "Fiat",
    name: "Fiat Strada Endurance",
    year: "2021/2022",
    yearNumber: 2022,
    mileage: "54.000 km",
    transmission: "Manual",
    fuel: "Flex",
    color: "Vermelha",
    price: 82900,
    badge: "Aceita troca",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Caçamba", "Controle de estabilidade", "Ar-condicionado", "Direção hidráulica", "Protetor de caçamba"],
    description:
      "Picape versátil para trabalho e rotina. Boa capacidade de carga, mecânica conhecida e excelente procura no mercado regional.",
  },
  {
    id: "volkswagen-gol-msi",
    brand: "Volkswagen",
    name: "Volkswagen Gol 1.6 MSI",
    year: "2018/2019",
    yearNumber: 2019,
    mileage: "89.000 km",
    transmission: "Manual",
    fuel: "Flex",
    color: "Cinza",
    price: 52900,
    badge: "Popular",
    images: [
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Motor 1.6", "Ar-condicionado", "Direção hidráulica", "Vidros elétricos", "Rodas de liga"],
    description:
      "Modelo conhecido pela robustez e manutenção simples. Uma alternativa prática para quem procura carro popular com motor forte.",
  },
  {
    id: "toyota-corolla-xei",
    brand: "Toyota",
    name: "Toyota Corolla XEi 2.0",
    year: "2017/2018",
    yearNumber: 2018,
    mileage: "96.000 km",
    transmission: "Automático",
    fuel: "Flex",
    color: "Preto",
    price: 97900,
    badge: "Completo",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562911791-c7a97b729ec5?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Câmbio automático", "Bancos em couro", "Piloto automático", "Câmera de ré", "Central multimídia"],
    description:
      "Sedã confortável e confiável, com acabamento superior e excelente reputação de durabilidade. Ideal para família e estrada.",
  },
  {
    id: "honda-civic-exl",
    brand: "Honda",
    name: "Honda Civic EXL",
    year: "2016/2017",
    yearNumber: 2017,
    mileage: "103.000 km",
    transmission: "Automático",
    fuel: "Flex",
    color: "Branco",
    price: 92900,
    badge: "Premium",
    images: [
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Teto solar", "Bancos em couro", "Start stop", "Controle de tração", "Ar digital"],
    description:
      "Sedã com presença, tecnologia e conforto. Excelente para quem busca um seminovo completo com visual moderno.",
  },
  {
    id: "jeep-renegade-longitude",
    brand: "Jeep",
    name: "Jeep Renegade Longitude",
    year: "2020/2021",
    yearNumber: 2021,
    mileage: "61.000 km",
    transmission: "Automático",
    fuel: "Flex",
    color: "Azul",
    price: 104900,
    badge: "SUV",
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Câmbio automático", "Controle de estabilidade", "Multimídia", "Rodas de liga", "Sensor de estacionamento"],
    description:
      "SUV confortável e bem equipado, com posição alta de dirigir e ótimo apelo para uso urbano e viagens curtas.",
  },
  {
    id: "renault-sandero-stepway",
    brand: "Renault",
    name: "Renault Sandero Stepway",
    year: "2018/2019",
    yearNumber: 2019,
    mileage: "84.000 km",
    transmission: "Manual",
    fuel: "Flex",
    color: "Prata",
    price: 54900,
    badge: "Espaçoso",
    images: [
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Suspensão elevada", "Ar-condicionado", "Direção hidráulica", "Multimídia", "Rodas de liga"],
    description:
      "Hatch com bom espaço interno e visual aventureiro. Indicado para quem quer praticidade sem abrir mão de conforto.",
  },
];

async function loadVehicles() {
  try {
    const response = await fetch("/api/vehicles", { cache: "no-store" });
    if (response.ok) {
      const apiVehicles = await response.json();
      if (Array.isArray(apiVehicles)) {
        localStorage.setItem(PAGE_CACHE_KEY, JSON.stringify(apiVehicles));
        return apiVehicles;
      }
    }
  } catch (error) {
    console.warn("Nao foi possivel carregar estoque do servidor.", error);
  }

  try {
    const savedVehicles = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(savedVehicles)) {
      return savedVehicles;
    }
  } catch (error) {
    console.warn("Nao foi possivel carregar o estoque salvo.", error);
  }

  return defaultVehicles;
}

let vehicles = [];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const grid = document.querySelector("[data-vehicle-grid]");
const emptyState = document.querySelector("[data-empty-state]");
const searchInput = document.querySelector("[data-search]");
const brandFilter = document.querySelector("[data-brand-filter]");
const priceFilter = document.querySelector("[data-price-filter]");
const yearFilter = document.querySelector("[data-year-filter]");
const clearFiltersButton = document.querySelector("[data-clear-filters]");
const modal = document.querySelector("[data-vehicle-modal]");
const modalContent = document.querySelector("[data-modal-content]");
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function whatsappUrl(message = STORE.defaultMessage) {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function renderBrands() {
  if (!brandFilter) return;

  const brands = [...new Set(vehicles.map((vehicle) => vehicle.brand))].sort((a, b) => a.localeCompare(b));
  brandFilter.innerHTML = '<option value="">Todas</option>';
  brandFilter.insertAdjacentHTML(
    "beforeend",
    brands.map((brand) => `<option value="${brand}">${brand}</option>`).join("")
  );
}

function vehicleCard(vehicle) {
  const status = vehicle.status || "Disponível";
  const isSold = status.toLowerCase() === "vendido";
  const badge = isSold ? "Vendido" : vehicle.badge;
  const interestMessage = `Olá, tenho interesse no ${vehicle.name} da ${STORE.name}.`;

  return `
    <article class="vehicle-card reveal ${isSold ? "is-sold" : ""}" data-vehicle-id="${vehicle.id}">
      <div class="vehicle-image">
        <img src="${vehicle.images?.[0] || PLACEHOLDER_IMAGE}" alt="${vehicle.name}" loading="lazy">
        <span class="vehicle-badge ${isSold ? "is-sold" : ""}">${badge}</span>
      </div>
      <div class="vehicle-body">
        <div class="vehicle-title-row">
          <h3>${vehicle.name}</h3>
          <span class="vehicle-price">${currency.format(vehicle.price)}</span>
        </div>
        <dl class="vehicle-specs">
          <div><dt>Ano</dt><dd>${vehicle.year}</dd></div>
          <div><dt>Km</dt><dd>${vehicle.mileage}</dd></div>
          <div><dt>Câmbio</dt><dd>${vehicle.transmission}</dd></div>
          <div><dt>Combustível</dt><dd>${vehicle.fuel}</dd></div>
        </dl>
        <div class="vehicle-actions">
          <a class="btn btn-primary" href="${whatsappUrl(interestMessage)}" target="_blank" rel="noreferrer">
            <i data-lucide="message-circle"></i>
            <span>${isSold ? "Consultar similares" : "Tenho interesse"}</span>
          </a>
          <a class="btn btn-outline" href="vehicle.html?id=${encodeURIComponent(vehicle.id)}">
            <i data-lucide="search"></i>
            <span>Ver detalhes</span>
          </a>
        </div>
      </div>
    </article>
  `;
}

function currentFilters() {
  return {
    search: searchInput?.value.trim().toLowerCase() || "",
    brand: brandFilter?.value || "",
    maxPrice: Number(priceFilter?.value) || Infinity,
    minYear: Number(yearFilter?.value) || 0,
  };
}

function filterVehicles() {
  const filters = currentFilters();

  return vehicles.filter((vehicle) => {
    const matchesSearch = !filters.search || vehicle.name.toLowerCase().includes(filters.search);
    const matchesBrand = !filters.brand || vehicle.brand === filters.brand;
    const matchesPrice = vehicle.price <= filters.maxPrice;
    const matchesYear = vehicle.yearNumber >= filters.minYear;

    return matchesSearch && matchesBrand && matchesPrice && matchesYear;
  });
}

function renderVehicles() {
  if (!grid || !emptyState) return;

  const filteredVehicles = filterVehicles().sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  grid.innerHTML = filteredVehicles.map(vehicleCard).join("");
  emptyState.hidden = filteredVehicles.length > 0;
  localStorage.setItem(PAGE_CACHE_KEY, JSON.stringify(vehicles));
  createIcons();
  observeReveals();
}

function detailsTemplate(vehicle) {
  const images = vehicle.images?.length ? vehicle.images : [PLACEHOLDER_IMAGE];
  const options = vehicle.options?.length ? vehicle.options : ["Procedência conferida"];
  const financeInfo =
    vehicle.finance?.installments && vehicle.finance?.monthlyPayment
      ? `${vehicle.finance.installments}x de ${currency.format(vehicle.finance.monthlyPayment)}`
      : "";

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
        <p class="eyebrow">${vehicle.brand}</p>
        <h2 id="vehicle-modal-title">${vehicle.name}</h2>
        <div class="details-price">${currency.format(vehicle.price)}</div>
        <div class="details-specs">
          <span><small>Ano</small><strong>${vehicle.year}</strong></span>
          <span><small>Quilometragem</small><strong>${vehicle.mileage}</strong></span>
          <span><small>Câmbio</small><strong>${vehicle.transmission}</strong></span>
          <span><small>Combustível</small><strong>${vehicle.fuel}</strong></span>
          <span><small>Cor</small><strong>${vehicle.color}</strong></span>
          <span><small>Procedência</small><strong>Conferida</strong></span>
          ${financeInfo ? `<span><small>Financeiro</small><strong>${financeInfo}</strong></span>` : ""}
        </div>
        <h3>Opcionais</h3>
        <ul class="optional-list">
          ${options.map((option) => `<li>${option}</li>`).join("")}
        </ul>
        <h3>Descrição</h3>
        <p class="details-description">${vehicle.description}</p>
        <a class="btn btn-primary" href="${whatsappUrl(`Olá, tenho interesse no ${vehicle.name} da ${STORE.name}.`)}" target="_blank" rel="noreferrer">
          <i data-lucide="message-circle"></i>
          <span>Chamar no WhatsApp</span>
        </a>
        <a class="btn btn-outline" href="vehicle.html?id=${encodeURIComponent(vehicle.id)}">
          <i data-lucide="external-link"></i>
          <span>Abrir página do veículo</span>
        </a>
      </div>
    </div>
  `;
}

function openDetails(vehicleId) {
  if (!modal || !modalContent) return;

  const vehicle = vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) return;

  modalContent.innerHTML = detailsTemplate(vehicle);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  createIcons();
  modal.querySelector(".modal-close").focus();
}

function closeDetails() {
  if (!modal || !modalContent) return;

  modal.hidden = true;
  modalContent.innerHTML = "";
  document.body.classList.remove("modal-open");
}

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

function observeReveals() {
  const revealItems = document.querySelectorAll(".reveal:not(.is-visible)");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function updateHeader() {
  if (!header) return;

  const shouldStaySolid = !document.body.classList.contains("home-page");
  header.classList.toggle("is-scrolled", shouldStaySolid || window.scrollY > 16);
}

function closeMobileMenu() {
  if (!header || !menuToggle) return;

  header.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function initWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const message = link.dataset.message || STORE.defaultMessage;
    link.setAttribute("href", whatsappUrl(message));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const vehicle = formData.get("vehicle")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    const whatsappMessage = [
      `Olá, meu nome é ${name}.`,
      phone ? `Meu telefone é ${phone}.` : "",
      vehicle ? `Tenho interesse em: ${vehicle}.` : "Tenho interesse em um veículo da loja.",
      message ? `Mensagem: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappUrl(whatsappMessage), "_blank", "noopener,noreferrer");
    form.reset();
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

function initVehicleFilters() {
  [searchInput, brandFilter, priceFilter, yearFilter].filter(Boolean).forEach((control) => {
    control.addEventListener("input", renderVehicles);
  });

  clearFiltersButton?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (brandFilter) brandFilter.value = "";
    if (priceFilter) priceFilter.value = "";
    if (yearFilter) yearFilter.value = "";
    renderVehicles();
  });
}

function initVehicleModal() {
  if (!grid || !modal) return;

  grid.addEventListener("click", (event) => {
    const detailsButton = event.target.closest("[data-details]");
    if (detailsButton) {
      openDetails(detailsButton.dataset.details);
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-details]")) {
      closeDetails();
    }

    const galleryButton = event.target.closest("[data-gallery-image]");
    if (galleryButton) {
      modal.querySelectorAll("[data-gallery-image]").forEach((button) => button.classList.remove("is-active"));
      galleryButton.classList.add("is-active");
      modal.querySelector("[data-main-detail-image]").src = galleryButton.dataset.galleryImage;
    }
  });
}

async function initSite() {
  vehicles = await loadVehicles();
  renderBrands();
  renderVehicles();
  initWhatsAppLinks();
  initContactForm();
  initMobileContentGuard();
  initThemeToggle();
  initVehicleFilters();
  initVehicleModal();
  observeReveals();
  createIcons();
  updateHeader();
}

initSite();

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) {
    closeDetails();
  }
});

menuToggle?.addEventListener("click", () => {
  if (!header) return;
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMobileMenu();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 1040) {
    closeMobileMenu();
  }
});
