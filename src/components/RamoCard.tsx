"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShoppingBag, Star } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { formatRating, money } from "@/lib/types";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";

export default function RamoCard({ p }: { p: ProductDTO }) {
  const router = useRouter();
  const { add, setOpen } = useCart();
  const validVariants = (p.variants || []).filter(
    (v) => !v.label.toLowerCase().includes("estándar") && !v.label.toLowerCase().includes("estandar")
  );
  const hasVariants = validVariants.length > 1;
  const def = validVariants.find((v) => v.isDefault) ?? validVariants[0];
  const [variantId, setVariantId] = useState<number | null>(def?.id ?? null);
  const variant = validVariants.find((v) => v.id === variantId);
  const price = p.priceCents + (variant?.extraCents ?? 0);
  const compare = p.compareCents ? p.compareCents + (variant?.extraCents ?? 0) : null;

  const addToCart = () =>
    add({
      productId: p.id, name: p.name, image: p.image,
      variantId: variant?.id ?? null, variant: variant?.label ?? null,
      unitCents: price, quantity: 1, deliveryDate: null, dedicatoria: false,
      description: p.description,
    });

  return (
    <article className="self-start overflow-hidden rounded-md bg-white shadow-[0_1px_3px_rgba(4,38,26,0.08)]">
      <div className="aspect-[4/5] w-full">
        <ProductImage src={p.image} alt={p.name} className="h-full w-full" />
      </div>
      <div className="px-4 pb-4 pt-3">
        <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-forest-600">
          <span>{p.tag}</span>
          {p.rating && (
            <span className="flex items-center gap-1 text-forest">
              <Star size={10} className="fill-forest text-forest" /> {formatRating(p.rating)}
            </span>
          )}
        </div>
        <h3 className="mt-1 font-serif text-xl leading-tight">{p.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-forest-700/80">{p.description}</p>

        <div className={`flex items-center justify-between ${hasVariants ? "mt-4" : "mt-6"}`}>
          <p className="font-serif text-xl">
            {money(price)}{" "}
            {compare && <span className="font-sans text-[11px] text-forest-600 line-through">{money(compare)}</span>}
          </p>
          {hasVariants && compare ? (
            <span className="rounded-sm bg-mint-200 px-2 py-1 text-[10px] font-semibold text-forest-600">
              Ahorras {money(compare - price)}
            </span>
          ) : (
            !hasVariants && (
              <button
                onClick={() => {
                  if (addToCart()) setOpen(true);
                }}
                className="flex items-center gap-1 rounded-sm bg-forest px-4 py-2 text-xs font-semibold text-white"
              >
                <Plus size={12} /> Añadir
              </button>
            )
          )}
        </div>

        {hasVariants && (
          <>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-forest-600">
              {p.variantLabel && !["tamaño", "estándar", "estandar"].includes(p.variantLabel.toLowerCase())
                ? p.variantLabel
                : "Unidades"}:
            </p>
            <div
              className={`mt-2 grid gap-1 rounded-sm bg-mint-100/60 p-1 ${
                validVariants.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
              }`}
            >
              {validVariants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={v.id === variantId}
                  className={`rounded-sm py-1.5 text-[11px] font-medium transition ${
                    v.id === variantId ? "bg-forest text-white" : "text-forest-700 hover:bg-white/60"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (addToCart()) router.push("/checkout");
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-forest py-2.5 text-xs font-semibold text-white"
            >
              <ShoppingBag size={13} /> Comprar en 1 click
            </button>
          </>
        )}
      </div>
    </article>
  );
}
