"use client";

import Link from "next/link";
import { Minus, Plus, X, Lock, LogIn, UserPlus } from "lucide-react";
import { useCart } from "./CartProvider";
import { money } from "@/lib/types";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { open, setOpen, items, setQty, remove, totalCents, isAuthenticated } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-forest/40" onClick={() => setOpen(false)} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-mint-200 p-5">
          <h2 className="font-serif text-2xl">Tu carrito</h2>
          <button onClick={() => setOpen(false)} aria-label="Cerrar"><X size={20} /></button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#faf9f5]">
            <div className="h-16 w-16 rounded-full bg-mint-100 border border-mint-200 flex items-center justify-center text-forest mb-4 shadow-xs">
              <Lock size={26} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest-900 mb-2">
              Carrito para Clientes Registrados
            </h3>
            <p className="text-xs text-forest-700 leading-relaxed max-w-xs mb-6">
              Para poder interactuar con el carrito, añadir flores artesanales y tramitar pedidos en Alma de Flor, es necesario registrarte o iniciar sesión con tu cuenta.
            </p>
            <div className="w-full space-y-2.5">
              <Link
                href="/login?redirect=/checkout"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-800 transition shadow-xs"
              >
                <LogIn size={15} />
                <span>Iniciar Sesión</span>
              </Link>
              <Link
                href="/registro?redirect=/checkout"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-forest text-forest text-xs font-semibold hover:bg-mint-50 transition"
              >
                <UserPlus size={15} />
                <span>Crear Cuenta de Cliente</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.length === 0 && <p className="text-sm text-forest-600">Tu carrito está vacío.</p>}
              {items.map((i) => (
                <div key={i.key} className="flex gap-3">
                  <ProductImage src={i.image} alt={i.name} className="h-20 w-20 rounded" />
                  <div className="flex-1 text-sm">
                    <p className="font-serif text-lg leading-tight">{i.name}</p>
                    {i.variant && !["estándar", "estandar"].includes(i.variant.toLowerCase()) && (
                      <p className="text-xs text-forest-600">{i.variant}</p>
                    )}
                    {i.deliveryDate && <p className="text-xs text-forest-600">Entrega: {i.deliveryDate}</p>}
                    {i.dedicatoria && <p className="text-xs text-forest-600">+ Dedicatoria caligráfica</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <button className="rounded border p-1" onClick={() => setQty(i.key, i.quantity - 1)} aria-label="Menos"><Minus size={12} /></button>
                      <span className="w-5 text-center">{i.quantity}</span>
                      <button className="rounded border p-1" onClick={() => setQty(i.key, i.quantity + 1)} aria-label="Más"><Plus size={12} /></button>
                      <button className="ml-auto text-xs underline" onClick={() => remove(i.key)}>Quitar</button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{money(i.unitCents * i.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-mint-200 p-5">
              <div className="mb-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>{money(totalCents)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className={`block rounded bg-forest py-3 text-center text-sm font-semibold text-white transition hover:bg-forest-800 ${
                  items.length === 0 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
