import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^\w-]+/g, "") // remove non-word chars
    .replace(/--+/g, "-"); // replace multiple - with single -
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const products = await prisma.productos.findMany({
    include: {
      categorias: true,
      producto_imagenes: { orderBy: [{ es_principal: "desc" }, { orden: "asc" }] },
      producto_variantes: { orderBy: { orden: "asc" } },
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      nombre,
      categoria_id,
      descripcion,
      stock,
      imagen,
      precio,
      precio_anterior,
      descuento_pct,
      etiqueta,
      titulo_variante,
      es_oferta_flash,
      es_nuevo,
      es_favorito,
      has_unit_pricing,
      precios_unidades,
    } = body;

    if (!nombre || !categoria_id || !descripcion) {
      return NextResponse.json(
        { error: "Nombre, categoría y descripción son obligatorios" },
        { status: 400 }
      );
    }

    // Generar slug único
    let baseSlug = slugify(nombre);
    if (!baseSlug) baseSlug = "producto";
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.productos.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Generar SKU único
    const countTotal = await prisma.productos.count();
    const sku = `PROD-${String(countTotal + 1).padStart(3, "0")}-${Date.now().toString().slice(-4)}`;

    let numPrecio = Number(precio) > 0 ? Number(precio) : 45.0;
    const numStock = stock !== undefined && stock !== null && stock !== "" ? parseInt(String(stock), 10) : 10;
    const numCategoriaId = parseInt(String(categoria_id), 10);
    let finalTituloVariante: string | null = null;

    if (has_unit_pricing && precios_unidades) {
      numPrecio = Number(precios_unidades.u12) > 0 ? Number(precios_unidades.u12) : numPrecio;
      finalTituloVariante = "Unidades";
    } else if (titulo_variante && !["tamaño", "estándar", "estandar"].includes(titulo_variante.toLowerCase())) {
      finalTituloVariante = titulo_variante;
    }

    const product = await prisma.productos.create({
      data: {
        sku,
        slug,
        nombre: nombre.trim(),
        categoria_id: numCategoriaId,
        descripcion: descripcion.trim(),
        stock: isNaN(numStock) ? 0 : numStock,
        precio: numPrecio,
        precio_anterior: precio_anterior ? Number(precio_anterior) : null,
        descuento_pct: descuento_pct ? parseInt(String(descuento_pct), 10) : null,
        etiqueta: (etiqueta || "FLORERÍA ARTESANAL").trim(),
        titulo_variante: finalTituloVariante,
        es_oferta_flash: Boolean(es_oferta_flash),
        es_nuevo: es_nuevo !== undefined ? Boolean(es_nuevo) : true,
        es_favorito: Boolean(es_favorito),
        activo: true,
      },
    });

    // Guardar imagen si se proporcionó
    if (imagen && typeof imagen === "string" && imagen.trim()) {
      await prisma.producto_imagenes.create({
        data: {
          producto_id: product.id,
          url: imagen.trim(),
          texto_alt: product.nombre,
          es_principal: true,
          orden: 1,
        },
      });
    }

    // Variantes según opción elegida: por unidades (12, 24, 36, 42)
    if (has_unit_pricing && precios_unidades) {
      const p12 = Number(precios_unidades.u12) || numPrecio;
      const p24 = Number(precios_unidades.u24) || p12 * 1.85;
      const p36 = Number(precios_unidades.u36) || p12 * 2.7;
      const p42 = Number(precios_unidades.u42) || p12 * 3.1;

      await prisma.producto_variantes.createMany({
        data: [
          {
            producto_id: product.id,
            etiqueta: "12 unidades",
            extra_precio: 0,
            es_predeterminada: true,
            stock: isNaN(numStock) ? 0 : numStock,
            orden: 1,
          },
          {
            producto_id: product.id,
            etiqueta: "24 unidades",
            extra_precio: Number((p24 - p12).toFixed(2)),
            es_predeterminada: false,
            stock: isNaN(numStock) ? 0 : numStock,
            orden: 2,
          },
          {
            producto_id: product.id,
            etiqueta: "36 unidades",
            extra_precio: Number((p36 - p12).toFixed(2)),
            es_predeterminada: false,
            stock: isNaN(numStock) ? 0 : numStock,
            orden: 3,
          },
          {
            producto_id: product.id,
            etiqueta: "42 unidades",
            extra_precio: Number((p42 - p12).toFixed(2)),
            es_predeterminada: false,
            stock: isNaN(numStock) ? 0 : numStock,
            orden: 4,
          },
        ],
      });
    }

    const fullProduct = await prisma.productos.findUnique({
      where: { id: product.id },
      include: {
        categorias: true,
        producto_imagenes: true,
        producto_variantes: true,
      },
    });

    return NextResponse.json(fullProduct, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error interno al guardar el producto" },
      { status: 500 }
    );
  }
}
