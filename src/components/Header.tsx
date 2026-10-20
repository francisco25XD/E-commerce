"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User, Shield, UserPlus, LogIn, LogOut } from "lucide-react";
import { useCart } from "./CartProvider";

const navLinks = [
  ["Quiénes Somos", "/quienes-somos"],
  ["Ramos", "/ramos"],
  ["Arreglos Florales", "/arreglos-florales"],
  ["Rosas", "/rosas"],
  ["Coronas Fúnebres", "/coronas-funebres"],
  ["Eventos", "/eventos"],
  ["Contacto", "/contacto"],
] as const;

interface SessionData {
  authenticated: boolean;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  } | null;
}

export default function Header() {
  const router = useRouter();
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<SessionData>({
    authenticated: false,
    user: null,
  });

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      } else {
        setSession({ authenticated: false, user: null });
      }
    } catch {
      setSession({ authenticated: false, user: null });
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  useEffect(() => {
    if (userMenuOpen) {
      checkSession();
    }
  }, [userMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession({ authenticated: false, user: null });
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const link = ([label, href]: readonly [string, string]) => {
    const active = href === pathname;
    return (
      <li key={label}>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={`whitespace-nowrap border-b-2 pb-1 text-[13px] transition-colors ${
            active ? "border-forest font-semibold text-forest" : "border-transparent text-forest-700 hover:text-forest"
          }`}
        >
          {label}
        </Link>
      </li>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-mint-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="text-3xl">🌺</span>
          <span className="leading-none">
            <span className="block font-serif text-xl">Alma de Flor</span>
            <span className="block text-[9px] tracking-[0.3em] text-forest-600">LA RIOJA •</span>
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center lg:flex" aria-label="Principal">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navLinks.map(link)}
          </ul>
        </nav>

        <div className="flex items-center gap-4 text-forest">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir carrito"
            className="relative"
            title={session.authenticated ? "Ver mi carrito" : "Carrito exclusivo para usuarios registrados"}
          >
            <ShoppingBag size={16} />
            {session.authenticated && count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[9px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>

          {/* Menú de Usuario / Cuenta */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-label="Menú de usuario"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest hover:bg-forest-800 text-white transition shadow-xs"
              title="Acceso a tu Cuenta"
            >
              <User size={14} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-mint-200 shadow-lg py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 border-b border-mint-100 font-semibold text-forest-800 text-[11px] uppercase tracking-wider flex items-center justify-between">
                  <span>Acceso a tu Cuenta</span>
                  {session.authenticated && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-mint-100 text-forest lowercase">
                      {session.user?.rol === "admin" ? "admin" : "cliente"}
                    </span>
                  )}
                </div>

                {/* CASO 1: Si es el Administrador */}
                {session.authenticated && session.user?.rol === "admin" && (
                  <div className="py-1">
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-forest-800 hover:bg-mint-50 hover:text-forest transition font-medium"
                    >
                      <Shield size={14} className="text-forest shrink-0" />
                      <span>Panel del Administrador</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-red-600 hover:bg-red-50 transition text-left font-medium"
                    >
                      <LogOut size={14} className="shrink-0" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}

                {/* CASO 2: Si el usuario está login (Cliente) */}
                {session.authenticated && session.user?.rol !== "admin" && (
                  <div className="py-1">
                    <Link
                      href="/cuenta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-forest-800 hover:bg-mint-50 hover:text-forest transition font-medium"
                    >
                      <User size={14} className="text-forest shrink-0" />
                      <span>Mi Cuenta y Carrito</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-red-600 hover:bg-red-50 transition text-left font-medium"
                    >
                      <LogOut size={14} className="shrink-0" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}

                {/* CASO 3: Si NO estuviera login */}
                {!session.authenticated && (
                  <div className="py-1">
                    <Link
                      href="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-forest-800 hover:bg-mint-50 hover:text-forest transition font-medium"
                    >
                      <LogIn size={14} className="text-forest shrink-0" />
                      <span>Iniciar sesión</span>
                    </Link>
                    <Link
                      href="/registro"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-forest-800 hover:bg-mint-50 hover:text-forest transition font-medium"
                    >
                      <UserPlus size={14} className="text-forest shrink-0" />
                      <span>Nuevo Registro</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegación en móvil */}
      <nav className="overflow-x-auto px-6 pb-2 no-scrollbar lg:hidden" aria-label="Principal móvil">
        <ul className="flex gap-6">{navLinks.map(link)}</ul>
      </nav>
    </header>
  );
}
