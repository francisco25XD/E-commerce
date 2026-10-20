import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Seed = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  price: number;
  compare?: number;
  discount?: number;
  rating?: number;
  flags: { isFlash?: boolean; isNew?: boolean; isFavorite?: boolean };
  category: string;
  variantLabel?: string;
  variants?: [string, number][];
  // Solo para páginas de categoría
  catalogName?: string;
  catalogTag?: string;
  catalogDescription?: string;
  perk?: string;
  perkIcon?: string;
};

const cents = (n: number) => Math.round(n * 100);

const products: Seed[] = [
  // ---- Ofertas flash
  {
    slug: "ramo-silvestre-amanecer", name: "Ramo Silvestre Amanecer", tag: "SILVESTRE & CAMPESTRE",
    description: "Limonium morado, manzanilla silvestre, espigas secas de cereal riojano y brotes de eucalipto aromático.",
    price: 47.6, compare: 68, discount: 30, rating: 4.9, flags: { isFlash: true }, category: "ramos",
    variantLabel: "Tamaño", variants: [["Estándar", 0], ["Deluxe", 12], ["Premium", 25]],
  },
  {
    slug: "caja-lujo-24-rosas-melocoton", name: "Caja de Lujo 24 Rosas Melocotón", tag: "CAJA BOTÁNICA",
    description: "Rosas 'Shimmer' y tonos albaricoque en caja rígida forrada en lino verde oliva con lazo de seda orgánica.",
    price: 71.25, compare: 95, discount: 25, rating: 5.0, flags: { isFlash: true }, category: "rosas",
    variantLabel: "Tamaño", variants: [["12 Rosas", -30], ["24 Rosas", 0], ["36 Rosas", 35]],
  },
  {
    slug: "phalaenopsis-doble-tallo", name: "Phalaenopsis Doble Tallo", tag: "ORQUÍDEAS VIVAS",
    description: "Orquídea blanca en maceta cerámica, lista para decorar.",
    price: 88, compare: 110, discount: 20, rating: 4.96, flags: { isFlash: true }, category: "arreglos-florales",
    variantLabel: "Presentación", variants: [["1 Tallo", -25], ["2 Tallos", 0], ["4 Tallos", 60]],
    catalogTag: "ORQUÍDEAS VIVAS EN GRES",
    catalogDescription: "Ejemplar botánico de dos varas en macetero de arcilla natural esmaltada al fuego, con lecho de guijarros de río y musgo silvestre.",
  },
  {
    slug: "peonias-rosadas", name: "Peonías Rosadas", tag: "PEONÍAS",
    description: "Peonías de temporada en tonos rosa pálido.",
    price: 55.25, compare: 85, discount: 35, rating: 4.8, flags: { isFlash: true }, category: "ramos",
    variantLabel: "Tamaño", variants: [["Estándar", 0], ["Deluxe", 15], ["Premium", 30]],
  },
  // ---- Recién llegados
  {
    slug: "bouquet-toscana-girasoles", name: "Bouquet Toscana de Girasoles", tag: "GIRASOLES & LIMONIUM",
    description: "Girasoles enanos recolectados en La Rioja Alta, limonium morado, espigas secas y follaje de olivo.",
    price: 52, rating: 4.8, flags: { isNew: true }, category: "ramos",
  },
  {
    slug: "tulipanes-blancos-olivo", name: "Tulipanes Blancos & Olivo", tag: "TULIPANES & OLIVO",
    description: "20 tulipanes holandeses de bulbo puro y ramaje fresco de olivo toscano.",
    price: 59, flags: { isNew: true }, category: "ramos",
  },
  {
    slug: "cesta-rustica-silvestre", name: "Cesta Rústica Silvestre", tag: "FLORES DE CAMPO & LAVANDA",
    description: "Manzanilla provenzal, lavanda cosechada en Cameros, ranúnculos dorados y cesta artesanal de mimbre tejido.",
    price: 64, rating: 5.0, flags: { isNew: true }, category: "ramos",
  },
  {
    slug: "centro-velas-rosas-crema", name: "Centro Velas & Rosas Crema", tag: "ROSAS CREMA & VELAS DE CERA",
    description: "Rosas crema David Austin, dos cirios botánicos aromáticos y follaje plateado.",
    price: 78, rating: 5.0, flags: { isNew: true }, category: "arreglos-florales",
    catalogTag: "CENTRO DE MESA SENSORIAL",
    catalogDescription: "Rosas crema David Austin, dos cirios botánicos de cera de soja pura y follaje aromático montados en peana de piedra pulida.",
    perk: "2 Cirios botánicos incl.", perkIcon: "flame",
  },
  // ---- Favoritos
  {
    slug: "50-rosas-grand-prix", name: "50 Rosas 'Grand Prix'", tag: "COLECCIÓN PASIÓN",
    description: "Tallos extra largos seleccionados de 70cm.",
    price: 125, rating: 4.95, flags: { isFavorite: true }, category: "rosas",
    catalogName: "50 Rosas 'Grand Prix' de 70cm",
    catalogDescription: "Selección de tallo extra largo importado de los Andes ecuatorianos. Pétalos aterciopelados de rojo profundo, envueltos en papel verde esmeralda.",
  },
  {
    slug: "jardin-ingles-en-jarron", name: "Jardín Inglés en Jarrón", tag: "ARREGLOS FLORALES",
    description: "Incluye jarrón pesado de cristal soplado.",
    price: 89, rating: 4.92, flags: { isFavorite: true }, category: "arreglos-florales",
    catalogTag: "JARRÓN DE CRISTAL ALTO",
    catalogDescription: "Incluye jarrón pesado de cristal soplado estriado. Compuesto por rosas de jardín, espigas silvestres y lavanda riojana.",
    perk: "Dedicatoria caligráfica gratis", perkIcon: "pen",
  },
  {
    slug: "pastel-dulce-encanto", name: "Pastel Dulce Encanto", tag: "LIRIOS & LISIANTHUS",
    description: "Lirios orientales perfumados, lisianthus crema, rosas de jardín melocotón y eucalipto cinéreo.",
    price: 62, rating: 4.88, flags: { isFavorite: true }, category: "ramos",
  },
  // ---- Solo en la página Rosas
  {
    slug: "bouquet-18-rosas-garden-juliet", name: "Bouquet 18 Rosas 'Garden Juliet'", tag: "ROSAS DE JARDÍN",
    description: "La emblemática rosa inglesa de cálido tono albaricoque, conocida por su apertura en copa perfecta y su fragancia a té y fruta fresca.",
    price: 86, rating: 4.96, flags: {}, category: "rosas",
    perk: "Alta fragancia",
  },
  {
    slug: "sombrerera-blancas-avalanche", name: "Sombrerera Blancas 'Avalanche'", tag: "SOMBRERERA DE AUTOR",
    description: "Rosas de gran calibre y color blanco marfil con toques verdosos en cáliz, presentadas en sombrerera de terciopelo verde con lazo de seda.",
    price: 92, rating: 4.92, flags: {}, category: "rosas",
  },
  {
    slug: "rosas-silvestres-ranunculos", name: "Rosas Silvestres & Ranúnculos", tag: "COMPOSICIÓN SILVESTRE",
    description: "Diálogo poético entre mini-rosas de té en color empolvado, ranúnculos italianos cloni y follaje silvestre de jardín.",
    price: 68, rating: 4.89, flags: {}, category: "rosas",
  },
  // ---- Solo en la página Arreglos Florales
  {
    slug: "jardin-silvestre-en-urna", name: "Jardín Silvestre en Urna", tag: "ALFARERÍA TRADICIONAL",
    description: "Flores de temporada seleccionadas al alba, eucalipto aromático y lavanda riojana presentados en vasija de barro de Navarrete.",
    price: 94, rating: 4.89, flags: {}, category: "arreglos-florales",
    perk: "Arcilla cocida artesanal", perkIcon: "clay",
  },
  {
    slug: "ikebana-contemporanea", name: "Ikebana Contemporánea", tag: "LÍNEA ZEN & MINIMALISMO",
    description: "Ramas leñosas de ciruelo silvestre combinadas con orquídeas blancas en plato bajo de gres y base kenzan oculta de latón.",
    price: 76, rating: 4.95, flags: {}, category: "arreglos-florales",
    perk: "Plato kenzan incluido", perkIcon: "kenzan",
  },
  {
    slug: "cesta-citrica-olivo", name: "Cesta Cítrica & Olivo", tag: "CESTERÍA DE MIMBRE",
    description: "Flores campestres con ramas de olivo del Valle del Cidacos, manzanilla y detalles botánicos deshidratados con fragancia cítrica.",
    price: 82, rating: 4.91, flags: {}, category: "arreglos-florales",
    perk: "Cesta artesana tejida a mano", perkIcon: "basket",
  },
  // ---- Solo en la página Ramos
  {
    slug: "bouquet-lavanda-olivo-imperial", name: "Bouquet Lavanda & Olivo Imperial", tag: "CAMPOS DE LA RIOJA",
    description: "Espigas de lavanda de monte riojano, follaje de olivo centenario, flor de cera y statice blanco.",
    price: 58, rating: 4.95, flags: {}, category: "ramos",
  },
  {
    slug: "ramo-hortensias-del-norte", name: "Ramo Hortensias del Norte", tag: "HORTENSIAS & EUCALIPTO",
    description: "Hortensias azules de gran porte, brotes de cardo eryngium, flor blanca y follaje salvaje de robledal.",
    price: 69, rating: 4.92, flags: {}, category: "ramos",
  },
  {
    slug: "cupula-eterna-encantada", name: "Cúpula Eterna Encantada", tag: "ROSA PRESERVADA",
    description: "Rosa natural 100% preservada de Ecuador.",
    price: 79, rating: 4.98, flags: { isFavorite: true }, category: "rosas",
    catalogDescription: "Rosa natural 100% liofilizada de Ecuador en campana de cristal soplado sobre peana de madera de nogal.",
  },
];

async function main() {
  const existingCount = await prisma.productos.count();
  if (existingCount > 0) {
    console.log(`Base de datos ya contiene ${existingCount} productos. Omitiendo seed.`);
    return;
  }

  const cats = [
    ["ramos", "Ramos"],
    ["arreglos-florales", "Arreglos Florales"],
    ["rosas", "Rosas"],
    ["coronas-funebres", "Coronas Fúnebres"],
    ["eventos", "Eventos"],
  ];

  const catIds: Record<string, number> = {};
  for (const [slug, nombre] of cats) {
    const existing = await prisma.categorias.findUnique({ where: { slug } });
    if (existing) {
      catIds[slug] = existing.id;
    } else {
      const c = await prisma.categorias.create({ data: { slug, nombre } });
      catIds[slug] = c.id;
    }
  }

  let index = 1;
  for (const p of products) {
    const sku = `PRD-${String(index++).padStart(3, "0")}`;
    const prod = await prisma.productos.create({
      data: {
        sku,
        slug: p.slug,
        nombre: p.name,
        etiqueta: p.tag,
        descripcion: p.description,
        precio: p.price,
        precio_anterior: p.compare ?? null,
        descuento_pct: p.discount ?? null,
        valoracion: p.rating ?? null,
        es_oferta_flash: !!p.flags.isFlash,
        es_nuevo: !!p.flags.isNew,
        es_favorito: !!p.flags.isFavorite,
        titulo_variante: p.variantLabel ?? null,
        nombre_catalogo: p.catalogName ?? null,
        etiqueta_catalogo: p.catalogTag ?? null,
        descripcion_catalogo: p.catalogDescription ?? null,
        detalle_extra: p.perk ?? null,
        icono_extra: p.perkIcon ?? null,
        categoria_id: catIds[p.category],
      },
    });

    await prisma.producto_imagenes.create({
      data: {
        producto_id: prod.id,
        url: `/products/${p.slug}.jpg`,
        texto_alt: p.name,
        es_principal: true,
        orden: 1,
      },
    });

    if (p.variants) {
      let vOrder = 1;
      for (const [label, extra] of p.variants) {
        await prisma.producto_variantes.create({
          data: {
            producto_id: prod.id,
            etiqueta: label,
            extra_precio: extra,
            es_predeterminada: extra === 0,
            orden: vOrder++,
          },
        });
      }
    }
  }
  console.log(`Seed OK: ${products.length} productos insertados.`);
}

main().finally(() => prisma.$disconnect());
