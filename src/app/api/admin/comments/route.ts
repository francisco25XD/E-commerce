import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const reviews = await prisma.resenas.findMany({
    include: {
      productos: {
        select: {
          id: true,
          nombre: true,
          slug: true,
        },
      },
      usuarios: {
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      },
    },
    orderBy: { creado_en: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { producto_id, usuario_id, puntuacion, comentario, aprobada } = body;

    if (!producto_id || !comentario) {
      return NextResponse.json(
        { error: "Producto y comentario son obligatorios" },
        { status: 400 }
      );
    }

    const rating = Math.min(5, Math.max(1, parseInt(String(puntuacion || 5), 10)));
    const targetUserId = usuario_id ? parseInt(String(usuario_id), 10) : session.id;

    // Verificar si ya existe reseña para ese producto y usuario
    const existing = await prisma.resenas.findFirst({
      where: {
        producto_id: parseInt(String(producto_id), 10),
        usuario_id: targetUserId,
      },
    });

    let review;
    if (existing) {
      review = await prisma.resenas.update({
        where: { id: existing.id },
        data: {
          puntuacion: rating,
          comentario: comentario.trim(),
          aprobada: aprobada !== undefined ? Boolean(aprobada) : true,
        },
      });
    } else {
      review = await prisma.resenas.create({
        data: {
          producto_id: parseInt(String(producto_id), 10),
          usuario_id: targetUserId,
          puntuacion: rating,
          comentario: comentario.trim(),
          aprobada: aprobada !== undefined ? Boolean(aprobada) : true,
        },
      });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return NextResponse.json(
      { error: "Error al guardar el comentario" },
      { status: 500 }
    );
  }
}
