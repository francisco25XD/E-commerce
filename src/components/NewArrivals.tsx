"use client";

import { Plus } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { money } from "@/lib/types";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";

function NewCard({ p }: { p: ProductDTO }) {
  const { add, setOpen } = useCart();
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="relative h-[264px]">
          <ProductImage src={p.image} alt={p.name} className="h-full w-full" />
          <span className="absolute left-3 top-3 rounded-sm bg-forest px-2 py-1 text-[10px] font-semibold tracking-wide text-white">NUEVO</span>
        </div>
        <div className="p-4 pb-0">
          <p className="text-[10px] tracking-wider text-forest-600">{p.tag}</p>
          <h3 className="mt-1 font-serif text-xl leading-tight">{p.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-forest-600">{p.description}</p>
        </div>
      </div>
      <div className="p-4 pt-4 flex items-center justify-between mt-2">
        <span className="text-lg font-bold">{money(p.priceCents)}</span>
        <button
          onClick={() => {
            const ok = add({
              productId: p.id, name: p.name, image: p.image, variantId: null, variant: null,
              unitCents: p.priceCents, quantity: 1, deliveryDate: null, dedicatoria: false,
              description: p.catalogDescription ?? p.description,
            });
            if (ok) {
              setOpen(true);
            }
          }}
          className="flex items-center gap-1 rounded-sm bg-forest px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest/90 transition"
        >
          <Plus size={12} /> Añadir
        </button>
      </div>
    </article>
  );
}

export default function NewArrivals({ products }: { products: ProductDTO[] }) {
  return (
    <section className="bg-mint-100/70 py-20" id="nuevos">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="text-center">
          <span className="rounded-sm bg-mint-300 px-3 py-1 text-[10px] font-semibold tracking-widest text-forest-600">COSECHA DE ESTA SEMANA</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl">Recién Llegados de los Invernaderos - Flores de Temporada</h2>
          <p className="mt-3 text-sm text-forest-700">Nuevas siluetas botánicas creadas esta mañana por nuestro equipo de floristas en residencia.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <NewCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
