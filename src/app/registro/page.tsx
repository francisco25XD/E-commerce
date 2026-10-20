"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Calendar, Lock, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff, ShoppingBag } from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          fecha_nacimiento: formData.fecha_nacimiento,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      // Redirigir al destino previsto (ej. /checkout para continuar la compra) o a su cuenta
      const destination = redirectParam || "/cuenta";
      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al procesar el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  const isCheckoutRedirect = redirectParam.includes("/checkout");

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
          <span className="text-4xl transition-transform group-hover:scale-110">🌺</span>
          <div className="text-left">
            <span className="block font-serif text-2xl text-forest font-semibold leading-tight">
              Alma de Flor
            </span>
            <span className="block text-[9px] tracking-[0.25em] text-forest-600 font-semibold">
              LA RIOJA • REGISTRO
            </span>
          </div>
        </Link>
        <h1 className="mt-2 text-3xl font-serif text-forest-900 font-bold">
          {isCheckoutRedirect ? "Regístrate para Completar tu Compra" : "Crea tu Cuenta de Cliente"}
        </h1>
        <p className="mt-2 text-sm text-forest-700 max-w-md mx-auto">
          {isCheckoutRedirect
            ? "Para comprar en Alma de Flor y asegurar el seguimiento de tu pedido floral, es necesario registrarte o iniciar sesión."
            : "Regístrate para guardar tu carrito, consultar tus pedidos y enviar comentarios directamente a nuestro taller."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-mint-200 rounded-3xl sm:px-10">
          {/* Banner especial si fue redirigido desde el proceso de compra */}
          {isCheckoutRedirect && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
              <span className="text-2xl shrink-0">🌸</span>
              <div className="space-y-1">
                <p className="font-semibold text-amber-950">
                  ¡Tus flores seleccionadas te están esperando!
                </p>
                <p className="text-amber-800 leading-relaxed text-xs">
                  Las compras están reservadas exclusivamente a usuarios registrados. Crea tu cuenta en un minuto y continuarás directo al pago con tus artículos guardados.
                </p>
                <div className="pt-1 text-xs">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    href={`/login?redirect=${encodeURIComponent(redirectParam)}`}
                    className="font-bold text-forest underline hover:text-forest-900"
                  >
                    Inicia sesión aquí →
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Nombre *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    name="nombre"
                    placeholder="Ej. María"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Apellido *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    name="apellido"
                    placeholder="Ej. González"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Correo Electrónico (Mail) *
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>
            </div>

            {/* Teléfono y Fecha de Nacimiento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Número de Teléfono *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    required
                    name="telefono"
                    placeholder="+34 600 123 456"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Fecha de Nacimiento *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    required
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>
            </div>

            {/* Contraseña y Confirmación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Contraseña *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Confirmar Contraseña *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    name="confirmPassword"
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-forest-500 hover:text-forest-800 transition focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-forest hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Creando tu cuenta...
                  </>
                ) : (
                  <>
                    {isCheckoutRedirect ? <ShoppingBag size={17} /> : <ShieldCheck size={17} />}
                    {isCheckoutRedirect ? "Completar Registro y Continuar Compra" : "Registrarme en Alma de Flor"}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-mint-100 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
            <span className="text-forest-600">¿Ya tienes una cuenta registrada?</span>
            <Link
              href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : "/login"}
              className="font-semibold text-forest hover:text-forest-800 underline underline-offset-4"
            >
              Iniciar sesión aquí →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-3 border-forest border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
