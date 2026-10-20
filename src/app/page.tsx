import Link from "next/link";
import { loadProducts } from "@/lib/products";
import FlashOffers from "@/components/FlashOffers";
import NewArrivals from "@/components/NewArrivals";
import Favorites from "@/components/Favorites";
import Manifesto from "@/components/Manifesto";
import CoronaCard from "@/components/CoronaCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [flash, fresh, favs, coronas] = await Promise.all([
    loadProducts({ isFlash: true }),
    loadProducts({ isNew: true }),
    loadProducts({ isFavorite: true }),
    loadProducts({ category: { slug: "coronas-funebres" } }),
  ]);

  return (
    <>
      <FlashOffers products={flash} />
      <NewArrivals products={fresh} />
      <Favorites products={favs} />

      {coronas.length > 0 && (
        <section id="coronas" className="bg-[#f5f4ef] py-16 border-t border-mint-200/60">
          <div className="mx-auto max-w-[1240px] px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="rounded-sm bg-mint-300 px-3 py-1 text-[10px] font-semibold tracking-widest text-forest-700">
                  SERVICIO SOLEMNE & TANATORIOS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-forest-900">
                  Coronas Fúnebres y Condolencias
                </h2>
                <p className="mt-2 text-sm text-forest-700 max-w-xl">
                  Arreglos florales solemnes de máxima calidad y respeto. Entrega urgente y puntual en tanatorios de La Rioja.
                </p>
              </div>
              <Link
                href="/coronas-funebres"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-800 underline underline-offset-4 self-start sm:self-end"
              >
                Ver colección completa de coronas →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coronas.map((p) => (
                <CoronaCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Manifesto />
      <footer id="contacto" className="border-t border-mint-200 py-8 text-center text-xs text-forest-600">
        © {new Date().getFullYear()} Alma de Flor · La Rioja
      </footer>
    </>
  );
}
