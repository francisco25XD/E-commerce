import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const categories = await prisma.categorias.findMany({
    where: {
      activa: true,
      NOT: {
        slug: "eventos",
      },
    },
    orderBy: { orden: "asc" },
  });

  return NextResponse.json(categories);
}
