import { NextResponse } from "next/server";
import { USER_TOKEN_COOKIE, TOKEN_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Sesión cerrada correctamente" });
  response.cookies.delete(USER_TOKEN_COOKIE);
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}
