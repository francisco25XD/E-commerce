import { NextResponse } from "next/server";
import { getAdminSession, DEFAULT_ADMIN } from "@/lib/auth";
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
    const { rol, activo } = body;

    const user = await prisma.usuarios.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Proteger el admin principal para no desactivarlo ni quitarle rol de admin
    if (user.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
      if (activo === false || (rol && rol !== "admin")) {
        return NextResponse.json(
          { error: "No se puede desactivar ni revocar permisos al administrador principal" },
          { status: 400 }
        );
      }
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (rol !== undefined) dataToUpdate.rol = rol === "admin" ? "admin" : "cliente";
    if (activo !== undefined) dataToUpdate.activo = Boolean(activo);

    const updated = await prisma.usuarios.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        activo: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error al actualizar el usuario" }, { status: 500 });
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
    const user = await prisma.usuarios.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
      return NextResponse.json(
        { error: "No se puede eliminar el usuario administrador principal" },
        { status: 400 }
      );
    }

    await prisma.usuarios.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json({ error: "Error al eliminar el usuario" }, { status: 500 });
  }
}
