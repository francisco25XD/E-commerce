import { NextResponse } from "next/server";
import { TOKEN_COOKIE, USER_TOKEN_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Sesión de administrador cerrada correctamente" });

  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(USER_TOKEN_COOKIE);

  response.cookies.set(TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
  });

  response.cookies.set(USER_TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
  });

  return response;
}

export async function GET(req: Request) {
  const url = new URL("/admin/login", req.url);
  const response = NextResponse.redirect(url);

  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(USER_TOKEN_COOKIE);

  response.cookies.set(TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
  });

  response.cookies.set(USER_TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
  });

  return response;
}
