import type { Metadata } from "next";
import { Flower, Leaf, Scissors, Thermometer } from "lucide-react";
import { loadProducts, sortBySlugs } from "@/lib/products";
import RosaCard from "@/components/RosaCard";
import Manifesto from "@/components/Manifesto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rosas de Autor — Alma de Flor",
  description: "Rosas inglesas David Austin y tallos extra largos de los Andes. Corte al bies para perdurar en el hogar riojano.",
};

const ORDER = [
  "caja-lujo-24-rosas-melocoton",
  "50-rosas-grand-prix",
  "cupula-eterna-encantada",
  "bouquet-18-rosas-garden-juliet",
  "sombrerera-blancas-avalanche",
  "rosas-silvestres-ranunculos",
];

const care = [
  {
    Icon: Scissors,
    title: "Corte en Ángulo de 45°",
    text: "Corta 2 centímetros del tallo bajo el agua antes de colocarlas en el jarrón. Así evitarás que entren burbujas de aire en los capilares y disfrutarás de una apertura completa de los pétalos.",
    step: "PASO 01 • HIDRATACIÓN ÓPTIMA",
  },
  {
    Icon: Thermometer,
    title: "Agua Templada & Frescura",
    text: "Mantén el jarrón lejos de fuentes directas de calefacción o frutas maduras (etileno). Renueva el agua limpia cada dos días disolviendo el nutriente botánico adjunto.",
    step: "PASO 02 • TEMPERATURA IDEAL",
  },
  {
    Icon: Leaf,
    title: "Cultivo Responsable",
    text: "Nuestras rosas proceden exclusivamente de floricultores certificados con sello de comercio justo y huella hídrica minimizada, apoyando a familias y cooperativas locales.",
    step: "PASO 03 • TRAZABILIDAD ÉTICA",
  },
];

export default async function RosasPage() {
  const products = sortBySlugs(await loadProducts({ category: { slug: "rosas" } }), ORDER);

  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-[1240px] px-6 pb-10 pt-12">
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-mint-200 px-2 py-1 text-[10px] font-semibold tracking-wider text-forest-600">
          <Flower size={11} /> COLECCIÓN DE AUTOR • ROSAS SELECCIONADAS
        </span>
        <h1 className="mt-4 font-serif text-5xl">Rosas de Autor</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-forest-700">
          Desde la opulencia táctil de las rosas inglesas David Austin cultivadas con paciencia botánica, hasta los míticos tallos extra-largos de los Andes. Aromas profundos, pétalos aterciopelados y corte al bies para perdurar en el hogar riojano.
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <RosaCard key={p.id} p={p} />)}
        </div>
        {products.length === 0 && (
          <p className="text-sm text-forest-600">Todavía no hay rosas cargadas. Ejecutá <code>npm run db:setup</code>.</p>
        )}
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-8">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-forest-600">COMPROMISO HORTÍCOLA</p>
        <h2 className="mt-2 font-serif text-4xl">El Arte de Cuidar la Reina de las Flores</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {care.map(({ Icon, title, text, step }) => (
            <article key={title} className="flex flex-col rounded-md bg-white p-6 shadow-[0_1px_3px_rgba(4,38,26,0.08)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-mint-200 text-forest-600">
                <Icon size={18} />
              </span>
              <h3 className="mt-6 font-serif text-lg">{title}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-forest-700/80">{text}</p>
              <p className="mt-6 text-[9px] font-semibold tracking-wider text-forest-600">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <Manifesto
        badges={false}
        eyebrow="MANIFIESTO DE SOSTENIBILIDAD & ALMA RIOJANA"
        quote="Tratamos cada rosa con la reverencia debida a una escultura viva y efímera."
        text="Empaques 100% biodegradables libres de plástico, cinta de seda orgánica teñida con pigmentos vegetales y envíos refrigerados por rutas sostenibles en toda La Rioja."
      />
    </div>
  );
}
