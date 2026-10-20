import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
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
      etiqueta,
      activo,
      es_oferta_flash,
      es_nuevo,
      es_favorito,
      has_unit_pricing,
      precios_unidades,
    } = body;

    const dataToUpdate: Record<string, unknown> = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre.trim();
    if (categoria_id !== undefined) dataToUpdate.categoria_id = parseInt(String(categoria_id), 10);
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion.trim();
    if (stock !== undefined) dataToUpdate.stock = stock === null ? null : parseInt(String(stock), 10);
    if (precio !== undefined) dataToUpdate.precio = Number(precio);
    if (etiqueta !== undefined) dataToUpdate.etiqueta = etiqueta.trim();
    if (activo !== undefined) dataToUpdate.activo = Boolean(activo);
    if (es_oferta_flash !== undefined) dataToUpdate.es_oferta_flash = Boolean(es_oferta_flash);
    if (es_nuevo !== undefined) dataToUpdate.es_nuevo = Boolean(es_nuevo);
    if (es_favorito !== undefined) dataToUpdate.es_favorito = Boolean(es_favorito);

    if (has_unit_pricing !== undefined) {
      if (has_unit_pricing && precios_unidades) {
        const p12 = Number(precios_unidades.u12) || Number(precio) || 35.0;
        dataToUpdate.precio = p12;
        dataToUpdate.titulo_variante = "Unidades";
      } else {
        dataToUpdate.titulo_variante = null;
      }
    }

    const updated = await prisma.productos.update({
      where: { id },
      data: dataToUpdate,
    });

    // Actualizar variantes si se modificó has_unit_pricing
    if (has_unit_pricing !== undefined) {
      const numStock = stock !== undefined && stock !== null ? parseInt(String(stock), 10) : (updated.stock ?? 10);

      if (has_unit_pricing && precios_unidades) {
        const p12 = Number(precios_unidades.u12) || Number(updated.precio) || 35.0;
        const p24 = Number(precios_unidades.u24) || p12 * 1.85;
        const p36 = Number(precios_unidades.u36) || p12 * 2.7;
        const p42 = Number(precios_unidades.u42) || p12 * 3.1;

        await prisma.producto_variantes.deleteMany({ where: { producto_id: id } });
        await prisma.producto_variantes.createMany({
          data: [
            {
              producto_id: id,
              etiqueta: "12 unidades",
              extra_precio: 0,
              es_predeterminada: true,
              stock: numStock,
              orden: 1,
            },
            {
              producto_id: id,
              etiqueta: "24 unidades",
              extra_precio: Number((p24 - p12).toFixed(2)),
              es_predeterminada: false,
              stock: numStock,
              orden: 2,
            },
            {
              producto_id: id,
              etiqueta: "36 unidades",
              extra_precio: Number((p36 - p12).toFixed(2)),
              es_predeterminada: false,
              stock: numStock,
              orden: 3,
            },
            {
              producto_id: id,
              etiqueta: "42 unidades",
              extra_precio: Number((p42 - p12).toFixed(2)),
              es_predeterminada: false,
              stock: numStock,
              orden: 4,
            },
          ],
        });
      } else if (!has_unit_pricing) {
        await prisma.producto_variantes.deleteMany({ where: { producto_id: id } });
      }
    }

    if (imagen && typeof imagen === "string" && imagen.trim()) {
      // Si ya tiene imagen principal la actualizamos, si no la creamos
      const mainImg = await prisma.producto_imagenes.findFirst({
        where: { producto_id: id, es_principal: true },
      });

      if (mainImg) {
        await prisma.producto_imagenes.update({
          where: { id: mainImg.id },
          data: { url: imagen.trim(), texto_alt: updated.nombre },
        });
      } else {
        await prisma.producto_imagenes.create({
          data: {
            producto_id: id,
            url: imagen.trim(),
            texto_alt: updated.nombre,
            es_principal: true,
            orden: 1,
          },
        });
      }
    }

    const fullProduct = await prisma.productos.findUnique({
      where: { id },
      include: {
        categorias: true,
        producto_imagenes: true,
        producto_variantes: true,
      },
    });

    return NextResponse.json(fullProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Para proteger integridad referencial de pedidos previos, marcamos activo = false o eliminamos si no tiene pedidos
    const hasOrderItems = await prisma.pedido_items.count({
      where: { producto_id: id },
    });

    if (hasOrderItems > 0) {
      await prisma.productos.update({
        where: { id },
        data: { activo: false },
      });
      return NextResponse.json({
        ok: true,
        message: "Producto desactivado para preservar historial de pedidos",
      });
    }

    await prisma.producto_variantes.deleteMany({ where: { producto_id: id } });
    await prisma.producto_imagenes.deleteMany({ where: { producto_id: id } });
    await prisma.productos.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
