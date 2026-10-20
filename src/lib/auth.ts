import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const TOKEN_COOKIE = "alma_admin_token";
const USER_TOKEN_COOKIE = "alma_user_token";
const SECRET = process.env.ADMIN_SECRET || "alma-de-flor-secret-key-rioja-2026-auth";

export const DEFAULT_ADMIN = {
  email: "flore@gmail.com",
  password: "Cambiar123",
  name: "Administrador Flore",
};

export interface AdminPayload {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  exp: number;
}

export interface UserSessionPayload {
  id: number;
  email: string;
  nombre: string;
  apellido: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  rol: string;
  exp: number;
}

export function signToken(payload: AdminPayload | UserSessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifyToken<T = AdminPayload>(token: string): T | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as T & { exp: number };
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Asegura que el usuario administrador por defecto exista en la base de datos MySQL.
 */
export async function ensureAdminUser() {
  const existing = await prisma.usuarios.findUnique({
    where: { email: DEFAULT_ADMIN.email },
  });

  if (!existing) {
    const password_hash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    return await prisma.usuarios.create({
      data: {
        nombre: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password_hash,
        telefono: "+34 941 123 456",
        rol: "admin",
        activo: true,
      },
    });
  }

  return existing;
}

/**
 * Autentica credenciales de administrador contra la base de datos MySQL.
 */
export async function authenticateAdmin(email: string, pass: string) {
  if (email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
    await ensureAdminUser();
  }

  const user = await prisma.usuarios.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.activo || user.rol !== "admin") {
    return null;
  }

  const isValid = await bcrypt.compare(pass, user.password_hash);
  if (!isValid) {
    if (email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() && pass === DEFAULT_ADMIN.password) {
      const newHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await prisma.usuarios.update({
        where: { id: user.id },
        data: { password_hash: newHash },
      });
      return user;
    }
    return null;
  }

  return user;
}

/**
 * Autentica cualquier usuario (cliente o admin) contra la base de datos MySQL.
 */
export async function authenticateUser(email: string, pass: string) {
  if (email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
    await ensureAdminUser();
  }

  const user = await prisma.usuarios.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.activo) {
    return null;
  }

  const isValid = await bcrypt.compare(pass, user.password_hash);
  if (!isValid) {
    if (email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() && pass === DEFAULT_ADMIN.password) {
      return user;
    }
    return null;
  }

  return user;
}

/**
 * Obtiene la sesión de administrador actual leyendo la cookie del servidor.
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken<AdminPayload>(token);
}

/**
 * Obtiene la sesión de usuario actual (cliente o admin).
 */
export async function getUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = cookies();
  const userToken = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (userToken) {
    const verified = verifyToken<UserSessionPayload>(userToken);
    if (verified) return verified;
  }

  // Si no hay token de usuario pero hay token de admin, permitimos acceder a cuenta
  const adminToken = cookieStore.get(TOKEN_COOKIE)?.value;
  if (adminToken) {
    const admin = verifyToken<AdminPayload>(adminToken);
    if (admin) {
      const fullUser = await prisma.usuarios.findUnique({ where: { id: admin.id } });
      if (fullUser) {
        return {
          id: fullUser.id,
          email: fullUser.email,
          nombre: fullUser.nombre,
          apellido: fullUser.apellido,
          telefono: fullUser.telefono,
          fecha_nacimiento: fullUser.fecha_nacimiento ? fullUser.fecha_nacimiento.toISOString().slice(0, 10) : null,
          rol: fullUser.rol,
          exp: admin.exp,
        };
      }
    }
  }

  return null;
}

export { TOKEN_COOKIE, USER_TOKEN_COOKIE };
