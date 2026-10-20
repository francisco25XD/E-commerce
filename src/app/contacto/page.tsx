import type { Metadata } from "next";
import ContactoView from "@/components/ContactoView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto & Atelier Botánico — Alma de Flor",
  description: "Visita nuestro taller botánico en Calle Portales 42, Logroño o contacta con nosotros para encargos florales personalizados, bodas, eventos y condolencias.",
};

export default function ContactoPage() {
  return <ContactoView />;
}
