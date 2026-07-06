// Punto unico de edicion para datos comerciales, imagenes y enlaces.
const STORE_CONFIG = {
  businessName: "Bodega Ciudad Evita",
  whatsappNumber: "5491100000000",
  instagramUrl: "https://www.instagram.com/bodegaciudadevita/",
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
      src: "assets/images/wine-cheese.png",
      alt: "Botella Ciudad Evita con copa y tabla",
      className: "gallery-item-feature",
      objectPosition: "center 58%"
    },
    {
      src: "assets/images/wine-label-detail.png",
      alt: "Detalle de la etiqueta del vino Ciudad Evita",
      className: "gallery-item-detail",
      objectPosition: "center center"
    },
    {
      src: "assets/images/malbec-wood-dark.png",
      alt: "Botella Ciudad Evita en una escena oscura y editorial",
      className: "gallery-item-portrait",
      objectPosition: "center 60%"
    },
    {
      src: "assets/images/wine-asado-closeup.png",
      alt: "Botella Ciudad Evita con copa frente al asador",
      className: "gallery-item-wide",
      objectPosition: "center 52%"
    },
    {
      src: "assets/images/wine-rack.png",
      alt: "Botellas Ciudad Evita en una cava",
      className: "gallery-item-cellar",
      objectPosition: "center 46%"
    }
  ]
};

const productGrid = document.querySelector("#productGrid");
const galleryGrid = document.querySelector("#galleryGrid");

function buildWhatsappUrl(message) {
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function setGlobalLinks() {
  const commonWhatsappUrl = buildWhatsappUrl(STORE_CONFIG.defaultWhatsappMessage);
  const wholesaleWhatsappUrl = buildWhatsappUrl(STORE_CONFIG.wholesaleWhatsappMessage);
  const whatsappLinkIds = [
    "#heroWhatsappLink",
    "#finalWhatsappLink",
    "#footerWhatsappTextLink"
  ];

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

  const instagramLink = document.querySelector("#footerInstagramLink");

  if (instagramLink) {
    instagramLink.href = STORE_CONFIG.instagramUrl;
    instagramLink.target = "_blank";
    instagramLink.rel = "noreferrer";
  }

  document.title = `${STORE_CONFIG.businessName} | Malbec y Cabernet Sauvignon`;

  const year = document.querySelector("#currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function renderProducts() {
  if (!productGrid) {
    return;
  }

  const cardsMarkup = STORE_CONFIG.products
    .map((product) => {
      const optionsMarkup = product.options
        .map(
          (option) => `
            <div class="product-option">
              <div class="product-option-copy">
                <span>${option.label}</span>
                <strong>${option.price}</strong>
              </div>

              <a
                class="button button-secondary"
                href="${buildWhatsappUrl(option.message)}"
                target="_blank"
                rel="noreferrer"
              >
                Pedir
              </a>
            </div>
          `
        )
        .join("");

      return `
        <article class="product-card reveal" aria-label="${product.name}">
          <div class="product-image-frame">
            <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>

          <div class="product-body">
            <div class="product-card-top">
              <span class="product-tag">${product.tag}</span>
              <span class="product-id">${product.accent}</span>
            </div>

            <h3 class="product-name">${product.name}</h3>
            <p class="product-note">${product.note}</p>
            <p class="product-description">${product.description}</p>

            <div class="product-meta">
              <div class="product-meta-item">
                <span>Ideal para</span>
                <strong>${product.pairing}</strong>
              </div>
              <div class="product-meta-item">
                <span>Perfil</span>
                <strong>${product.profile}</strong>
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

  const galleryMarkup = STORE_CONFIG.galleryImages
    .map(
      (image) => `
        <figure class="gallery-item ${image.className || ""} reveal">
          <img
            src="${image.src}"
            alt="${image.alt}"
            loading="lazy"
            style="object-position: ${image.objectPosition || "center center"};"
          />
        </figure>
      `
    )
    .join("");

  galleryGrid.innerHTML = galleryMarkup;
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function init() {
  setGlobalLinks();
  renderProducts();
  renderGallery();
  setupRevealAnimations();
}

init();
