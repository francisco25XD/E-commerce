"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, LogIn, UserPlus, Eye, EyeOff, ShoppingBag } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCheckoutRedirect = redirectParam.includes("/checkout");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales incorrectas");
      }

      // Redirigir al destino previsto (ej. /checkout) o a su cuenta/admin
      const destination = redirectParam || (data.redirect || "/cuenta");
      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <span className="text-4xl transition-transform group-hover:scale-110">🌺</span>
          <div className="text-left">
            <span className="block font-serif text-2xl text-forest font-semibold leading-tight">
              Alma de Flor
            </span>
            <span className="block text-[9px] tracking-[0.25em] text-forest-600 font-semibold">
              LA RIOJA • CUENTA
            </span>
          </div>
        </Link>
        <h2 className="mt-2 text-3xl font-serif text-forest-900 font-bold">
          {isCheckoutRedirect ? "Inicia Sesión para Continuar tu Compra" : "Iniciar Sesión"}
        </h2>
        <p className="mt-2 text-sm text-forest-700">
          {isCheckoutRedirect
            ? "Accede con tu cuenta para procesar tu pedido con tus productos seleccionados."
            : "Accede a tu cuenta para ver tu carrito, actualizar tus datos y enviar comentarios."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-mint-200 rounded-3xl sm:px-10">
          {/* Banner si viene de checkout */}
          {isCheckoutRedirect && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
              <span className="text-2xl shrink-0">🌸</span>
              <div className="space-y-1">
                <p className="font-semibold text-amber-950">
                  Accede a tu cuenta de cliente
                </p>
                <p className="text-amber-800 leading-relaxed text-xs">
                  Para comprar flores en Alma de Flor requerimos que estés registrado. Ingresa tus datos para continuar directamente con el pago.
                </p>
                <div className="pt-1 text-xs">
                  ¿Aún no te has registrado?{" "}
                  <Link
                    href={`/registro?redirect=${encodeURIComponent(redirectParam)}`}
                    className="font-bold text-forest underline hover:text-forest-900"
                  >
                    Crear cuenta aquí →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-3">
              <span className="text-base shrink-0">⚠️</span>
              <div>{error}</div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-forest-500 hover:text-forest-800 transition focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-forest hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    {isCheckoutRedirect ? <ShoppingBag size={16} /> : <LogIn size={16} />}
                    {isCheckoutRedirect ? "Entrar y Continuar Pedido" : "Entrar a mi Cuenta"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-mint-100 space-y-3 text-center">
            <p className="text-xs text-forest-700">¿No tienes una cuenta aún?</p>
            <Link
              href={redirectParam ? `/registro?redirect=${encodeURIComponent(redirectParam)}` : "/registro"}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-forest text-xs font-semibold text-forest hover:bg-forest hover:text-white transition"
            >
              <UserPlus size={15} />
              <span>Registrarse como nuevo usuario</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-3 border-forest border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
