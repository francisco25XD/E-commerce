import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, USER_TOKEN_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, nombre, apellido, telefono, fecha_nacimiento, password } = body;

    // Validación de campos obligatorios
    if (!email || !nombre || !apellido || !telefono || !fecha_nacimiento || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios: email, nombre, apellido, teléfono, fecha de nacimiento y contraseña" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "El formato de correo electrónico no es válido" }, { status: 400 });
    }

    // Comprobar si el usuario ya existe
    const existing = await prisma.usuarios.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una cuenta registrada con este correo electrónico" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Parsear fecha de nacimiento
    const parsedDate = new Date(fecha_nacimiento);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
    }

    const newUser = await prisma.usuarios.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: cleanEmail,
        password_hash,
        telefono: telefono.trim(),
        fecha_nacimiento: parsedDate,
        rol: "cliente",
        activo: true,
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

    // Crear token de sesión para el nuevo usuario
    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      telefono: newUser.telefono,
      fecha_nacimiento: newUser.fecha_nacimiento ? newUser.fecha_nacimiento.toISOString().slice(0, 10) : null,
      rol: newUser.rol,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    const response = NextResponse.json(
      {
        ok: true,
        user: newUser,
        message: "Registro completado con éxito",
      },
      { status: 201 }
    );

    response.cookies.set(USER_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Error en registro de usuario:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar el registro" },
      { status: 500 }
    );
  }
}
