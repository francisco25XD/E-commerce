import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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
    const { aprobada, respuesta } = body;

    const dataToUpdate: Record<string, any> = {};

    if (aprobada !== undefined) {
      dataToUpdate.aprobada = Boolean(aprobada);
    }

    if (respuesta !== undefined) {
      const trimmed = typeof respuesta === "string" ? respuesta.trim() : "";
      dataToUpdate.respuesta = trimmed || null;
      dataToUpdate.respondido_en = trimmed ? new Date() : null;
      if (trimmed) {
        dataToUpdate.aprobada = true;
      }
    }

    const updated = await prisma.resenas.update({
      where: { id },
      data: dataToUpdate as any,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    return NextResponse.json({ error: "Error al actualizar estado del comentario" }, { status: 500 });
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
    await prisma.resenas.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    return NextResponse.json({ error: "Error al eliminar el comentario" }, { status: 500 });
  }
}
