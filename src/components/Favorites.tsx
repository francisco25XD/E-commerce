"use client";

import { useState } from "react";
import { PenLine, Star } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { money } from "@/lib/types";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";

function FavCard({ p }: { p: ProductDTO }) {
  const { add, setOpen } = useCart();
  const [dedicatoria, setDedicatoria] = useState(false);
  const addToCart = (withNote: boolean) => {
    const ok = add({
      productId: p.id, name: p.name, image: p.image, variantId: null, variant: null,
      unitCents: p.priceCents, quantity: 1, deliveryDate: null, dedicatoria: withNote,
      description: p.catalogDescription ?? p.description,
    });
    if (ok) {
      setOpen(true);
    }
  };
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="h-[264px]">
        <ProductImage src={p.image} alt={p.name} className="h-full w-full" />
      </div>
      <div className="p-4">
        <p className="flex items-center gap-1 text-[11px] font-semibold">
          <Star size={10} className="fill-amber-500 text-amber-500" /> {p.rating?.toFixed(2)}
        </p>
        <h3 className="mt-1 font-serif text-xl leading-tight">{p.name}</h3>
        <p className="mt-1 border-b border-mint-100 pb-3 text-xs text-forest-600">{p.description}</p>
        <p className="mt-3 text-lg font-bold">{money(p.priceCents)}</p>
        <label className="mt-2 flex cursor-pointer items-start gap-2 text-xs text-forest-600 underline">
          <PenLine size={12} className="mt-0.5 shrink-0" />
          <input type="checkbox" className="sr-only" checked={dedicatoria} onChange={(e) => setDedicatoria(e.target.checked)} />
          <span className={dedicatoria ? "font-semibold text-forest" : ""}>Agregar dedicatoria caligráfica gratis</span>
        </label>
        <button onClick={() => addToCart(dedicatoria)} className="mt-3 w-full rounded-sm bg-forest py-2 text-xs font-semibold text-white">
          Añadir al carrito
        </button>
      </div>
    </article>
  );
}

export default function Favorites({ products }: { products: ProductDTO[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20" id="favoritos">
      <h2 className="font-serif text-4xl">Los Favoritos de Nuestra Comunidad</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => <FavCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
