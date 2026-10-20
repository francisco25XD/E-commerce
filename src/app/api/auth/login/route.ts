import { NextResponse } from "next/server";
import { authenticateUser, signToken, USER_TOKEN_COOKIE, TOKEN_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo electrónico y contraseña requeridos" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Correo electrónico o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.toISOString().slice(0, 10) : null,
      rol: user.rol,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    const token = signToken(payload);

    const redirectPath = user.rol === "admin" ? "/admin" : "/cuenta";

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        fecha_nacimiento: payload.fecha_nacimiento,
        rol: user.rol,
      },
      redirect: redirectPath,
    });

    // Cookie de usuario general
    response.cookies.set(USER_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // Si además es admin, seteamos también la cookie de admin para que pueda acceder a /admin
    if (user.rol === "admin") {
      response.cookies.set(TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
