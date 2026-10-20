import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userComments = await prisma.resenas.findMany({
    where: { usuario_id: session.id },
    include: {
      productos: {
        select: {
          id: true,
          nombre: true,
          slug: true,
        },
      },
    },
    orderBy: { creado_en: "desc" },
  });

  return NextResponse.json(userComments);
}

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { producto_id, puntuacion, comentario, asunto } = body;

    if (!comentario || typeof comentario !== "string" || !comentario.trim()) {
      return NextResponse.json({ error: "El comentario no puede estar vacío" }, { status: 400 });
    }

    // Si no se proporcionó producto_id, buscamos un producto activo que el usuario no haya comentado aún
    let targetProductId = producto_id ? parseInt(String(producto_id), 10) : null;
    if (!targetProductId || isNaN(targetProductId)) {
      const existingReviews = await prisma.resenas.findMany({
        where: { usuario_id: session.id },
        select: { producto_id: true },
      });
      const reviewedIds = existingReviews.map((r) => r.producto_id);

      const unreviewedProduct = await prisma.productos.findFirst({
        where: {
          activo: true,
          id: { notIn: reviewedIds },
        },
        orderBy: { id: "asc" },
      });

      if (unreviewedProduct) {
        targetProductId = unreviewedProduct.id;
      } else {
        const anyProduct = await prisma.productos.findFirst({
          where: { activo: true },
          orderBy: { id: "asc" },
        });
        if (anyProduct) {
          targetProductId = anyProduct.id;
        }
      }
    }

    if (!targetProductId) {
      return NextResponse.json({ error: "No hay productos disponibles para asociar el comentario" }, { status: 400 });
    }

    const rating = Math.min(5, Math.max(1, parseInt(String(puntuacion || 5), 10)));

    // Guardar reseña/comentario (marcado como pendiente para que el administrador lo modere o apruebe)
    const newReview = await prisma.resenas.upsert({
      where: {
        producto_id_usuario_id: {
          producto_id: targetProductId,
          usuario_id: session.id,
        },
      },
      update: {
        puntuacion: rating,
        comentario: comentario.trim(),
        aprobada: false,
        creado_en: new Date(),
      },
      create: {
        producto_id: targetProductId,
        usuario_id: session.id,
        puntuacion: rating,
        comentario: comentario.trim(),
        aprobada: false,
      },
      include: {
        productos: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ok: true,
        comment: newReview,
        message: "Tu comentario ha sido enviado al administrador con éxito",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al enviar comentario del usuario:", error);
    return NextResponse.json({ error: "Error al enviar el comentario al administrador" }, { status: 500 });
  }
}
