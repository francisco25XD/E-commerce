"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  MessageSquare,
  LogOut,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Send,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/types";

interface UserData {
  id: number;
  nombre: string;
  apellido: string | null;
  email: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
  rol: string;
}

interface UserComment {
  id: number;
  producto_id: number;
  puntuacion: number;
  comentario: string | null;
  respuesta?: string | null;
  respondido_en?: string | null;
  aprobada: boolean;
  creado_en: string;
  productos?: {
    id: number;
    nombre: string;
    slug: string;
  };
}

export default function UserAccountView({ initialUser }: { initialUser: UserData }) {
  const router = useRouter();
  const { items: cartItems, setQty, remove, count, totalCents } = useCart();

  const [activeTab, setActiveTab] = useState<"carrito" | "perfil" | "comentarios">("carrito");

  // Datos de usuario
  const [user, setUser] = useState<UserData>(initialUser);
  const [profileForm, setProfileForm] = useState({
    nombre: initialUser.nombre || "",
    apellido: initialUser.apellido || "",
    telefono: initialUser.telefono || "",
    fecha_nacimiento: initialUser.fecha_nacimiento || "",
  });

  // Comentarios del usuario
  const [myComments, setMyComments] = useState<UserComment[]>([]);
  const [commentForm, setCommentForm] = useState({
    asunto: "",
    comentario: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const notify = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Cargar comentarios del usuario
  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const commentsRes = await fetch("/api/user/comments");
        if (commentsRes.ok) {
          const data = await commentsRes.json();
          setMyComments(data);
        }
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }
    };

    fetchUserComments();
  }, []);

  // Actualizar datos del formulario si initialUser cambia
  useEffect(() => {
    setUser(initialUser);
    setProfileForm({
      nombre: initialUser.nombre || "",
      apellido: initialUser.apellido || "",
      telefono: initialUser.telefono || "",
      fecha_nacimiento: initialUser.fecha_nacimiento || "",
    });
  }, [initialUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // Guardar cambios en el perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar perfil");

      setUser(data.user);
      notify("Datos personales actualizados correctamente en la base de datos");
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al actualizar", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // Enviar comentario al administrador
  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.comentario.trim()) {
      notify("Escribe tu comentario antes de enviar", "error");
      return;
    }

    setSendingComment(true);

    try {
      const res = await fetch("/api/user/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar el comentario");

      notify("¡Comentario enviado al administrador! Se encuentra en revisión.");
      setCommentForm({ comentario: "", asunto: "" });

      // Recargar lista de comentarios del usuario
      const commentsRes = await fetch("/api/user/comments");
      if (commentsRes.ok) setMyComments(await commentsRes.json());
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al enviar", "error");
    } finally {
      setSendingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-mint-50/30 text-forest-900 pb-16">
      {/* Banner Superior de Bienvenida */}
      <div className="bg-forest text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-forest-800 shadow-xs">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shrink-0">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-3xl font-bold">
                  Hola, {user.nombre} {user.apellido || ""}
                </h1>
                {user.rol === "admin" && (
                  <span className="px-2 py-0.5 rounded-full bg-mint-200 text-forest font-bold text-[10px] tracking-wider uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-mint-100 flex items-center gap-2 mt-1">
                <Mail size={13} />
                <span>{user.email}</span>
                {user.telefono && (
                  <>
                    <span className="opacity-40">•</span>
                    <Phone size={13} />
                    <span>{user.telefono}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.rol === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mint-100 text-forest hover:bg-white text-xs font-semibold transition"
              >
                <Shield size={14} />
                <span>Ir al Panel de Administración</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition"
            >
              <LogOut size={14} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notificación flotante */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm ${
              notification.type === "success"
                ? "bg-forest-900 text-white border-forest-800"
                : "bg-red-700 text-white border-red-800"
            }`}
          >
            {notification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Contenido Principal con Pestañas */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Selector de Pestañas */}
        <div className="flex border-b border-mint-200 gap-2 mb-8 bg-white p-2 rounded-2xl shadow-xs border">
          {/* Pestaña 1: Carrito */}
          <button
            onClick={() => setActiveTab("carrito")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "carrito"
                ? "bg-forest text-white shadow-xs font-semibold"
                : "text-forest-700 hover:bg-mint-50 hover:text-forest"
            }`}
          >
            <ShoppingBag size={17} />
            <span>Productos en el Carrito</span>
            {count > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "carrito" ? "bg-white/20 text-white" : "bg-forest text-white"
                }`}
              >
                {count}
              </span>
            )}
          </button>

          {/* Pestaña 2: Modificar Datos Personales */}
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "perfil"
                ? "bg-forest text-white shadow-xs font-semibold"
                : "text-forest-700 hover:bg-mint-50 hover:text-forest"
            }`}
          >
            <User size={17} />
            <span>Datos Personales</span>
          </button>

          {/* Pestaña 3: Enviar Comentarios */}
          <button
            onClick={() => setActiveTab("comentarios")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "comentarios"
                ? "bg-forest text-white shadow-xs font-semibold"
                : "text-forest-700 hover:bg-mint-50 hover:text-forest"
            }`}
          >
            <MessageSquare size={17} />
            <span>Enviar Comentarios</span>
            {myComments.length > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "comentarios" ? "bg-white/20 text-white" : "bg-mint-200 text-forest-800"
                }`}
              >
                {myComments.length}
              </span>
            )}
          </button>
        </div>

        {/* ================= APARTADO 1: PRODUCTOS EN EL CARRITO ================= */}
        {activeTab === "carrito" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-serif text-forest font-bold">
                  Tu Carrito de Flores y Arreglos
                </h2>
                <p className="text-xs text-forest-600">
                  Aquí puedes revisar, ajustar cantidades o finalizar el pedido de los productos que has seleccionado.
                </p>
              </div>

              {cartItems.length > 0 && (
                <Link
                  href="/checkout"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  <span>Tramitar Pedido ({money(totalCents)})</span>
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>

            {cartItems.length > 0 ? (
              <div className="bg-white rounded-3xl border border-mint-200 shadow-xs overflow-hidden">
                <div className="divide-y divide-mint-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.key}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-mint-50/30 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-mint-100 border border-mint-200 overflow-hidden flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-base text-forest-900">{item.name}</h3>
                          {item.variant && (
                            <p className="text-xs text-forest-600">Presentación: {item.variant}</p>
                          )}
                          {item.dedicatoria && (
                            <p className="text-xs text-mint-700 italic">✓ Incluye dedicatoria caligráfica</p>
                          )}
                          <p className="text-xs font-semibold text-forest-700 mt-1">
                            {money(item.unitCents)} c/u
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-mint-100">
                        {/* Controles de cantidad */}
                        <div className="flex items-center border border-mint-300 rounded-lg bg-mint-50/50">
                          <button
                            onClick={() => setQty(item.key, item.quantity - 1)}
                            className="p-1.5 text-forest-600 hover:text-forest transition"
                            aria-label="Disminuir"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 font-semibold text-xs text-forest-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQty(item.key, item.quantity + 1)}
                            className="p-1.5 text-forest-600 hover:text-forest transition"
                            aria-label="Aumentar"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Subtotal del ítem */}
                        <div className="text-right min-w-20">
                          <div className="text-sm font-bold text-forest">
                            {money(item.unitCents * item.quantity)}
                          </div>
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => remove(item.key)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Quitar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pie del carrito */}
                <div className="bg-mint-50/60 p-6 border-t border-mint-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-forest-700">
                    Total de artículos en tu carrito: <strong>{count} unidades</strong>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-forest-600 block">Total a pagar:</span>
                      <span className="font-serif text-2xl font-bold text-forest">{money(totalCents)}</span>
                    </div>
                    <Link
                      href="/checkout"
                      className="px-6 py-3 rounded-xl bg-forest hover:bg-forest-800 text-white font-semibold text-sm shadow-xs transition"
                    >
                      Continuar Compra
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-mint-200 shadow-xs text-center">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="font-serif font-bold text-xl text-forest mb-2">
                  Tu carrito está vacío en este momento
                </h3>
                <p className="text-sm text-forest-600 max-w-md mx-auto mb-6">
                  Descubre nuestras rosas de autor, arreglos florales artesanales y ramos de temporada cosechados en La Rioja.
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href="/ramos"
                    className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-800 text-white text-xs font-semibold transition"
                  >
                    Ver Ramos Silvestres
                  </Link>
                  <Link
                    href="/rosas"
                    className="px-4 py-2.5 rounded-xl border border-forest text-forest hover:bg-mint-50 text-xs font-semibold transition"
                  >
                    Ver Rosas de Autor
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= APARTADO 2: MODIFICAR DATOS PERSONALES ================= */}
        {activeTab === "perfil" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-forest font-bold">Datos Personales</h2>
              <p className="text-xs text-forest-600">
                Modifica tu nombre, apellido, número de teléfono y fecha de nacimiento almacenados en tu cuenta.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mint-200 shadow-xs">
              <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                      Nombre *
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                        <User size={15} />
                      </div>
                      <input
                        type="text"
                        required
                        value={profileForm.nombre}
                        onChange={(e) => setProfileForm({ ...profileForm, nombre: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                      Apellido *
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                        <User size={15} />
                      </div>
                      <input
                        type="text"
                        required
                        value={profileForm.apellido}
                        onChange={(e) => setProfileForm({ ...profileForm, apellido: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>
                </div>

                {/* Email (Solo lectura) */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                    Correo Electrónico (Mail)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full pl-10 pr-3 py-2.5 bg-mint-100/50 border border-mint-200 rounded-xl text-forest-600 text-sm cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[11px] text-forest-500 mt-1 block">
                    El correo electrónico está vinculado a tu acceso seguro.
                  </span>
                </div>

                {/* Teléfono y Fecha de Nacimiento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                      Número de Teléfono *
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                        <Phone size={15} />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="+34 600 000 000"
                        value={profileForm.telefono}
                        onChange={(e) => setProfileForm({ ...profileForm, telefono: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                      Fecha de Nacimiento *
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                        <Calendar size={15} />
                      </div>
                      <input
                        type="date"
                        required
                        value={profileForm.fecha_nacimiento}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, fecha_nacimiento: e.target.value })
                        }
                        className="w-full pl-10 pr-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-mint-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest hover:bg-forest-800 text-white font-semibold text-sm shadow-xs transition disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Guardando cambios...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= APARTADO 3: ENVIAR COMENTARIOS AL ADMINISTRADOR ================= */}
        {activeTab === "comentarios" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulario de Envío de Comentario */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-2xl font-serif text-forest font-bold">
                  Enviar Comentario al Administrador
                </h2>
                <p className="text-xs text-forest-600">
                  Tus opiniones y sugerencias llegarán directamente a la bandeja del administrador de Alma de Flor.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mint-200 shadow-xs">
                <form onSubmit={handleSendComment} className="space-y-4 text-xs">
                  {/* Asunto */}
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                      Asunto o Título del Mensaje
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Consulta o sugerencia para el atelier"
                      value={commentForm.asunto}
                      onChange={(e) => setCommentForm({ ...commentForm, asunto: e.target.value })}
                      className="w-full px-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>

                  {/* Comentario / Mensaje */}
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                      Tu Comentario o Mensaje *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Escribe tu mensaje, sugerencia o comentario para que el administrador lo reciba..."
                      value={commentForm.comentario}
                      onChange={(e) => setCommentForm({ ...commentForm, comentario: e.target.value })}
                      className="w-full px-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingComment}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-800 text-white font-semibold text-xs shadow-xs transition disabled:opacity-50"
                  >
                    {sendingComment ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Enviando al administrador...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Enviar Comentario al Administrador
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Historial de Comentarios Enviados */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="text-xl font-serif text-forest font-bold">Tus Comentarios Enviados</h3>
                <p className="text-xs text-forest-600">
                  Historial de mensajes y opiniones enviadas al administrador desde tu cuenta.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-mint-200 shadow-xs space-y-4">
                {myComments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-mint-50/40 border border-mint-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-forest-900">
                        {c.productos?.nombre ? `Comentario (${c.productos.nombre})` : "Comentario al Atelier"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.aprobada
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {c.aprobada ? "✓ Respondido por Admin" : "⌛ Pendiente de respuesta"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-forest-600 font-medium text-[11px]">
                      <span>
                        {new Date(c.creado_en).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-forest-800 italic">“{c.comentario}”</p>

                    {c.respuesta && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-forest text-cream border border-forest-800 shadow-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 font-semibold text-xs text-mint-200">
                            <span>🌺</span>
                            <span>Respuesta del Atelier Alma de Flor:</span>
                          </div>
                          {c.respondido_en && (
                            <span className="text-[10px] text-mint-200/70 font-mono">
                              {new Date(c.respondido_en).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-white text-xs leading-relaxed pl-5 whitespace-pre-wrap">
                          {c.respuesta}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {myComments.length === 0 && (
                  <div className="py-8 text-center text-forest-500 text-xs">
                    <p className="text-2xl mb-2">💬</p>
                    Aún no has enviado comentarios. ¡Usa el formulario para enviar tus sugerencias o reseñas!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
