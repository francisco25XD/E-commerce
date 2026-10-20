import { NextResponse } from "next/server";
import { getUserSession, signToken, USER_TOKEN_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nombre, apellido, telefono, fecha_nacimiento } = body;

    if (!nombre || !apellido || !telefono || !fecha_nacimiento) {
      return NextResponse.json(
        { error: "Todos los campos (nombre, apellido, teléfono, fecha de nacimiento) son requeridos" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(fecha_nacimiento);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
    }

    const updatedUser = await prisma.usuarios.update({
      where: { id: session.id },
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        fecha_nacimiento: parsedDate,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        fecha_nacimiento: true,
        rol: true,
      },
    });

    const birthDateStr = updatedUser.fecha_nacimiento
      ? updatedUser.fecha_nacimiento.toISOString().slice(0, 10)
      : null;

    // Actualizar cookie de sesión con los nuevos datos
    const updatedToken = signToken({
      id: updatedUser.id,
      email: updatedUser.email,
      nombre: updatedUser.nombre,
      apellido: updatedUser.apellido,
      telefono: updatedUser.telefono,
      fecha_nacimiento: birthDateStr,
      rol: updatedUser.rol,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        ...updatedUser,
        fecha_nacimiento: birthDateStr,
      },
      message: "Datos personales actualizados correctamente",
    });

    response.cookies.set(USER_TOKEN_COOKIE, updatedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ error: "Error al actualizar los datos en la base de datos" }, { status: 500 });
  }
}
