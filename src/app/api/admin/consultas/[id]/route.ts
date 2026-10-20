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
    const { estado } = body;

    const validEstados = ["nueva", "en_curso", "respondida", "cerrada"] as const;
    if (!validEstados.includes(estado)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
    }

    const updated = await prisma.consultas.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error al actualizar consulta:", error);
    return NextResponse.json({ error: "Error al actualizar estado de la consulta" }, { status: 500 });
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
    await prisma.consultas.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, message: "Consulta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar consulta:", error);
    return NextResponse.json({ error: "Error al eliminar la consulta" }, { status: 500 });
  }
}
