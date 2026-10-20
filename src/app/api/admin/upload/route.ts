import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Limpiar nombre y asegurar extensión válida
    const originalName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
    const ext = path.extname(originalName) || ".jpg";
    const baseName = path.basename(originalName, ext);
    const fileName = `${baseName}-${Date.now()}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "products");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/products/${fileName}`;
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (error) {
    console.error("Error al subir archivo de imagen:", error);
    return NextResponse.json({ error: "Error al guardar la imagen en el servidor" }, { status: 500 });
  }
}
