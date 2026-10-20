"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { CartItem } from "@/lib/types";

type UserData = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

type Ctx = {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (item: Omit<CartItem, "key">) => boolean;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: UserData | null;
  checkAuth: () => Promise<boolean>;
};

const CartCtx = createContext<Ctx | null>(null);
const PENDING_STORAGE = "alma-pending-cart-item";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [auth, setAuth] = useState<{
    ready: boolean;
    authenticated: boolean;
    user: UserData | null;
  }>({
    ready: false,
    authenticated: false,
    user: null,
  });

  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // Verificar estado de sesión
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAuth({ ready: true, authenticated: true, user: data.user });
          return true;
        }
      }
      setAuth({ ready: true, authenticated: false, user: null });
      return false;
    } catch {
      setAuth({ ready: true, authenticated: false, user: null });
      return false;
    }
  }, []);

  // Verificar autenticación al montar y cada vez que cambia la ruta
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  // Cargar carrito exclusivo del usuario al estar autenticado
  useEffect(() => {
    if (!auth.ready) return;

    if (!auth.authenticated || !auth.user) {
      // Si el usuario no está registrado o conectado, el carrito está inactivo / vacío
      setItems([]);
      return;
    }

    const storageKey = `alma-cart-user-${auth.user.id}`;
    let loadedItems: CartItem[] = [];

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        loadedItems = JSON.parse(raw);
      }
    } catch {
      loadedItems = [];
    }

    // Si había un producto pendiente que intentó añadir antes de registrarse o iniciar sesión
    try {
      const pendingRaw = sessionStorage.getItem(PENDING_STORAGE);
      if (pendingRaw) {
        const pendingItem = JSON.parse(pendingRaw);
        sessionStorage.removeItem(PENDING_STORAGE);

        const key = `${pendingItem.productId}-${pendingItem.variantId ?? 0}-${pendingItem.deliveryDate ?? ""}-${pendingItem.dedicatoria}`;
        const existingIdx = loadedItems.findIndex((i) => i.key === key);

        if (existingIdx >= 0) {
          loadedItems[existingIdx].quantity += pendingItem.quantity;
        } else {
          loadedItems.push({ ...pendingItem, key });
        }
      }
    } catch {}

    setItems(loadedItems);
  }, [auth.ready, auth.authenticated, auth.user?.id]);

  // Guardar cambios en el carrito del usuario autenticado
  useEffect(() => {
    if (!auth.ready || !auth.authenticated || !auth.user) return;
    const storageKey = `alma-cart-user-${auth.user.id}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  }, [items, auth.ready, auth.authenticated, auth.user?.id]);

  // Función para añadir al carrito (SOLO si está registrado y con login)
  const add = useCallback(
    (item: Omit<CartItem, "key">): boolean => {
      // Si no está registrado o no ha iniciado sesión, se bloquea y se redirige a registro
      if (!auth.authenticated) {
        try {
          sessionStorage.setItem(PENDING_STORAGE, JSON.stringify(item));
        } catch {}
        router.push("/registro?redirect=/checkout");
        return false;
      }

      const key = `${item.productId}-${item.variantId ?? 0}-${item.deliveryDate ?? ""}-${item.dedicatoria}`;
      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) {
          return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i));
        }
        return [...prev, { ...item, key }];
      });
      return true;
    },
    [auth.authenticated, router]
  );

  // Quitar producto (solo autenticado)
  const remove = useCallback(
    (key: string) => {
      if (!auth.authenticated) return;
      setItems((p) => p.filter((i) => i.key !== key));
    },
    [auth.authenticated]
  );

  // Modificar cantidad (solo autenticado)
  const setQty = useCallback(
    (key: string, qty: number) => {
      if (!auth.authenticated) return;
      setItems((p) =>
        qty <= 0
          ? p.filter((i) => i.key !== key)
          : p.map((i) => (i.key === key ? { ...i, quantity: qty } : i))
      );
    },
    [auth.authenticated]
  );

  // Vaciar carrito
  const clear = useCallback(() => {
    if (!auth.authenticated) return;
    setItems([]);
  }, [auth.authenticated]);

  const value = useMemo<Ctx>(
    () => ({
      items: auth.authenticated ? items : [],
      count: auth.authenticated ? items.reduce((s, i) => s + i.quantity, 0) : 0,
      totalCents: auth.authenticated ? items.reduce((s, i) => s + i.quantity * i.unitCents, 0) : 0,
      add,
      remove,
      setQty,
      clear,
      open,
      setOpen,
      isAuthenticated: auth.authenticated,
      isAuthLoading: !auth.ready,
      user: auth.user,
      checkAuth,
    }),
    [items, auth.authenticated, auth.ready, auth.user, add, remove, setQty, clear, open, checkAuth]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
