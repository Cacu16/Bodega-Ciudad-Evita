const DEFAULT_STORE_CONFIG = {
  businessName: "Bodega Ciudad Evita",
  whatsappNumber: "5491172635509",
  instagramUrl: "https://www.instagram.com/bodega_ciudad_evita/",
  contactEmail: "ciudadevitabodega@gmail.com",
  defaultWhatsappMessage: "Hola, quiero hacer un pedido de Bodega Ciudad Evita",
  wholesaleWhatsappMessage: "Hola, quiero consultar precios mayoristas de Bodega Ciudad Evita",
  products: [
    {
      id: "malbec",
      name: "Malbec",
      tag: "Etiqueta",
      accent: "Asado y mesa",
      note: "Tinto amable, expresivo y facil de compartir.",
      description:
        "Una opcion versatil para carnes, picadas y reuniones donde el vino tiene que acompanar bien y verse a la altura del momento.",
      pairing: "Asados, carnes y tablas",
      profile: "Frutado, calido y cercano",
      image: "assets/images/malbec-branches.png",
      options: [
        {
          label: "Botella individual",
          price: "$5.300",
          message: "Hola, quiero pedir Malbec en botella individual de Bodega Ciudad Evita"
        },
        {
          label: "Caja x6",
          price: "$31.800",
          message: "Hola, quiero pedir Malbec en caja x6 de Bodega Ciudad Evita"
        }
      ]
    },
    {
      id: "cabernet-sauvignon",
      name: "Cabernet Sauvignon",
      tag: "Etiqueta",
      accent: "Cena y regalo",
      note: "Mas estructurado, sobrio y de perfil clasico.",
      description:
        "Pensado para cenas, obsequios y clientes que prefieren un tinto con presencia, buena lectura visual y una presentacion mas formal.",
      pairing: "Carnes rojas y sobremesas",
      profile: "Clasico, firme y elegante",
      image: "assets/images/cabernet-candle.png",
      options: [
        {
          label: "Botella individual",
          price: "$5.300",
          message: "Hola, quiero pedir Cabernet Sauvignon en botella individual de Bodega Ciudad Evita"
        },
        {
          label: "Caja x6",
          price: "$31.800",
          message: "Hola, quiero pedir Cabernet Sauvignon en caja x6 de Bodega Ciudad Evita"
        }
      ]
    }
  ],
  galleryImages: [
    {
      src: "assets/images/wine-pour-friends.png",
      alt: "Servicio de vino Ciudad Evita en una mesa compartida",
      className: "gallery-item-hero",
      objectPosition: "center 56%"
    },
    {
      src: "assets/images/wine-label-detail.png",
      alt: "Detalle de la etiqueta del vino Ciudad Evita",
      className: "gallery-item-detail",
      objectPosition: "center 44%"
    },
    {
      src: "assets/images/wine-cheese.png",
      alt: "Botella Ciudad Evita con copa y tabla",
      className: "gallery-item-table",
      objectPosition: "center 56%"
    },
    {
      src: "assets/images/wine-asado-gourmet.png",
      alt: "Botella Ciudad Evita junto a una tabla de asado y una copa",
      className: "gallery-item-asado",
      objectPosition: "center 62%"
    }
  ]
};

const ADMIN_CREDENTIALS = {
  username: "Bodega1",
  password: "Fado2022*"
};

const STORAGE_KEY = "bodega-ciudad-evita-config";
const ADMIN_SESSION_KEY = "bodega-ciudad-evita-admin-session";
const SECRET_CLICK_TARGET = 5;
const SECRET_CLICK_WINDOW_MS = 4000;
const IMAGE_FALLBACK = "assets/images/logo-bodega.png";

const productGrid = document.querySelector("#productGrid");
const galleryGrid = document.querySelector("#galleryGrid");
const secretAdminTrigger = document.querySelector("#secretAdminTrigger");
const heroVarietalSummary = document.querySelector("#heroVarietalSummary");
const heroSelectionText = document.querySelector("#heroSelectionText");
const commercialSummary = document.querySelector("#commercialSummary");
const footerWhatsappTextLink = document.querySelector("#footerWhatsappTextLink");
const footerInstagramLink = document.querySelector("#footerInstagramLink");
const contactEmailLink = document.querySelector("#contactEmailLink");
const footerEmailLink = document.querySelector("#footerEmailLink");
const adminPortal = document.querySelector("#adminPortal");
const adminBackdrop = document.querySelector("#adminBackdrop");
const adminLoginView = document.querySelector("#adminLoginView");
const adminPanelView = document.querySelector("#adminPanelView");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLoginFeedback = document.querySelector("#adminLoginFeedback");
const adminStatus = document.querySelector("#adminStatus");
const adminProductList = document.querySelector("#adminProductList");
const adminWhatsappNumber = document.querySelector("#adminWhatsappNumber");
const adminInstagramUrl = document.querySelector("#adminInstagramUrl");
const adminContactEmail = document.querySelector("#adminContactEmail");
const adminDefaultWhatsappMessage = document.querySelector("#adminDefaultWhatsappMessage");
const adminWholesaleWhatsappMessage = document.querySelector("#adminWholesaleWhatsappMessage");

let storeConfig = loadStoreConfig();
let adminDraftConfig = cloneConfig(storeConfig);
let revealObserver = null;
let secretClickCount = 0;
let secretClickTimer = null;

function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createEmptyOption() {
  return {
    label: "Nueva opcion",
    price: "$0",
    message: "Hola, quiero consultar por esta presentacion de Bodega Ciudad Evita"
  };
}

function createEmptyProduct() {
  return {
    id: `producto-${Date.now()}`,
    name: "Nuevo producto",
    tag: "Etiqueta",
    accent: "Nueva linea",
    note: "Describe en una frase el perfil del producto.",
    description: "Completa aqui los detalles comerciales para este producto.",
    pairing: "Maridaje sugerido",
    profile: "Perfil del vino",
    image: IMAGE_FALLBACK,
    options: [createEmptyOption()]
  };
}

function sanitizeOption(option) {
  return {
    label: String(option?.label ?? "").trim() || "Opcion",
    price: String(option?.price ?? "").trim() || "$0",
    message: String(option?.message ?? "").trim() || DEFAULT_STORE_CONFIG.defaultWhatsappMessage
  };
}

function sanitizeProduct(product, index) {
  const name = String(product?.name ?? "").trim() || `Producto ${index + 1}`;
  const options = Array.isArray(product?.options) ? product.options.map(sanitizeOption) : [];

  return {
    id: String(product?.id ?? "").trim() || slugify(name) || `producto-${index + 1}`,
    name,
    tag: String(product?.tag ?? "").trim() || "Etiqueta",
    accent: String(product?.accent ?? "").trim() || "Linea especial",
    note: String(product?.note ?? "").trim() || "Perfil comercial del producto.",
    description:
      String(product?.description ?? "").trim() || "Agrega una descripcion para mostrar en la pagina.",
    pairing: String(product?.pairing ?? "").trim() || "Sugerencia de consumo",
    profile: String(product?.profile ?? "").trim() || "Perfil del vino",
    image: String(product?.image ?? "").trim() || IMAGE_FALLBACK,
    options
  };
}

function sanitizeGalleryImage(image) {
  return {
    src: String(image?.src ?? "").trim(),
    alt: String(image?.alt ?? "").trim(),
    className: String(image?.className ?? "").trim(),
    objectPosition: String(image?.objectPosition ?? "").trim() || "center center"
  };
}

function sanitizeConfig(config) {
  const savedWhatsappNumber = String(config?.whatsappNumber ?? "").replace(/\D/g, "");
  const savedInstagramUrl = String(config?.instagramUrl ?? "").trim();
  const legacyInstagramUrl = "https://www.instagram.com/bodegaciudadevita/";

  return {
    businessName: DEFAULT_STORE_CONFIG.businessName,
    whatsappNumber:
      !savedWhatsappNumber || ["5491100000000", "5491122334455"].includes(savedWhatsappNumber)
        ? DEFAULT_STORE_CONFIG.whatsappNumber
        : savedWhatsappNumber,
    instagramUrl:
      savedInstagramUrl === legacyInstagramUrl
        ? DEFAULT_STORE_CONFIG.instagramUrl
        : savedInstagramUrl || DEFAULT_STORE_CONFIG.instagramUrl,
    contactEmail: String(config?.contactEmail ?? "").trim() || DEFAULT_STORE_CONFIG.contactEmail,
    defaultWhatsappMessage:
      String(config?.defaultWhatsappMessage ?? "").trim() || DEFAULT_STORE_CONFIG.defaultWhatsappMessage,
    wholesaleWhatsappMessage:
      String(config?.wholesaleWhatsappMessage ?? "").trim() || DEFAULT_STORE_CONFIG.wholesaleWhatsappMessage,
    products: Array.isArray(config?.products) ? config.products.map(sanitizeProduct) : [],
    galleryImages: Array.isArray(config?.galleryImages)
      ? config.galleryImages.map(sanitizeGalleryImage)
      : cloneConfig(DEFAULT_STORE_CONFIG.galleryImages)
  };
}

function loadStoreConfig() {
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEY);

    if (!savedConfig) {
      return cloneConfig(DEFAULT_STORE_CONFIG);
    }

    return sanitizeConfig(JSON.parse(savedConfig));
  } catch (error) {
    console.warn("No se pudo cargar la configuracion guardada.", error);
    return cloneConfig(DEFAULT_STORE_CONFIG);
  }
}

function saveStoreConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storeConfig));
}

function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function setAdminAuthenticated(value) {
  if (value) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    return;
  }

  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function buildWhatsappUrl(message) {
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function formatList(items) {
  if (items.length <= 1) {
    return items[0] || "";
  }

  if (items.length === 2) {
    return `${items[0]} y ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function formatWhatsappDisplay(number) {
  if (!number) {
    return "+54 9";
  }

  return number.startsWith("+") ? number : `+${number}`;
}

function formatInstagramLabel(url) {
  try {
    const { pathname } = new URL(url);
    const handle = pathname.replace(/\//g, "").trim();
    return handle ? `Instagram: ${handle}` : "Instagram";
  } catch (error) {
    return "Instagram";
  }
}

function getVarietalSummary() {
  const productNames = storeConfig.products
    .map((product) => product.name.trim())
    .filter(Boolean);

  if (productNames.length === 0) {
    return "Seleccion en actualizacion";
  }

  return formatList(productNames);
}

function getHeroSelectionCopy() {
  if (storeConfig.products.length === 0) {
    return "La carta se esta actualizando. Consultanos por disponibilidad y proximos lanzamientos.";
  }

  const optionLabels = [
    ...new Set(
      storeConfig.products.flatMap((product) =>
        product.options.map((option) => option.label.trim()).filter(Boolean)
      )
    )
  ];

  if (optionLabels.length === 0) {
    return "Productos listos para consultas y atencion personalizada por WhatsApp.";
  }

  return `Presentaciones activas: ${formatList(optionLabels)}.`;
}

function getCommercialSummary() {
  const optionLabels = [
    ...new Set(
      storeConfig.products.flatMap((product) =>
        product.options.map((option) => option.label.trim()).filter(Boolean)
      )
    )
  ];

  if (optionLabels.length === 0) {
    return "Consultanos por presentaciones disponibles y propuestas para tu comercio.";
  }

  return `Presentaciones disponibles: ${formatList(optionLabels)}.`;
}

function applyStoreCopy() {
  const commonWhatsappUrl = buildWhatsappUrl(storeConfig.defaultWhatsappMessage);
  const wholesaleWhatsappUrl = buildWhatsappUrl(storeConfig.wholesaleWhatsappMessage);
  const whatsappLinkIds = ["#heroWhatsappLink", "#finalWhatsappLink", "#footerWhatsappTextLink"];

  whatsappLinkIds.forEach((selector) => {
    const link = document.querySelector(selector);

    if (!link) {
      return;
    }

    link.href = commonWhatsappUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  });

  const wholesaleLink = document.querySelector("#wholesaleWhatsappLink");

  if (wholesaleLink) {
    wholesaleLink.href = wholesaleWhatsappUrl;
    wholesaleLink.target = "_blank";
    wholesaleLink.rel = "noreferrer";
  }

  if (footerInstagramLink) {
    footerInstagramLink.href = storeConfig.instagramUrl;
    footerInstagramLink.target = "_blank";
    footerInstagramLink.rel = "noreferrer";
    footerInstagramLink.textContent = formatInstagramLabel(storeConfig.instagramUrl);
  }

  [contactEmailLink, footerEmailLink].forEach((link) => {
    if (!link) {
      return;
    }

    link.href = `mailto:${storeConfig.contactEmail}`;
    link.textContent = storeConfig.contactEmail;
  });

  if (footerWhatsappTextLink) {
    footerWhatsappTextLink.textContent = `WhatsApp: ${formatWhatsappDisplay(storeConfig.whatsappNumber)}`;
  }

  if (heroVarietalSummary) {
    heroVarietalSummary.textContent = getVarietalSummary();
  }

  if (heroSelectionText) {
    heroSelectionText.textContent = getHeroSelectionCopy();
  }

  if (commercialSummary) {
    commercialSummary.textContent = getCommercialSummary();
  }

  document.title = `${storeConfig.businessName} | Malbec y Cabernet Sauvignon`;

  const year = document.querySelector("#currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function renderProducts() {
  if (!productGrid) {
    return;
  }

  if (storeConfig.products.length === 0) {
    productGrid.innerHTML = `
      <article class="product-card reveal product-card-empty">
        <div class="product-body">
          <h3 class="product-name">Catalogo en actualizacion</h3>
          <p class="product-description">
            El panel admin esta activo pero todavia no hay productos publicados. Agrega uno desde el acceso privado.
          </p>
        </div>
      </article>
    `;
    return;
  }

  const cardsMarkup = storeConfig.products
    .map((product) => {
      const optionsMarkup =
        product.options.length > 0
          ? product.options
              .map((option) => {
                const message =
                  option.message ||
                  `Hola, quiero consultar por ${product.name} de ${storeConfig.businessName}`;

                return `
                  <div class="product-option">
                    <div class="product-option-copy">
                      <span>${escapeHtml(option.label)}</span>
                      <strong>${escapeHtml(option.price)}</strong>
                    </div>

                    <a
                      class="button button-secondary"
                      href="${escapeHtml(buildWhatsappUrl(message))}"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pedir
                    </a>
                  </div>
                `;
              })
              .join("")
          : `
            <a
              class="button button-secondary"
              href="${escapeHtml(buildWhatsappUrl(`Hola, quiero consultar por ${product.name} de ${storeConfig.businessName}`))}"
              target="_blank"
              rel="noreferrer"
            >
              Consultar
            </a>
          `;

      return `
        <article class="product-card reveal" aria-label="${escapeHtml(product.name)}">
          <div class="product-image-frame">
            <img
              class="product-image"
              src="${escapeHtml(product.image || IMAGE_FALLBACK)}"
              alt="${escapeHtml(product.name)}"
              loading="lazy"
            />
          </div>

          <div class="product-body">
            <div class="product-card-top">
              <span class="product-tag">${escapeHtml(product.tag)}</span>
              <span class="product-id">${escapeHtml(product.accent)}</span>
            </div>

            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <p class="product-note">${escapeHtml(product.note)}</p>
            <p class="product-description">${escapeHtml(product.description)}</p>

            <div class="product-meta">
              <div class="product-meta-item">
                <span>Ideal para</span>
                <strong>${escapeHtml(product.pairing)}</strong>
              </div>
              <div class="product-meta-item">
                <span>Perfil</span>
                <strong>${escapeHtml(product.profile)}</strong>
              </div>
            </div>

            <div class="product-options">
              ${optionsMarkup}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  productGrid.innerHTML = cardsMarkup;
}

function renderGallery() {
  if (!galleryGrid) {
    return;
  }

  const galleryMarkup = storeConfig.galleryImages
    .map(
      (image) => `
        <figure class="gallery-item ${escapeHtml(image.className || "")} reveal">
          <img
            src="${escapeHtml(image.src)}"
            alt="${escapeHtml(image.alt)}"
            loading="lazy"
            style="object-position: ${escapeHtml(image.objectPosition || "center center")};"
          />
        </figure>
      `
    )
    .join("");

  galleryGrid.innerHTML = galleryMarkup;
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal:not([data-reveal-bound])");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
      item.dataset.revealBound = "true";
    });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
  }

  revealItems.forEach((item) => {
    item.dataset.revealBound = "true";
    revealObserver.observe(item);
  });
}

function renderSite() {
  applyStoreCopy();
  renderProducts();
  renderGallery();
  setupRevealAnimations();
}

function openAdminPortal() {
  if (!adminPortal) {
    return;
  }

  adminPortal.hidden = false;
  document.body.classList.add("admin-open");

  if (isAdminAuthenticated()) {
    showAdminPanel();
    return;
  }

  showAdminLogin();
}

function closeAdminPortal() {
  if (!adminPortal) {
    return;
  }

  adminPortal.hidden = true;
  document.body.classList.remove("admin-open");
  clearAdminMessages();
}

function clearAdminMessages() {
  if (adminLoginFeedback) {
    adminLoginFeedback.textContent = "";
  }

  if (adminStatus) {
    adminStatus.textContent = "";
  }
}

function showAdminLogin() {
  clearAdminMessages();

  if (adminLoginView) {
    adminLoginView.hidden = false;
  }

  if (adminPanelView) {
    adminPanelView.hidden = true;
  }

  if (adminLoginForm) {
    adminLoginForm.reset();
  }

  const usernameField = document.querySelector("#adminUsername");

  if (usernameField) {
    usernameField.focus();
  }
}

function showAdminPanel() {
  clearAdminMessages();
  adminDraftConfig = cloneConfig(storeConfig);
  renderAdminPanel();

  if (adminLoginView) {
    adminLoginView.hidden = true;
  }

  if (adminPanelView) {
    adminPanelView.hidden = false;
  }
}

function renderAdminPanel() {
  if (!adminPanelView) {
    return;
  }

  if (adminWhatsappNumber) {
    adminWhatsappNumber.value = adminDraftConfig.whatsappNumber;
  }

  if (adminInstagramUrl) {
    adminInstagramUrl.value = adminDraftConfig.instagramUrl;
  }

  if (adminContactEmail) {
    adminContactEmail.value = adminDraftConfig.contactEmail;
  }

  if (adminDefaultWhatsappMessage) {
    adminDefaultWhatsappMessage.value = adminDraftConfig.defaultWhatsappMessage;
  }

  if (adminWholesaleWhatsappMessage) {
    adminWholesaleWhatsappMessage.value = adminDraftConfig.wholesaleWhatsappMessage;
  }

  if (!adminProductList) {
    return;
  }

  if (adminDraftConfig.products.length === 0) {
    adminProductList.innerHTML = `
      <article class="admin-empty-state">
        <h4>Sin productos publicados</h4>
        <p>Usa "Agregar producto" para cargar el primer item del catalogo.</p>
      </article>
    `;
    return;
  }

  adminProductList.innerHTML = adminDraftConfig.products
    .map((product, productIndex) => {
      const optionsMarkup =
        product.options.length > 0
          ? product.options
              .map(
                (option, optionIndex) => `
                  <div class="admin-option-card" data-option-index="${productIndex}-${optionIndex}">
                    <div class="admin-option-grid">
                      <label>
                        Nombre de opcion
                        <input
                          data-field="label"
                          data-scope="option"
                          data-product-index="${productIndex}"
                          data-option-index="${optionIndex}"
                          type="text"
                          value="${escapeHtml(option.label)}"
                        />
                      </label>

                      <label>
                        Precio
                        <input
                          data-field="price"
                          data-scope="option"
                          data-product-index="${productIndex}"
                          data-option-index="${optionIndex}"
                          type="text"
                          value="${escapeHtml(option.price)}"
                        />
                      </label>

                      <label class="admin-field-wide">
                        Mensaje de WhatsApp
                        <textarea
                          data-field="message"
                          data-scope="option"
                          data-product-index="${productIndex}"
                          data-option-index="${optionIndex}"
                          rows="2"
                        >${escapeHtml(option.message)}</textarea>
                      </label>
                    </div>

                    <button
                      class="admin-link-button"
                      data-action="remove-option"
                      data-product-index="${productIndex}"
                      data-option-index="${optionIndex}"
                      type="button"
                    >
                      Eliminar opcion
                    </button>
                  </div>
                `
              )
              .join("")
          : `
            <p class="admin-empty-options">Este producto aun no tiene opciones de venta cargadas.</p>
          `;

      return `
        <article class="admin-product-card" data-product-index="${productIndex}">
          <div class="admin-product-head">
            <div>
              <p class="admin-kicker">Producto ${productIndex + 1}</p>
              <h4>${escapeHtml(product.name)}</h4>
            </div>

            <button
              class="admin-link-button admin-link-button-danger"
              data-action="remove-product"
              data-product-index="${productIndex}"
              type="button"
            >
              Eliminar producto
            </button>
          </div>

          <div class="admin-product-grid">
            <label>
              Nombre
              <input
                data-field="name"
                data-scope="product"
                data-product-index="${productIndex}"
                type="text"
                value="${escapeHtml(product.name)}"
              />
            </label>

            <label>
              Tag
              <input
                data-field="tag"
                data-scope="product"
                data-product-index="${productIndex}"
                type="text"
                value="${escapeHtml(product.tag)}"
              />
            </label>

            <label>
              Copete
              <input
                data-field="accent"
                data-scope="product"
                data-product-index="${productIndex}"
                type="text"
                value="${escapeHtml(product.accent)}"
              />
            </label>

            <label>
              Perfil
              <input
                data-field="profile"
                data-scope="product"
                data-product-index="${productIndex}"
                type="text"
                value="${escapeHtml(product.profile)}"
              />
            </label>

            <label class="admin-field-wide">
              Resumen corto
              <input
                data-field="note"
                data-scope="product"
                data-product-index="${productIndex}"
                type="text"
                value="${escapeHtml(product.note)}"
              />
            </label>

            <label class="admin-field-wide">
              Descripcion
              <textarea
                data-field="description"
                data-scope="product"
                data-product-index="${productIndex}"
                rows="3"
              >${escapeHtml(product.description)}</textarea>
            </label>

            <label>
              Maridaje
              <input
                data-field="pairing"
                data-scope="product"
                data-product-index="${productIndex}"
                type="text"
                value="${escapeHtml(product.pairing)}"
              />
            </label>

            <label class="admin-field-wide">
              Imagen
              <input
                data-field="image"
                data-scope="product"
                data-product-index="${productIndex}"
                type="text"
                value="${escapeHtml(product.image)}"
              />
            </label>
          </div>

          <div class="admin-options-wrap">
            <div class="admin-section-head admin-section-head-tight">
              <div>
                <p class="admin-kicker">Opciones de venta</p>
                <h5>Precios y mensajes</h5>
              </div>

              <button
                class="button button-secondary admin-small-button"
                data-action="add-option"
                data-product-index="${productIndex}"
                type="button"
              >
                Agregar opcion
              </button>
            </div>

            ${optionsMarkup}
          </div>
        </article>
      `;
    })
    .join("");
}

function collectAdminDraftFromDom() {
  if (!adminPanelView || adminPanelView.hidden) {
    return cloneConfig(adminDraftConfig);
  }

  const draft = {
    ...cloneConfig(adminDraftConfig),
    whatsappNumber: adminWhatsappNumber?.value ?? adminDraftConfig.whatsappNumber,
    instagramUrl: adminInstagramUrl?.value ?? adminDraftConfig.instagramUrl,
    contactEmail: adminContactEmail?.value ?? adminDraftConfig.contactEmail,
    defaultWhatsappMessage: adminDefaultWhatsappMessage?.value ?? adminDraftConfig.defaultWhatsappMessage,
    wholesaleWhatsappMessage:
      adminWholesaleWhatsappMessage?.value ?? adminDraftConfig.wholesaleWhatsappMessage,
    products: []
  };

  const productCards = adminProductList ? Array.from(adminProductList.querySelectorAll(".admin-product-card")) : [];

  draft.products = productCards.map((card, productIndex) => {
    const readProductField = (field) =>
      card.querySelector(`[data-scope="product"][data-field="${field}"]`)?.value ?? "";

    const optionCards = Array.from(card.querySelectorAll(".admin-option-card"));
    const options = optionCards.map((optionCard) => ({
      label: optionCard.querySelector('[data-scope="option"][data-field="label"]')?.value ?? "",
      price: optionCard.querySelector('[data-scope="option"][data-field="price"]')?.value ?? "",
      message: optionCard.querySelector('[data-scope="option"][data-field="message"]')?.value ?? ""
    }));

    return sanitizeProduct(
      {
        id: draft.products?.[productIndex]?.id ?? adminDraftConfig.products?.[productIndex]?.id,
        name: readProductField("name"),
        tag: readProductField("tag"),
        accent: readProductField("accent"),
        note: readProductField("note"),
        description: readProductField("description"),
        pairing: readProductField("pairing"),
        profile: readProductField("profile"),
        image: readProductField("image"),
        options
      },
      productIndex
    );
  });

  return sanitizeConfig(draft);
}

function setAdminStatus(message) {
  if (adminStatus) {
    adminStatus.textContent = message;
  }
}

function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    setAdminAuthenticated(true);
    showAdminPanel();
    return;
  }

  if (adminLoginFeedback) {
    adminLoginFeedback.textContent = "Usuario o clave incorrectos.";
  }
}

function handleAdminActions(event) {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  adminDraftConfig = collectAdminDraftFromDom();

  const action = actionButton.dataset.action;
  const productIndex = Number(actionButton.dataset.productIndex);
  const optionIndex = Number(actionButton.dataset.optionIndex);

  if (action === "add-option" && Number.isInteger(productIndex)) {
    adminDraftConfig.products[productIndex].options.push(createEmptyOption());
    renderAdminPanel();
    setAdminStatus("Se agrego una nueva opcion al producto.");
    return;
  }

  if (action === "remove-option" && Number.isInteger(productIndex) && Number.isInteger(optionIndex)) {
    adminDraftConfig.products[productIndex].options.splice(optionIndex, 1);
    renderAdminPanel();
    setAdminStatus("La opcion fue eliminada.");
    return;
  }

  if (action === "remove-product" && Number.isInteger(productIndex)) {
    adminDraftConfig.products.splice(productIndex, 1);
    renderAdminPanel();
    setAdminStatus("El producto fue eliminado.");
  }
}

function handleAddProduct() {
  adminDraftConfig = collectAdminDraftFromDom();
  adminDraftConfig.products.push(createEmptyProduct());
  renderAdminPanel();
  setAdminStatus("Producto nuevo listo para completar.");
}

function handleSaveChanges() {
  adminDraftConfig = collectAdminDraftFromDom();
  storeConfig = sanitizeConfig(adminDraftConfig);
  saveStoreConfig();
  renderSite();
  renderAdminPanel();
  setAdminStatus("Cambios guardados correctamente.");
}

function handleRestoreDefaults() {
  const shouldRestore = window.confirm(
    "Se van a restaurar los datos originales de la pagina guardados en este navegador. Queres continuar?"
  );

  if (!shouldRestore) {
    return;
  }

  storeConfig = cloneConfig(DEFAULT_STORE_CONFIG);
  adminDraftConfig = cloneConfig(DEFAULT_STORE_CONFIG);
  localStorage.removeItem(STORAGE_KEY);
  renderSite();
  renderAdminPanel();
  setAdminStatus("Se restauro la configuracion original.");
}

function handleLogout() {
  setAdminAuthenticated(false);
  closeAdminPortal();
}

function resetSecretClicks() {
  secretClickCount = 0;

  if (secretClickTimer) {
    window.clearTimeout(secretClickTimer);
    secretClickTimer = null;
  }
}

function registerSecretClick() {
  secretClickCount += 1;

  if (secretClickTimer) {
    window.clearTimeout(secretClickTimer);
  }

  secretClickTimer = window.setTimeout(resetSecretClicks, SECRET_CLICK_WINDOW_MS);

  if (secretClickCount >= SECRET_CLICK_TARGET) {
    resetSecretClicks();
    openAdminPortal();
  }
}

function bindAdminEvents() {
  if (secretAdminTrigger) {
    secretAdminTrigger.addEventListener("click", registerSecretClick);
    secretAdminTrigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        registerSecretClick();
      }
    });
  }

  adminBackdrop?.addEventListener("click", closeAdminPortal);
  document.querySelector("#adminCloseLogin")?.addEventListener("click", closeAdminPortal);
  document.querySelector("#adminClosePanel")?.addEventListener("click", closeAdminPortal);
  document.querySelector("#adminLogout")?.addEventListener("click", handleLogout);
  document.querySelector("#adminAddProduct")?.addEventListener("click", handleAddProduct);
  document.querySelector("#adminSaveChanges")?.addEventListener("click", handleSaveChanges);
  document.querySelector("#adminRestoreDefaults")?.addEventListener("click", handleRestoreDefaults);
  adminLoginForm?.addEventListener("submit", handleLogin);
  adminProductList?.addEventListener("click", handleAdminActions);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && adminPortal && !adminPortal.hidden) {
      closeAdminPortal();
    }
  });
}

function init() {
  renderSite();
  bindAdminEvents();
}

init();
