import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, tipo_consulta, fecha_entrega, mensaje, origen } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son campos obligatorios." },
        { status: 400 }
      );
    }

    // Mapeo a enum de consultas_tipo (contacto, evento, corona_funebre, otro)
    let tipoEnum: "contacto" | "evento" | "corona_funebre" | "otro" = "contacto";
    if (origen === "evento") {
      tipoEnum = "evento";
    } else if (origen === "contacto") {
      const tipoLower = (tipo_consulta || "").toLowerCase();
      if (tipoLower.includes("tanatorio") || tipoLower.includes("condolencia") || tipoLower.includes("corona")) {
        tipoEnum = "corona_funebre";
      } else if (tipoLower.includes("otro")) {
        tipoEnum = "otro";
      } else {
        tipoEnum = "contacto";
      }
    } else {
      const tipoLower = (tipo_consulta || "").toLowerCase();
      if (tipoLower.includes("boda") || tipoLower.includes("evento")) {
        tipoEnum = "evento";
      } else if (tipoLower.includes("tanatorio") || tipoLower.includes("condolencia") || tipoLower.includes("corona")) {
        tipoEnum = "corona_funebre";
      } else if (tipoLower.includes("otro")) {
        tipoEnum = "otro";
      }
    }

    // Registrar en la tabla consultas de MySQL
    const consulta = await prisma.consultas.create({
      data: {
        tipo: tipoEnum,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono ? telefono.trim() : null,
        asunto: tipo_consulta || (tipoEnum === "evento" ? "Solicitud de Presupuesto / Dossier de Evento" : "Consulta desde Atelier"),
        mensaje: mensaje.trim(),
        fecha_evento: fecha_entrega ? new Date(fecha_entrega) : null,
        estado: "nueva",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Consulta enviada correctamente",
      id: consulta.id,
    });
  } catch (error) {
    console.error("Error en /api/contact:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al enviar la consulta. Inténtalo nuevamente." },
      { status: 500 }
    );
  }
}
