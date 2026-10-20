import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const users = await prisma.usuarios.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      fecha_nacimiento: true,
      rol: true,
      activo: true,
      creado_en: true,
      actualizado_en: true,
      _count: {
        select: {
          pedidos: true,
          resenas: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nombre, email, password, telefono, rol, activo } = body;

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.usuarios.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un usuario con este email" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const validRol = rol === "admin" ? "admin" : "cliente";

    const user = await prisma.usuarios.create({
      data: {
        nombre: nombre.trim(),
        email: cleanEmail,
        password_hash,
        telefono: telefono ? telefono.trim() : null,
        rol: validRol,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        activo: true,
        creado_en: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario en la base de datos" },
      { status: 500 }
    );
  }
}
