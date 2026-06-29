const STORAGE_KEY = "globalVehiclesInventory";
const PAGE_CACHE_KEY = "globalVehiclesLastInventory";
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

const seedVehicles = [
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
    status: "Disponível",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Direção elétrica", "Ar-condicionado", "Multimídia", "Airbag duplo", "Freios ABS"],
    description: "Hatch seminovo com ótima aceitação, baixo consumo e manutenção acessível.",
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
    status: "Disponível",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Caçamba", "Controle de estabilidade", "Ar-condicionado", "Direção hidráulica"],
    description: "Picape versátil para trabalho e rotina, com boa procura no mercado regional.",
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
    status: "Disponível",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    ],
    options: ["Câmbio automático", "Bancos em couro", "Piloto automático", "Câmera de ré"],
    description: "Sedã confortável e confiável, ideal para família e estrada.",
  },
];

let vehicles = [];
let currentImages = [];
let apiAuthenticated = false;
let toastTimeout;

const logoutButton = document.querySelector("[data-logout]");
const form = document.querySelector("[data-vehicle-form]");
const financeForm = document.querySelector("[data-finance-form]");
const metaForm = document.querySelector("[data-meta-form]");
const vehicleSelects = document.querySelectorAll("[data-vehicle-select]");
const formTitle = document.querySelector("[data-form-title]");
const stockList = document.querySelector("[data-stock-list]");
const stockSearch = document.querySelector("[data-stock-search]");
const statusFilter = document.querySelector("[data-status-filter]");
const sortStock = document.querySelector("[data-sort-stock]");
const photoPreview = document.querySelector("[data-photo-preview]");
const photoFiles = document.querySelector("[data-photo-files]");
const photoUrl = document.querySelector("[data-photo-url]");
const addPhotoUrlButton = document.querySelector("[data-add-photo-url]");
const deleteCurrentButton = document.querySelector("[data-delete-current]");
const clearStockButton = document.querySelector("[data-clear-stock]");
const adPreview = document.querySelector("[data-ad-preview]");
const optionChips = document.querySelector("[data-option-chips]");
const priceReadout = document.querySelector("[data-price-readout]");
const mileageReadout = document.querySelector("[data-mileage-readout]");
const toast = document.querySelector("[data-toast]");
const emptyTemplate = document.querySelector("[data-empty-template]");

const totalVehicles = document.querySelector("[data-total-vehicles]");
const totalPhotos = document.querySelector("[data-total-photos]");
const totalAvailable = document.querySelector("[data-total-available]");
const totalBlocked = document.querySelector("[data-total-blocked]");

function redirectToLogin() {
  const next = encodeURIComponent(window.location.pathname || "/admin.html");
  window.location.href = `login.html?next=${next}`;
}

function setAdminLocked(locked) {
  if (locked) redirectToLogin();
}

async function checkSession() {
  try {
    const response = await fetch("/api/session", { cache: "no-store" });
    if (!response.ok) throw new Error("Sessão indisponível");

    const session = await response.json();
    apiAuthenticated = Boolean(session.authenticated);

    if (!apiAuthenticated) {
      setAdminLocked(true);
      return false;
    }

    if (session.defaultPassword) {
      showToast("ADM logado. Troque a senha padrão antes de publicar.");
    }

    return true;
  } catch (error) {
    console.warn("Nao foi possivel validar a sessao.", error);
    apiAuthenticated = false;
    setAdminLocked(true);
    return false;
  }
}

async function loadVehicles() {
  try {
    const response = await fetch("/api/vehicles", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar o estoque.");

    const saved = await response.json();
    if (Array.isArray(saved)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(PAGE_CACHE_KEY, JSON.stringify(saved));
      return saved;
    }
  } catch (error) {
    console.warn("Nao foi possivel carregar o estoque do servidor.", error);
    showToast("Não consegui carregar o estoque do servidor.");
  }

  return [];
}

async function saveVehicles() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  localStorage.setItem(PAGE_CACHE_KEY, JSON.stringify(vehicles));

  if (!apiAuthenticated) {
    setAdminLocked(true);
    throw new Error("Faça login para salvar alterações.");
  }

  const response = await fetch("/api/vehicles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicles),
  });

  if (response.status === 401) {
    apiAuthenticated = false;
    setAdminLocked(true);
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Não foi possível salvar no servidor.");
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeOptions(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeMoney(value) {
  return Number(value) || 0;
}

function formatMileage(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "0 km";
  return `${Number(digits).toLocaleString("pt-BR")} km`;
}

function escapeHTML(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch (error) {
    return "";
  }
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

function statusClass(status) {
  const value = slugify(status || "Disponível");
  if (value.includes("vendido")) return "is-sold";
  if (value.includes("reservado")) return "is-reserved";
  if (value.includes("oferta")) return "is-offer";
  return "is-available";
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
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

function markActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "admin.html";
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    const linkPage = link.getAttribute("href")?.split("?")[0];
    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function getQueryVehicleId() {
  return new URLSearchParams(window.location.search).get("id") || "";
}

function findVehicle(vehicleId) {
  return vehicles.find((item) => item.id === vehicleId);
}

function formValue(data, name, fallback = "") {
  const value = data.get(name);
  return value == null ? fallback : value.toString();
}

function setField(targetForm, name, value) {
  if (!targetForm?.elements?.[name]) return;
  targetForm.elements[name].value = value ?? "";
}

function setChecked(targetForm, name, value) {
  if (!targetForm?.elements?.[name]) return;
  targetForm.elements[name].checked = Boolean(value);
}

function currentOptions() {
  if (!form?.elements?.options) return [];
  return normalizeOptions(form.elements.options.value);
}

function updateOptionChips() {
  if (!optionChips) return;

  const selected = new Set(currentOptions().map((option) => option.toLowerCase()));
  optionChips.querySelectorAll("[data-option-value]").forEach((button) => {
    button.classList.toggle("is-active", selected.has(button.dataset.optionValue.toLowerCase()));
  });
}

function updateFieldReadouts() {
  if (!form) return;

  if (priceReadout) {
    priceReadout.textContent = formatCurrency(form.elements.price?.value);
  }

  if (mileageReadout) {
    mileageReadout.textContent = formatMileage(form.elements.mileage?.value);
  }

  updateOptionChips();
}

function renderStats() {
  const availableStatuses = new Set(["Disponível", "Recém-chegado", "Oferta"]);

  if (totalVehicles) totalVehicles.textContent = vehicles.length;
  if (totalPhotos) totalPhotos.textContent = vehicles.reduce((sum, vehicle) => sum + (vehicle.images?.length || 0), 0);
  if (totalAvailable) {
    totalAvailable.textContent = vehicles.filter((vehicle) =>
      availableStatuses.has(vehicle.status || "Disponível")
    ).length;
  }
  if (totalBlocked) {
    totalBlocked.textContent = vehicles.filter((vehicle) => ["Reservado", "Vendido"].includes(vehicle.status)).length;
  }
}

function filteredVehicles() {
  const term = (stockSearch?.value || "").trim().toLowerCase();
  const status = statusFilter?.value || "all";
  const order = sortStock?.value || "featured";
  const originalOrder = new Map(vehicles.map((vehicle, index) => [vehicle.id, index]));

  return [...vehicles]
    .filter((vehicle) => {
      const searchable = [vehicle.name, vehicle.brand, vehicle.year, vehicle.color]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !term || searchable.includes(term);
      const matchesStatus = status === "all" || (vehicle.status || "Disponível") === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (order === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (order === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (order === "year-desc") return (Number(b.yearNumber) || 0) - (Number(a.yearNumber) || 0);
      if (order === "name-asc") return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR");

      const featuredSort = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      return featuredSort || (originalOrder.get(a.id) || 0) - (originalOrder.get(b.id) || 0);
    });
}

function emptyStockMarkup() {
  return (
    emptyTemplate?.innerHTML ||
    `<div class="empty-panel">
      <i data-lucide="car-front"></i>
      <h3>Nenhum veículo cadastrado</h3>
      <p>Cadastre um veículo para publicar no site.</p>
    </div>`
  );
}

function renderStockList() {
  renderStats();
  if (!stockList) return;

  if (vehicles.length === 0) {
    stockList.innerHTML = emptyStockMarkup();
    createIcons();
    return;
  }

  const visibleVehicles = filteredVehicles();

  if (visibleVehicles.length === 0) {
    stockList.innerHTML = `
      <div class="empty-panel">
        <i data-lucide="search-x"></i>
        <h3>Nenhum veículo encontrado</h3>
        <p>Ajuste a busca ou o filtro de status para ver outros carros.</p>
      </div>
    `;
    createIcons();
    return;
  }

  stockList.innerHTML = visibleVehicles
    .map((vehicle) => {
      const status = vehicle.status || "Disponível";
      const vehicleId = encodeURIComponent(vehicle.id);
      const detailsUrl = `vehicle.html?id=${vehicleId}`;
      const metaUrl = safeExternalUrl(vehicle.meta?.adUrl || "");
      const financeText =
        vehicle.finance?.installments && vehicle.finance?.monthlyPayment
          ? `${vehicle.finance.installments}x ${formatCurrency(vehicle.finance.monthlyPayment)}`
          : "";

      return `
        <article class="stock-item">
          <div class="stock-thumb">
            <img src="${escapeHTML(vehicle.images?.[0] || PLACEHOLDER_IMAGE)}" alt="${escapeHTML(vehicle.name)}">
          </div>
          <div class="stock-info">
            <h3>${escapeHTML(vehicle.name)}</h3>
            <div class="stock-meta">
              <span>${escapeHTML(vehicle.year)}</span>
              <span>${escapeHTML(vehicle.mileage)}</span>
              <span>${formatCurrency(vehicle.price)}</span>
            </div>
            <div class="stock-tags">
              <span class="status-pill ${statusClass(status)}">${escapeHTML(status)}</span>
              ${vehicle.featured ? "<span>Destaque</span>" : ""}
              ${vehicle.images?.length ? `<span>${vehicle.images.length} foto${vehicle.images.length > 1 ? "s" : ""}</span>` : ""}
              ${financeText ? `<span>${escapeHTML(financeText)}</span>` : ""}
              ${vehicle.meta?.campaign ? "<span>Meta Ads</span>" : ""}
            </div>
            <div class="stock-actions">
              <a class="edit-btn" href="admin-cadastro.html?id=${vehicleId}">Cadastro</a>
              <a class="duplicate-btn" href="admin-financeiro.html?id=${vehicleId}">Financeiro</a>
              <a class="open-btn" href="admin-meta.html?id=${vehicleId}">Meta</a>
              <a class="open-btn" href="${detailsUrl}" target="_blank" rel="noreferrer">Site</a>
              ${
                metaUrl
                  ? `<a class="open-btn" href="${escapeHTML(metaUrl)}" target="_blank" rel="noreferrer">Anúncio</a>`
                  : ""
              }
              <button class="duplicate-btn" type="button" data-duplicate="${escapeHTML(vehicle.id)}">Duplicar</button>
              <button class="delete-btn" type="button" data-delete="${escapeHTML(vehicle.id)}">Excluir</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  createIcons();
}

function renderAdPreview() {
  if (!adPreview || !form) return;

  const data = new FormData(form);
  const name = formValue(data, "name").trim() || "Nome do veículo";
  const brand = formValue(data, "brand").trim();
  const year = formValue(data, "year").trim() || "Ano/modelo";
  const mileage = formValue(data, "mileage").trim() || "Quilometragem";
  const transmission = formValue(data, "transmission");
  const fuel = formValue(data, "fuel");
  const status = formValue(data, "status") || "Disponível";
  const price = Number(formValue(data, "price")) || 0;
  const priceLabel = price > 0 ? formatCurrency(price) : "Preço a consultar";
  const tags = [brand, fuel, transmission].filter(Boolean).slice(0, 3);
  const image = currentImages[0] || PLACEHOLDER_IMAGE;

  adPreview.innerHTML = `
    <div class="preview-heading">
      <strong>Preview do anúncio</strong>
      <span class="status-pill ${statusClass(status)}">${escapeHTML(status)}</span>
    </div>
    <div class="preview-card">
      <div class="preview-image">
        <img src="${escapeHTML(image)}" alt="${escapeHTML(name)}">
      </div>
      <div class="preview-info">
        <h3>${escapeHTML(name)}</h3>
        <p>${escapeHTML(year)} • ${escapeHTML(mileage)}</p>
        <div class="preview-price">${priceLabel}</div>
        <div class="preview-tags">
          ${tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderPhotoPreview() {
  if (!photoPreview) {
    renderAdPreview();
    return;
  }

  if (currentImages.length === 0) {
    photoPreview.innerHTML = "";
    renderAdPreview();
    return;
  }

  photoPreview.innerHTML = currentImages
    .map(
      (image, index) => `
        <div class="photo-item">
          <img src="${escapeHTML(image)}" alt="Foto ${index + 1} do veículo">
          <button type="button" aria-label="Remover foto" data-remove-photo="${index}">
            <i data-lucide="x"></i>
          </button>
        </div>
      `
    )
    .join("");

  createIcons();
  renderAdPreview();
}

function resetForm() {
  if (!form) return;

  form.reset();
  setField(form, "id", "");
  currentImages = [];
  if (formTitle) formTitle.textContent = "Adicionar veículo";
  if (deleteCurrentButton) deleteCurrentButton.hidden = true;
  renderPhotoPreview();
  updateFieldReadouts();
}

function fillForm(vehicle, shouldScroll = true) {
  if (!form || !vehicle) return;

  setField(form, "id", vehicle.id);
  setField(form, "name", vehicle.name || "");
  setField(form, "brand", vehicle.brand || "");
  setField(form, "year", vehicle.year || "");
  setField(form, "yearNumber", vehicle.yearNumber || "");
  setField(form, "price", vehicle.price || "");
  setField(form, "mileage", vehicle.mileage || "");
  setField(form, "transmission", vehicle.transmission || "Manual");
  setField(form, "fuel", vehicle.fuel || "Flex");
  setField(form, "color", vehicle.color || "");
  setField(form, "badge", vehicle.badge || "");
  setField(form, "status", vehicle.status || "Disponível");
  setChecked(form, "featured", vehicle.featured);
  setField(form, "options", (vehicle.options || []).join(", "));
  setField(form, "description", vehicle.description || "");

  currentImages = [...(vehicle.images || [])];
  if (formTitle) formTitle.textContent = "Editar veículo";
  if (deleteCurrentButton) deleteCurrentButton.hidden = false;
  renderPhotoPreview();
  updateFieldReadouts();

  if (shouldScroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function vehicleFromForm() {
  const data = new FormData(form);
  const name = formValue(data, "name").trim();
  const existingId = formValue(data, "id").trim();
  const previousVehicle = existingId ? findVehicle(existingId) : null;

  return {
    id: existingId || `${slugify(name)}-${Date.now()}`,
    brand: formValue(data, "brand").trim(),
    name,
    year: formValue(data, "year").trim(),
    yearNumber: Number(formValue(data, "yearNumber")) || new Date().getFullYear(),
    mileage: formValue(data, "mileage").trim(),
    transmission: formValue(data, "transmission", "Manual"),
    fuel: formValue(data, "fuel", "Flex"),
    color: formValue(data, "color").trim(),
    price: Number(formValue(data, "price")) || 0,
    badge: formValue(data, "badge").trim() || "Disponível",
    status: formValue(data, "status", "Disponível"),
    featured: formValue(data, "featured") === "on",
    images: currentImages.length > 0 ? [...currentImages] : [PLACEHOLDER_IMAGE],
    options: normalizeOptions(formValue(data, "options")),
    description: formValue(data, "description").trim(),
    finance: previousVehicle?.finance || {},
    meta: previousVehicle?.meta || {},
  };
}

async function compressImage(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const maxWidth = 1200;
      const scale = Math.min(1, maxWidth / image.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

async function addFiles(files) {
  const imageFiles = [...files].filter((file) => file.type.startsWith("image/"));
  const compressed = await Promise.all(imageFiles.map(compressImage));
  currentImages.push(...compressed);
  renderPhotoPreview();
}

async function deleteVehicle(vehicleId) {
  const vehicle = findVehicle(vehicleId);
  if (!vehicle) return;

  const confirmed = window.confirm(`Excluir "${vehicle.name}" do estoque salvo?`);
  if (!confirmed) return;

  const previousVehicles = vehicles;
  vehicles = vehicles.filter((item) => item.id !== vehicleId);

  try {
    await saveVehicles();
  } catch (error) {
    vehicles = previousVehicles;
    showToast(error.message);
    return;
  }

  if (form?.elements?.id?.value === vehicleId) {
    resetForm();
  }

  renderStockList();
  renderVehicleSelects();
  showToast("Veículo excluído do estoque.");
}

async function duplicateVehicle(vehicleId) {
  const vehicle = findVehicle(vehicleId);
  if (!vehicle) return;

  const copy = JSON.parse(JSON.stringify(vehicle));
  copy.id = `${slugify(copy.name)}-copia-${Date.now()}`;
  copy.name = `${copy.name} (cópia)`;
  copy.status = "Disponível";

  vehicles.unshift(copy);

  try {
    await saveVehicles();
  } catch (error) {
    vehicles.shift();
    showToast(error.message);
    return;
  }

  renderStockList();
  renderVehicleSelects();
  if (form) fillForm(copy);
  showToast("Cópia criada. Revise os dados antes de publicar.");
}

function renderVehicleSelects() {
  vehicleSelects.forEach((select) => {
    const current = select.value || getQueryVehicleId();
    select.innerHTML = `
      <option value="">Escolha um veículo</option>
      ${vehicles.map((vehicle) => `<option value="${escapeHTML(vehicle.id)}">${escapeHTML(vehicle.name)}</option>`).join("")}
    `;

    if (current && findVehicle(current)) {
      select.value = current;
    }
  });
}

function fillFinanceForm(vehicle) {
  if (!financeForm) return;

  setField(financeForm, "id", vehicle?.id || "");
  setField(financeForm, "downPayment", vehicle?.finance?.downPayment || "");
  setField(financeForm, "installments", vehicle?.finance?.installments || "");
  setField(financeForm, "monthlyPayment", vehicle?.finance?.monthlyPayment || "");
  setField(financeForm, "financeBank", vehicle?.finance?.bank || "");
  setField(financeForm, "financeNotes", vehicle?.finance?.notes || "");
}

function fillMetaForm(vehicle) {
  if (!metaForm) return;

  setField(metaForm, "id", vehicle?.id || "");
  setField(metaForm, "metaCampaign", vehicle?.meta?.campaign || "");
  setField(metaForm, "metaStatus", vehicle?.meta?.status || "");
  setField(metaForm, "metaBudget", vehicle?.meta?.budget || "");
  setField(metaForm, "metaLeads", vehicle?.meta?.leads || "");
  setField(metaForm, "metaAdUrl", vehicle?.meta?.adUrl || "");
}

function syncInitialVehicle() {
  const vehicleId = getQueryVehicleId();
  if (!vehicleId) {
    renderPhotoPreview();
    updateFieldReadouts();
    fillFinanceForm(null);
    fillMetaForm(null);
    return;
  }

  const vehicle = findVehicle(vehicleId);
  if (!vehicle) {
    showToast("Veículo não encontrado no estoque.");
    return;
  }

  fillForm(vehicle, false);
  fillFinanceForm(vehicle);
  fillMetaForm(vehicle);
}

function handleVehicleSelectChange(select) {
  const vehicle = findVehicle(select.value);

  if (financeForm?.contains(select)) {
    fillFinanceForm(vehicle);
  }

  if (metaForm?.contains(select)) {
    fillMetaForm(vehicle);
  }
}

async function saveFinanceForm() {
  const vehicleId = financeForm.elements.id.value;
  const vehicle = findVehicle(vehicleId);

  if (!vehicle) {
    showToast("Escolha um veículo para salvar o financeiro.");
    return;
  }

  const previousFinance = vehicle.finance ? { ...vehicle.finance } : {};
  vehicle.finance = {
    downPayment: normalizeMoney(financeForm.elements.downPayment.value),
    installments: Number(financeForm.elements.installments.value) || 0,
    monthlyPayment: normalizeMoney(financeForm.elements.monthlyPayment.value),
    bank: financeForm.elements.financeBank.value.trim(),
    notes: financeForm.elements.financeNotes.value.trim(),
  };

  try {
    await saveVehicles();
  } catch (error) {
    vehicle.finance = previousFinance;
    showToast(error.message);
    return;
  }

  renderStockList();
  renderVehicleSelects();
  financeForm.elements.id.value = vehicleId;
  showToast("Financeiro salvo no estoque.");
}

async function saveMetaForm() {
  const vehicleId = metaForm.elements.id.value;
  const vehicle = findVehicle(vehicleId);

  if (!vehicle) {
    showToast("Escolha um veículo para vincular ao Meta.");
    return;
  }

  const previousMeta = vehicle.meta ? { ...vehicle.meta } : {};
  vehicle.meta = {
    campaign: metaForm.elements.metaCampaign.value.trim(),
    status: metaForm.elements.metaStatus.value,
    budget: normalizeMoney(metaForm.elements.metaBudget.value),
    leads: Number(metaForm.elements.metaLeads.value) || 0,
    adUrl: metaForm.elements.metaAdUrl.value.trim(),
  };

  try {
    await saveVehicles();
  } catch (error) {
    vehicle.meta = previousMeta;
    showToast(error.message);
    return;
  }

  renderStockList();
  renderVehicleSelects();
  metaForm.elements.id.value = vehicleId;
  showToast("Dados do Meta Ads salvos.");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const vehicle = vehicleFromForm();
  const existingIndex = vehicles.findIndex((item) => item.id === vehicle.id);
  const previousVehicle = existingIndex >= 0 ? vehicles[existingIndex] : null;

  if (existingIndex >= 0) {
    vehicles[existingIndex] = vehicle;
  } else {
    vehicles.unshift(vehicle);
  }

  try {
    await saveVehicles();
  } catch (error) {
    if (existingIndex >= 0) {
      vehicles[existingIndex] = previousVehicle;
    } else {
      vehicles.shift();
    }
    showToast(error.message);
    return;
  }

  renderStockList();
  renderVehicleSelects();
  fillForm(vehicle);
  window.history.replaceState(null, "", `admin-cadastro.html?id=${encodeURIComponent(vehicle.id)}`);
  showToast("Veículo salvo e publicado no site.");
});

form?.addEventListener("input", () => {
  renderAdPreview();
  updateFieldReadouts();
});

form?.addEventListener("change", () => {
  renderAdPreview();
  updateFieldReadouts();
});

financeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveFinanceForm();
});

metaForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveMetaForm();
});

vehicleSelects.forEach((select) => {
  select.addEventListener("change", () => handleVehicleSelectChange(select));
});

optionChips?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option-value]");
  if (!button || !form?.elements?.options) return;

  const option = button.dataset.optionValue;
  const options = currentOptions();
  const optionIndex = options.findIndex((item) => item.toLowerCase() === option.toLowerCase());

  if (optionIndex >= 0) {
    options.splice(optionIndex, 1);
  } else {
    options.push(option);
  }

  form.elements.options.value = options.join(", ");
  updateOptionChips();
  renderAdPreview();
});

document.querySelector("[data-new-vehicle]")?.addEventListener("click", () => {
  resetForm();
  window.history.replaceState(null, "", "admin-cadastro.html");
});

document.querySelector("[data-reset-form]")?.addEventListener("click", resetForm);

deleteCurrentButton?.addEventListener("click", async () => {
  await deleteVehicle(form?.elements?.id?.value);
});

stockList?.addEventListener("click", async (event) => {
  const deleteButton = event.target.closest("[data-delete]");
  const duplicateButton = event.target.closest("[data-duplicate]");

  if (duplicateButton) {
    await duplicateVehicle(duplicateButton.dataset.duplicate);
  }

  if (deleteButton) {
    await deleteVehicle(deleteButton.dataset.delete);
  }
});

stockSearch?.addEventListener("input", renderStockList);
statusFilter?.addEventListener("change", renderStockList);
sortStock?.addEventListener("change", renderStockList);

photoFiles?.addEventListener("change", async (event) => {
  await addFiles(event.target.files);
  photoFiles.value = "";
});

addPhotoUrlButton?.addEventListener("click", () => {
  const value = photoUrl?.value.trim();
  if (!value) return;
  currentImages.push(value);
  photoUrl.value = "";
  renderPhotoPreview();
});

photoPreview?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-photo]");
  if (!removeButton) return;

  currentImages.splice(Number(removeButton.dataset.removePhoto), 1);
  renderPhotoPreview();
});

document.querySelector("[data-load-examples]")?.addEventListener("click", async () => {
  const confirmed = window.confirm("Carregar exemplos vai substituir o estoque salvo no servidor. Continuar?");
  if (!confirmed) return;

  const previousVehicles = vehicles;
  vehicles = JSON.parse(JSON.stringify(seedVehicles));

  try {
    await saveVehicles();
  } catch (error) {
    vehicles = previousVehicles;
    showToast(error.message);
    return;
  }

  resetForm();
  renderStockList();
  renderVehicleSelects();
  showToast("Exemplos carregados no estoque.");
});

document.querySelector("[data-export-json]")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(vehicles, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "global-veiculos-estoque.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Arquivo JSON exportado.");
});

document.querySelector("[data-import-json]")?.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported)) throw new Error("Arquivo inválido");

    const previousVehicles = vehicles;
    vehicles = imported;

    try {
      await saveVehicles();
    } catch (saveError) {
      vehicles = previousVehicles;
      throw saveError;
    }

    resetForm();
    renderStockList();
    renderVehicleSelects();
    showToast("Estoque importado com sucesso.");
  } catch (error) {
    window.alert("Não consegui importar esse JSON. Verifique o arquivo e tente de novo.");
  } finally {
    event.target.value = "";
  }
});

clearStockButton?.addEventListener("click", async () => {
  const confirmed = window.confirm("Zerar todo o estoque publicado no site?");
  if (!confirmed) return;

  const previousVehicles = vehicles;
  vehicles = [];

  try {
    await saveVehicles();
  } catch (error) {
    vehicles = previousVehicles;
    showToast(error.message);
    return;
  }

  resetForm();
  renderStockList();
  renderVehicleSelects();
  showToast("Estoque zerado.");
});

logoutButton?.addEventListener("click", async () => {
  try {
    await fetch("/api/logout", { method: "POST" });
  } catch (error) {
    console.warn("Nao foi possivel encerrar sessao no servidor.", error);
  }

  apiAuthenticated = false;
  window.location.href = "login.html";
});

async function bootstrapAdmin() {
  initThemeToggle();
  initMobileContentGuard();
  markActiveNav();
  createIcons();

  const canLoad = await checkSession();
  if (!canLoad) return;

  vehicles = await loadVehicles();
  renderStockList();
  renderVehicleSelects();
  syncInitialVehicle();
}

bootstrapAdmin();
