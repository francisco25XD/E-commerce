// Formato de moneda: Peso Argentino ($)
export const money = (cents: number) => {
  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return `$ ${formatted}`;
};

export type VariantDTO = { id: number; label: string; extraCents: number; isDefault: boolean };

export type ProductDTO = {
  id: number;
  slug: string;
  name: string;
  tag: string;
  description: string;
  priceCents: number;
  compareCents: number | null;
  discountPct: number | null;
  rating: number | null;
  image: string;
  variantLabel: string | null;
  catalogName: string | null;
  catalogTag: string | null;
  catalogDescription: string | null;
  perk: string | null;
  perkIcon: string | null;
  variants: VariantDTO[];
};

// 4.9 -> "4.9", 5 -> "5.0", 4.88 -> "4.88"
export const formatRating = (r: number) => r.toFixed(2).replace(/0$/, "");

export type CartItem = {
  key: string;
  productId: number;
  name: string;
  image: string;
  variantId: number | null;
  variant: string | null;
  unitCents: number; // solo informativo; el servidor recalcula
  quantity: number;
  deliveryDate: string | null;
  dedicatoria: boolean;
  description?: string;
};

export const todayISO = () => new Date().toISOString().slice(0, 10);
