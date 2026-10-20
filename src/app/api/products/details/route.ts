import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");
    const whereClause: { activo: boolean; id?: { in: number[] } } = { activo: true };

    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id));
      if (ids.length > 0) {
        whereClause.id = { in: ids };
      }
    }

    const products = await prisma.productos.findMany({
      where: whereClause,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        etiqueta: true,
        producto_imagenes: {
          select: { url: true, es_principal: true },
          orderBy: [{ es_principal: "desc" }, { orden: "asc" }],
        },
      },
    });

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion,
      image: p.producto_imagenes[0]?.url || `/products/${p.id}.jpg`,
      tag: p.etiqueta,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
