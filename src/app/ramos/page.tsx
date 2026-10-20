import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import { loadProducts } from "@/lib/products";
import RamoCard from "@/components/RamoCard";
import Manifesto from "@/components/Manifesto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ramos Silvestres y de Temporada — Alma de Flor",
  description: "Composiciones vivas atadas a mano en nuestro taller de Logroño. Entrega en el mismo día.",
};

// Orden de presentación (los que no estén en la lista van al final, por id).
const ORDER = [
  "ramo-silvestre-amanecer",
  "bouquet-toscana-girasoles",
  "cesta-rustica-silvestre",
  "pastel-dulce-encanto",
  "bouquet-lavanda-olivo-imperial",
  "ramo-hortensias-del-norte",
];

export default async function RamosPage() {
  const all = await loadProducts({ category: { slug: "ramos" } });
  const rank = (slug: string) => {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
  };
  const products = [...all].sort((a, b) => rank(a.slug) - rank(b.slug));

  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-[1240px] px-6 pb-16 pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-mint-200 px-2 py-1 text-[10px] font-semibold tracking-wider text-forest-600">
          <Leaf size={11} /> COLECCIÓN BOTÁNICA • TEMPORADA RIOJANA
        </span>
        <h1 className="mt-4 font-serif text-5xl">Ramos Silvestres y de Temporada</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-forest-700">
          Composiciones vivas atadas a mano en nuestro taller de Logroño. Seleccionamos variedades hortícolas de proximidad, recolectadas al despuntar el día para garantizar aromas francos y máxima longevidad en jarrón.
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-24 pt-10">
        <p className="mb-6 flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-forest-600">
          <span className="h-1.5 w-1.5 rounded-full bg-forest" /> COSECHA DE HOY • ENTREGA EN EL MISMO DÍA
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <RamoCard key={p.id} p={p} />)}
        </div>
        {products.length === 0 && (
          <p className="text-sm text-forest-600">Todavía no hay ramos cargados. Ejecutá <code>npm run db:setup</code>.</p>
        )}
      </section>

      <Manifesto bleed />
    </div>
  );
}
