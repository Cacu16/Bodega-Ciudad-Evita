# Bodega Ciudad Evita

Landing page profesional, responsive y lista para editar para la marca **Bodega Ciudad Evita**.

## Estructura del proyecto

```text
Bodega Ciudad Evita/
|-- index.html
|-- README.md
`-- assets/
    |-- css/
    |   `-- styles.css
    |-- js/
    |   `-- app.js
    `-- images/
        |-- logo-bodega.png
        |-- malbec-branches.png
        |-- cabernet-candle.png
        |-- wine-pour-dinner.png
        |-- wine-pour-friends.png
        |-- wine-rack.png
        |-- wine-cheese.png
        |-- wine-label-detail.png
        |-- wine-asado-closeup.png
        |-- wine-fireplace.png
        `-- wine-asado-gourmet.png
```

## Como ejecutarlo localmente

Tenes dos opciones simples:

1. Abrir `index.html` directamente en el navegador.
2. Levantar un servidor local desde esta carpeta.

Con Python:

```bash
python -m http.server 5500
```

Despues abri:

```text
http://localhost:5500
```

## Donde editar lo importante

### WhatsApp, Instagram, productos, precios e imagenes

Todo eso se cambia en `assets/js/app.js`, dentro de la constante:

```js
const STORE_CONFIG = {
  whatsappNumber: "5491100000000",
  instagramUrl: "https://www.instagram.com/bodegaciudadevita/",
  defaultWhatsappMessage: "Hola, quiero hacer un pedido de Bodega Ciudad Evita",
  wholesaleWhatsappMessage: "Hola, quiero consultar precios mayoristas de Bodega Ciudad Evita",
  products: [
    {
      name: "Malbec",
      category: "Unitario",
      note: "Botella individual",
      pairing: "Carnes, picadas y fuegos",
      origin: "Publicacion unitaria",
      price: "$5.300",
      image: "assets/images/malbec-branches.png"
    }
  ],
  galleryImages: [
    {
      src: "assets/images/wine-cheese.png"
    }
  ]
};
```

### Cambiar textos generales

- Hero, secciones, testimonios y footer: `index.html`
- Estilo visual, colores, espaciados y responsive: `assets/css/styles.css`

## Agregar mas productos

Dentro de `STORE_CONFIG.products`, agrega un nuevo objeto con esta forma:

```js
{
  id: "nuevo-vino",
  name: "Nombre del vino",
  tag: "Etiqueta",
  accent: "Momento de consumo",
  note: "Bajada corta del producto",
  description: "Descripcion breve",
  pairing: "Momento o maridaje sugerido",
  profile: "Perfil del vino",
  image: "assets/images/mi-imagen.jpg",
  options: [
    {
      label: "Botella individual",
      price: "$00.000",
      message: "Hola, quiero pedir Nombre del vino en botella individual de Bodega Ciudad Evita"
    },
    {
      label: "Caja x6",
      price: "$00.000",
      message: "Hola, quiero pedir Nombre del vino en caja x6 de Bodega Ciudad Evita"
    }
  ]
}
```

Cada card se renderiza automaticamente y cada opcion genera su propio mensaje de WhatsApp.

## Reemplazar imagenes

1. Copia tus fotos dentro de `assets/images/`.
2. Actualiza las rutas en `assets/js/app.js`.
3. Si queres, podes borrar luego los SVG de ejemplo.

El logo del tanque que usa la web esta en:

```text
assets/images/logo-bodega.png
```

Formatos recomendados:

- `.jpg` o `.webp` para fotos reales
- ancho recomendado: entre `1200px` y `1800px`
- peso ideal: menos de `400 KB` por imagen cuando sea posible

## SEO basico incluido

El proyecto ya incluye:

- `<title>`
- `<meta name="description">`
- headings ordenados
- etiquetas semanticas
- estructura clara para indexacion

## Notas

- Los botones de WhatsApp usan `https://wa.me/`.
- El mensaje cambia automaticamente en los productos para incluir el nombre seleccionado.
- Las animaciones de scroll usan `IntersectionObserver`.
