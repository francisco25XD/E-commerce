import type { Metadata } from "next";
import { Droplet, Flower2, Palette, PenLine } from "lucide-react";
import { loadProducts, sortBySlugs } from "@/lib/products";
import ArregloCard from "@/components/ArregloCard";
import Manifesto from "@/components/Manifesto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Composiciones en Jarrón y Cerámica Artesanal — Alma de Flor",
  description: "Obras florales listas para habitar la mesa, con recipiente exclusivo de cristal soplado o gres cocido en talleres riojanos.",
};

const ORDER = [
  "jardin-ingles-en-jarron",
  "phalaenopsis-doble-tallo",
  "centro-velas-rosas-crema",
  "jardin-silvestre-en-urna",
  "ikebana-contemporanea",
  "cesta-citrica-olivo",
];

const commitments = [
  {
    Icon: Droplet,
    title: "Agua con Nutrientes Botánicos",
    text: "Cada jarrón se entrega previamente hidratado con una fórmula mineral exclusiva que prolonga la vivacidad de las flores hasta 12 días sin enturbiar el agua.",
  },
  {
    Icon: Palette,
    title: "Ceramistas & Vidrieros Locales",
    text: "Colaboramos directamente con artesanos de la alfarería de Navarrete y talleres de vidrio para diseñar piezas exclusivas que conservas como pieza decorativa permanente.",
  },
  {
    Icon: PenLine,
    title: "Caligrafía a Mano en Papel Verjurado",
    text: "Personalizamos tu mensaje en tinta sepia sobre tarjetas artesanales elaboradas con fibras de algodón y pétalos secos prensados en nuestro propio atelier.",
  },
];

export default async function ArreglosPage() {
  const products = sortBySlugs(await loadProducts({ category: { slug: "arreglos-florales" } }), ORDER);

  return (
    <div className="bg-cream">
      <section className="bg-[#f1f0ec]">
        <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-14">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-mint-200 px-2 py-1 text-[10px] font-semibold tracking-wider text-forest-600">
            <Flower2 size={11} /> COLECCIÓN DE ESTUDIO BOTÁNICO
          </span>
          <h1 className="mt-4 font-serif text-5xl">Composiciones en Jarrón y Cerámica Artesanal</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-forest-700">
            Obras florales listas para habitar la mesa. Cada diseño incluye su recipiente exclusivo de cristal soplado o gres cocido a baja temperatura en talleres riojanos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-24 pt-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ArregloCard key={p.id} p={p} />)}
        </div>
        {products.length === 0 && (
          <p className="text-sm text-forest-600">Todavía no hay arreglos cargados. Ejecutá <code>npm run db:setup</code>.</p>
        )}
      </section>

      <section className="bg-[#f1f0ec] py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-forest-600">EL COMPROMISO ALMA DE FLOR</p>
            <h2 className="mt-2 font-serif text-4xl">El Arte del Arreglo Floral Listo para Mesa</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-forest-700">
              Evitamos el estrés de encontrar un recipiente adecuado o recortar tallos sin las herramientas precisas. Tus flores llegan con su hábitat perfecto.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {commitments.map(({ Icon, title, text }) => (
              <article key={title} className="rounded-md bg-white p-6 shadow-[0_1px_3px_rgba(4,38,26,0.08)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-mint-200 text-forest-600">
                  <Icon size={18} />
                </span>
                <h3 className="mt-6 font-serif text-lg">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-forest-700/80">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Manifesto
        bleed
        badges={false}
        eyebrow="MANIFIESTO DE LA ESCULTURA EFÍMERA"
        quote="Tratamos cada tallo con la reverencia de una escultura efímera, y cada jarrón como el refugio que honra su memoria viva."
        text="Empaques 100% biodegradables, envíos refrigerados respetuosos y flor cortada de proximidad en los valles de La Rioja."
      />
    </div>
  );
}
