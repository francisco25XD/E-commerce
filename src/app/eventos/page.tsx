import type { Metadata } from "next";
import EventosView from "@/components/EventosView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bodas y Eventos Singulares — Alma de Flor",
  description: "Diseño floral monumental y montajes botánicos para bodas, fincas, bodegas y eventos exclusivos en La Rioja.",
};

export default function EventosPage() {
  return <EventosView />;
}
