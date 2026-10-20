import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const list = await prisma.consultas.findMany({
      orderBy: { creado_en: "desc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    return NextResponse.json({ error: "Error al cargar consultas" }, { status: 500 });
  }
}
