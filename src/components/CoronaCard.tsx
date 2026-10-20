"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShoppingBag, HeartHandshake, PenLine } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { money } from "@/lib/types";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";

export default function CoronaCard({ p }: { p: ProductDTO }) {
  const router = useRouter();
  const { add, setOpen } = useCart();
  const validVariants = (p.variants || []).filter(
    (v) => !v.label.toLowerCase().includes("estándar") && !v.label.toLowerCase().includes("estandar")
  );
  const hasVariants = validVariants.length > 1;
  const def = validVariants.find((v) => v.isDefault) ?? validVariants[0];
  const [variantId, setVariantId] = useState<number | null>(def?.id ?? null);
  const [withRibbon, setWithRibbon] = useState(true);
  const variant = validVariants.find((v) => v.id === variantId);
  const price = p.priceCents + (variant?.extraCents ?? 0);
  const compare = p.compareCents ? p.compareCents + (variant?.extraCents ?? 0) : null;

  const addToCart = () =>
    add({
      productId: p.id,
      name: p.name,
      image: p.image,
      variantId: variant?.id ?? null,
      variant: variant?.label ?? null,
      unitCents: price,
      quantity: 1,
      deliveryDate: null,
      dedicatoria: withRibbon,
      description: p.catalogDescription ?? p.description,
    });

  const buyNow = () => {
    if (addToCart()) {
      router.push("/checkout");
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-md bg-white shadow-[0_1px_3px_rgba(4,38,26,0.08)] border border-mint-200/50 hover:shadow-md transition-shadow">
      <div className="aspect-[4/5] w-full relative bg-cream/40">
        <ProductImage src={p.image} alt={p.name} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-sm bg-forest/90 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white">
          ENTREGA URGENTE TANATORIO
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-forest-600">
          <span>{p.catalogTag ?? p.tag ?? "CORONA FÚNEBRE"}</span>
          <span className="inline-flex items-center gap-1 text-forest-700">
            <HeartHandshake size={12} /> Condolencias
          </span>
        </div>

        <h3 className="mt-2 font-serif text-xl leading-tight text-forest-900">{p.name}</h3>
        <p className="mt-2 text-xs leading-relaxed text-forest-700/80 whitespace-pre-line flex-1">
          {p.catalogDescription ?? p.description}
        </p>

        {hasVariants && (
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-forest-600 mb-1.5">
              {p.variantLabel && !["tamaño", "estándar", "estandar"].includes(p.variantLabel.toLowerCase())
                ? p.variantLabel
                : "Unidades"}:
            </p>
            <div className={`grid gap-1 rounded-sm bg-mint-100/60 p-1 ${validVariants.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
              {validVariants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={v.id === variantId}
                  className={`rounded-sm py-1.5 text-[11px] font-medium transition-colors ${
                    v.id === variantId ? "bg-forest text-white" : "text-forest-700 hover:bg-white"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-sm bg-mint-100/40 p-2.5 text-[11px] text-forest-700 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={withRibbon}
              onChange={(e) => setWithRibbon(e.target.checked)}
              className="accent-forest rounded h-3.5 w-3.5"
            />
            <span className="flex items-center gap-1.5 font-medium text-forest-800">
              <PenLine size={12} className="text-forest" /> Cinta o banda con dedicatoria incluida
            </span>
          </label>
        </div>

        <div className="mt-4 pt-3 border-t border-mint-200/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-forest-600 block">Precio final</span>
            <p className="font-serif text-2xl font-semibold text-forest-900">
              {money(price)}
              {compare && (
                <span className="ml-2 font-sans text-xs text-forest-600 line-through">
                  {money(compare)}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (addToCart()) {
                  setOpen(true);
                }
              }}
              className="flex items-center gap-1.5 rounded-sm border border-forest px-3.5 py-2 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition-colors"
              title="Añadir al carrito"
            >
              <Plus size={14} /> Añadir
            </button>
            <button
              type="button"
              onClick={buyNow}
              className="flex items-center gap-1.5 rounded-sm bg-forest px-4 py-2 text-xs font-semibold text-white hover:bg-forest/90 transition-colors shadow-sm"
            >
              <ShoppingBag size={13} /> Comprar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
