"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShoppingBag, Star } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { formatRating, money } from "@/lib/types";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";

function FlashCard({ p }: { p: ProductDTO }) {
  const router = useRouter();
  const { add } = useCart();
  const validVariants = (p.variants || []).filter(
    (v) => !v.label.toLowerCase().includes("estándar") && !v.label.toLowerCase().includes("estandar")
  );
  const hasVariants = validVariants.length > 1;
  const def = validVariants.find((v) => v.isDefault) ?? validVariants[0];
  const [variantId, setVariantId] = useState<number | null>(def?.id ?? null);
  const variant = validVariants.find((v) => v.id === variantId);
  const price = p.priceCents + (variant?.extraCents ?? 0);
  const compare = p.compareCents ? p.compareCents + (variant?.extraCents ?? 0) : null;

  const buy = () => {
    const ok = add({
      productId: p.id, name: p.name, image: p.image,
      variantId: variant?.id ?? null, variant: variant?.label ?? null,
      unitCents: price, quantity: 1, deliveryDate: null, dedicatoria: false,
      description: p.catalogDescription ?? p.description,
    });
    if (ok) {
      router.push("/checkout");
    }
  };

  return (
    <article className="w-[290px] shrink-0 snap-start overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="relative h-[362px]">
        <ProductImage src={p.image} alt={p.name} className="h-full w-full" />
        {p.discountPct && (
          <span className="absolute left-3 top-3 rounded-sm bg-rosewood px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
            -{p.discountPct}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-[10px] tracking-wider text-forest-600">
          <span>{p.tag}</span>
          {p.rating && (
            <span className="flex items-center gap-1 font-semibold text-forest">
              <Star size={10} className="fill-amber-500 text-amber-500" /> {formatRating(p.rating)}
            </span>
          )}
        </div>
        <h3 className="mt-1 font-serif text-xl leading-tight">{p.name}</h3>
        <div className="mt-2 flex items-baseline justify-between">
          <p>
            <span className="text-base font-bold">{money(price)}</span>{" "}
            {compare && <span className="text-xs text-forest-600 line-through">{money(compare)}</span>}
          </p>
          {compare && <span className="text-[11px] text-forest-600">Ahorras {money(compare - price)}</span>}
        </div>
        {hasVariants && (
          <>
            <p className="mt-4 text-[10px] uppercase tracking-wider text-forest-600">
              {p.variantLabel && !["tamaño", "estándar", "estandar"].includes(p.variantLabel.toLowerCase())
                ? p.variantLabel
                : "Unidades"}:
            </p>
            <div className={`mt-2 grid gap-1 rounded-sm bg-mint-100/60 p-1 ${validVariants.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
              {validVariants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-sm py-1.5 text-[11px] font-medium transition ${v.id === variantId ? "bg-forest text-white" : "bg-mint-100 text-forest-700 hover:bg-white"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </>
        )}
        <button onClick={buy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-forest py-2.5 text-xs font-semibold text-white">
          <ShoppingBag size={13} /> Comprar en 1 click
        </button>
      </div>
    </article>
  );
}

export default function FlashOffers({ products }: { products: ProductDTO[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 310, behavior: "smooth" });
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-24" id="ofertas">
      <span className="inline-flex items-center gap-1 rounded-sm bg-rose-100 px-2 py-1 text-[10px] font-semibold tracking-wider text-rosewood">
        ⏱ OFERTAS FLASH DEL TALLER
      </span>
      <div className="mt-3 flex items-start justify-between gap-6">
        <div>
          <h2 className="font-serif text-4xl">Ofertas de Temporada &amp; Descuentos Especiales</h2>
          <p className="mt-3 max-w-md text-sm text-forest-700">
            Ediciones florales curadas con precio preferencial. Las cosechas diarias son reducidas para certificar la máxima frescura botánica.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="rounded bg-white p-2.5 shadow-sm" aria-label="Anterior"><ArrowLeft size={14} /></button>
          <button onClick={() => scroll(1)} className="rounded bg-white p-2.5 shadow-sm" aria-label="Siguiente"><ArrowRight size={14} /></button>
        </div>
      </div>
      <div ref={ref} className="mt-8 flex snap-x gap-6 overflow-x-auto no-scrollbar">
        {products.map((p) => <FlashCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
