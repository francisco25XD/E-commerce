import type { Metadata } from "next";
import { Clock, HeartHandshake, ShieldCheck, PenLine } from "lucide-react";
import { loadProducts } from "@/lib/products";
import CoronaCard from "@/components/CoronaCard";
import Manifesto from "@/components/Manifesto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Coronas Fúnebres y Condolencias — Alma de Flor",
  description: "Composiciones florales solemnes y coronas fúnebres de condolencias. Entrega urgente y con máximo respeto en tanatorios de Logroño y La Rioja.",
};

const guarantees = [
  {
    Icon: Clock,
    title: "Entrega Urgente & Prioritaria",
    text: "Prioridad máxima para tanatorios y capillas ardientes con confirmación de entrega en mano.",
  },
  {
    Icon: PenLine,
    title: "Cinta Conmemorativa Incluida",
    text: "Cinta o banda ceremonial con la dedicatoria de familiares, amigos o empresa impresa con tipografía elegante.",
  },
  {
    Icon: ShieldCheck,
    title: "Flores Frescas & Máxima Solemnidad",
    text: "Elaboradas al momento con flor fresca seleccionada de primera calidad para garantizar presencia impecable.",
  },
];

export default async function CoronasFunebresPage() {
  const products = await loadProducts({ category: { slug: "coronas-funebres" } });

  return (
    <div className="bg-cream">
      {/* Header de la categoría */}
      <section className="bg-[#f3f1ec] border-b border-mint-200/60">
        <div className="mx-auto max-w-[1240px] px-6 pb-14 pt-16">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-mint-200 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-forest-700">
            <HeartHandshake size={12} /> COLECCIÓN SOLEMNE • SERVICIO DE CONDOLENCIAS
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-forest-900">
            Coronas Fúnebres y Condolencias
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-forest-700">
            Un homenaje floral con el máximo respeto, elegancia y sobriedad. Cada corona y arreglo fúnebre se elabora artesanalmente en nuestro taller con flores frescas de la más alta calidad, e incluye cinta dedicatoria personalizada.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {guarantees.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-md bg-white/70 p-4 border border-mint-200/80">
                <Icon size={18} className="text-forest mb-2" />
                <h3 className="font-semibold text-xs text-forest-900">{title}</h3>
                <p className="mt-1 text-xs text-forest-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de productos: SOLO categoría coronas fúnebres */}
      <section className="mx-auto max-w-[1240px] px-6 pb-24 pt-12" id="catalogo">
        <div className="mb-8 flex items-center justify-between border-b border-mint-200 pb-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-forest-600">
            <span className="h-2 w-2 rounded-full bg-forest" />
            CATÁLOGO DISPONIBLE • CATEGORÍA CORONAS FÚNEBRES ({products.length})
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <CoronaCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 text-center border border-mint-200">
            <HeartHandshake size={36} className="mx-auto text-forest/40 mb-3" />
            <h2 className="font-serif text-xl text-forest-800">No hay coronas fúnebres activas</h2>
            <p className="mt-2 text-xs text-forest-600">
              Actualmente no hay productos registrados en la categoría de Coronas Fúnebres. Puedes agregarlos desde el panel de administración.
            </p>
          </div>
        )}
      </section>

      <Manifesto bleed eyebrow="COMPROMISO & RESPETO • ALMA DE FLOR" quote="Acompañamos los momentos más difíciles con delicadeza, solemnidad y compromiso puntual." text="Coordinamos directamente con los tanatorios y capillas ardientes de toda La Rioja para asegurar una entrega a tiempo con el debido respeto." />
    </div>
  );
}
