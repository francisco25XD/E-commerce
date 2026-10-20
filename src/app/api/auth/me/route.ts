import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  // Traer los datos frescos desde la base de datos
  const user = await prisma.usuarios.findUnique({
    where: { id: session.id },
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

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      ...user,
      fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.toISOString().slice(0, 10) : null,
    },
  });
}
