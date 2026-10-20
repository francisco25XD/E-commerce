import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductDTO } from "@/lib/types";

type Where = { isFlash?: boolean; isNew?: boolean; isFavorite?: boolean; category?: { slug: string } };

/** Ordena según una lista de slugs; los que no estén van al final (por id). */
export function sortBySlugs(products: ProductDTO[], order: string[]): ProductDTO[] {
  const rank = (slug: string) => {
    const i = order.indexOf(slug);
    return i === -1 ? order.length : i;
  };
  return [...products].sort((a, b) => rank(a.slug) - rank(b.slug) || a.id - b.id);
}

export async function loadProducts(where: Where = {}): Promise<ProductDTO[]> {
  const filter: Prisma.productosWhereInput = {
    activo: true,
  };

  if (where.isFlash !== undefined) filter.es_oferta_flash = where.isFlash;
  if (where.isNew !== undefined) filter.es_nuevo = where.isNew;
  if (where.isFavorite !== undefined) filter.es_favorito = where.isFavorite;
  if (where.category?.slug) {
    filter.categorias = { slug: where.category.slug };
  }

  const rows = await prisma.productos.findMany({
    where: filter,
    include: {
      producto_variantes: { orderBy: { orden: "asc" } },
      producto_imagenes: { orderBy: [{ es_principal: "desc" }, { orden: "asc" }] },
    },
    orderBy: { id: "asc" },
  });

  return rows.map((r) => {
    const imgUrl =
      r.producto_imagenes.find((img) => img.es_principal)?.url ??
      r.producto_imagenes[0]?.url ??
      `/products/${r.slug}.jpg`;

    return {
      id: r.id,
      slug: r.slug,
      name: r.nombre,
      tag: r.etiqueta,
      description: r.descripcion,
      priceCents: Math.round(Number(r.precio) * 100),
      compareCents: r.precio_anterior ? Math.round(Number(r.precio_anterior) * 100) : null,
      discountPct: r.descuento_pct,
      rating: r.valoracion ? Number(r.valoracion) : null,
      image: imgUrl,
      variantLabel:
        r.titulo_variante && !["tamaño", "estándar", "estandar"].includes(r.titulo_variante.toLowerCase())
          ? r.titulo_variante
          : null,
      catalogName: r.nombre_catalogo,
      catalogTag: r.etiqueta_catalogo,
      catalogDescription: r.descripcion_catalogo,
      perk: r.detalle_extra,
      perkIcon: r.icono_extra,
      variants: r.producto_variantes
        .filter(
          (v) =>
            !v.etiqueta.toLowerCase().includes("estándar") &&
            !v.etiqueta.toLowerCase().includes("estandar")
        )
        .map((v) => ({
          id: v.id,
          label: v.etiqueta,
          extraCents: Math.round(Number(v.extra_precio) * 100),
          isDefault: v.es_predeterminada,
        })),
    };
  });
}
