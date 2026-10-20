"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  MessageSquare,
  Users,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Upload,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Star,
  Shield,
  Layers,
  AlertCircle,
  Check,
  RefreshCw,
  Inbox,
  Mail,
  Phone,
  Sparkles,
  Calendar,
  MessageCircle,
  Clock,
  Eye,
  EyeOff,
  Send,
  Reply,
} from "lucide-react";

interface Category {
  id: number;
  slug: string;
  nombre: string;
}

interface Product {
  id: number;
  categoria_id: number;
  sku: string;
  slug: string;
  nombre: string;
  etiqueta: string;
  descripcion: string;
  precio: number | string;
  stock: number | null;
  activo: boolean;
  es_oferta_flash: boolean;
  es_nuevo: boolean;
  es_favorito: boolean;
  categorias?: Category;
  producto_imagenes?: { id: number; url: string; es_principal: boolean }[];
  producto_variantes?: {
    id: number;
    etiqueta: string;
    extra_precio: number | string;
    es_predeterminada: boolean;
    orden: number;
  }[];
}

interface Review {
  id: number;
  producto_id: number;
  usuario_id: number | null;
  puntuacion: number;
  comentario: string | null;
  respuesta?: string | null;
  respondido_en?: string | null;
  aprobada: boolean;
  creado_en: string;
  productos?: { id: number; nombre: string; slug: string };
  usuarios?: { id: number; nombre: string; email: string } | null;
}

interface User {
  id: number;
  nombre: string;
  apellido?: string | null;
  email: string;
  telefono: string | null;
  fecha_nacimiento?: string | null;
  rol: "admin" | "cliente";
  activo: boolean;
  creado_en: string;
}

interface Consulta {
  id: number;
  tipo: "contacto" | "evento" | "corona_funebre" | "otro";
  nombre: string;
  email: string;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  fecha_evento: string | null;
  estado: "nueva" | "en_curso" | "respondida" | "cerrada";
  creado_en: string;
}

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"productos" | "comentarios" | "usuarios" | "consultas">("productos");

  // Estados de datos
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  // Filtros de Consultas (Contacto y Eventos)
  const [consultaSearch, setConsultaSearch] = useState("");
  const [consultaTipoFilter, setConsultaTipoFilter] = useState<"all" | "contacto" | "evento">("all");
  const [consultaEstadoFilter, setConsultaEstadoFilter] = useState<"all" | "nueva" | "en_curso" | "respondida" | "cerrada">("all");

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Filtros y búsquedas
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Modal / Formulario de Nuevo Producto
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    nombre: "",
    categoria_id: 1,
    descripcion: "",
    stock: 10,
    precio: 45.0,
    etiqueta: "SILVESTRE & CAMPESTRE",
    imagen: "",
    es_oferta_flash: false,
    es_nuevo: true,
    es_favorito: false,
    has_unit_pricing: false,
    precios_unidades: {
      u12: 35.0,
      u24: 65.0,
      u36: 90.0,
      u42: 105.0,
    },
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal de Responder Comentario
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [savingReply, setSavingReply] = useState(false);

  // Modal / Formulario de Usuario
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    rol: "cliente",
  });
  const [showUserPassword, setShowUserPassword] = useState(false);

  const notify = (text: string, type: "success" | "error" = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Cargar datos
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes, revsRes, usrsRes, consRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/comments"),
        fetch("/api/admin/users"),
        fetch("/api/admin/consultas"),
      ]);

      if (prodsRes.ok) setProducts(await prodsRes.json());
      if (catsRes.ok) {
        const rawCats: Category[] = await catsRes.json();
        const cats = rawCats.filter(
          (c) => c.slug !== "eventos" && c.nombre.toLowerCase() !== "eventos"
        );
        setCategories(cats);
        if (cats.length > 0 && !editingProductId) {
          setProductForm((prev) => ({ ...prev, categoria_id: cats[0].id }));
        }
      }
      if (revsRes.ok) setReviews(await revsRes.json());
      if (usrsRes.ok) setUsers(await usrsRes.json());
      if (consRes.ok) setConsultas(await consRes.json());
    } catch (err) {
      console.error("Error al cargar datos:", err);
      notify("Error al conectar con la base de datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Error al cerrar sesión de administrador:", err);
    }
    // Redirección con recarga completa para asegurar limpieza de caché y estado en cliente
    window.location.href = "/admin/login";
  };

  // Subir imagen local
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir la imagen");
      setProductForm((prev) => ({ ...prev, imagen: data.url }));
      notify("Imagen subida correctamente");
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al subir imagen", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Guardar Producto (Crear o Editar)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        // Actualizar
        const res = await fetch(`/api/admin/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        });
        if (!res.ok) throw new Error("Error al actualizar producto");
        notify("Producto actualizado exitosamente");
      } else {
        // Crear
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        });
        if (!res.ok) throw new Error("Error al crear producto");
        notify("Producto añadido a la base de datos exitosamente");
      }

      setShowProductModal(false);
      setEditingProductId(null);
      resetProductForm();
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al guardar producto", "error");
    }
  };

  const resetProductForm = () => {
    const validCat = categories.find(
      (c) => c.slug !== "eventos" && c.nombre.toLowerCase() !== "eventos"
    );
    setProductForm({
      nombre: "",
      categoria_id: validCat?.id || categories[0]?.id || 1,
      descripcion: "",
      stock: 10,
      precio: 45.0,
      etiqueta: "SILVESTRE & CAMPESTRE",
      imagen: "",
      es_oferta_flash: false,
      es_nuevo: true,
      es_favorito: false,
      has_unit_pricing: false,
      precios_unidades: {
        u12: 35.0,
        u24: 65.0,
        u36: 90.0,
        u42: 105.0,
      },
    });
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    const img = p.producto_imagenes?.[0]?.url || "";

    const v12 = p.producto_variantes?.find((v) => v.etiqueta.includes("12"));
    const v24 = p.producto_variantes?.find((v) => v.etiqueta.includes("24"));
    const v36 = p.producto_variantes?.find((v) => v.etiqueta.includes("36"));
    const v42 = p.producto_variantes?.find((v) => v.etiqueta.includes("42"));
    const hasUnitPricing = Boolean(v12 && v24 && v36 && v42);

    const baseP = Number(p.precio) || 45;
    const u12 = v12 ? Number((baseP + Number(v12.extra_precio)).toFixed(2)) : baseP;
    const u24 = v24 ? Number((baseP + Number(v24.extra_precio)).toFixed(2)) : Number((baseP * 1.85).toFixed(2));
    const u36 = v36 ? Number((baseP + Number(v36.extra_precio)).toFixed(2)) : Number((baseP * 2.7).toFixed(2));
    const u42 = v42 ? Number((baseP + Number(v42.extra_precio)).toFixed(2)) : Number((baseP * 3.1).toFixed(2));

    setProductForm({
      nombre: p.nombre,
      categoria_id: p.categoria_id,
      descripcion: p.descripcion,
      stock: p.stock ?? 0,
      precio: Number(p.precio),
      etiqueta: p.etiqueta,
      imagen: img,
      es_oferta_flash: p.es_oferta_flash,
      es_nuevo: p.es_nuevo,
      es_favorito: p.es_favorito,
      has_unit_pricing: hasUnitPricing,
      precios_unidades: {
        u12,
        u24,
        u36,
        u42,
      },
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar o desactivar este producto?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      notify("Producto procesado correctamente");
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al eliminar producto", "error");
    }
  };

  // Moderación de Reseñas / Comentarios
  const handleToggleReviewStatus = async (id: number, currentAprobada: boolean) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aprobada: !currentAprobada }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      notify(!currentAprobada ? "Consulta marcada como Respondida" : "Consulta marcada como Pendiente");
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al actualizar comentario", "error");
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("¿Deseas eliminar este comentario?")) return;
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar comentario");
      notify("Comentario eliminado correctamente");
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al eliminar", "error");
    }
  };

  // Gestión de Usuarios
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario");
      notify("Usuario creado exitosamente");
      setShowUserModal(false);
      setUserForm({ nombre: "", email: "", password: "", telefono: "", rol: "cliente" });
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al crear usuario", "error");
    }
  };

  const handleToggleUserRole = async (id: number, currentRol: string) => {
    const newRol = currentRol === "admin" ? "cliente" : "admin";
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: newRol }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar rol");
      notify(`Rol actualizado a ${newRol}`);
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al cambiar rol", "error");
    }
  };

  const handleToggleUserActive = async (id: number, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar estado");
      notify(!currentActive ? "Usuario activado" : "Usuario desactivado");
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al cambiar estado", "error");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("¿Deseas eliminar este usuario definitivamente?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar usuario");
      notify("Usuario eliminado");
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al eliminar usuario", "error");
    }
  };

  // Manejadores para Consultas (Contacto y Eventos)
  const handleUpdateConsultaEstado = async (id: number, nuevoEstado: Consulta["estado"]) => {
    try {
      const res = await fetch(`/api/admin/consultas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      notify(`Estado actualizado a "${nuevoEstado}"`);
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al actualizar consulta", "error");
    }
  };

  const handleDeleteConsulta = async (id: number) => {
    if (!confirm("¿Deseas eliminar permanentemente esta consulta?")) return;
    try {
      const res = await fetch(`/api/admin/consultas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar consulta");
      notify("Consulta eliminada correctamente");
      fetchAllData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Error al eliminar consulta", "error");
    }
  };

  // Filtrado de Consultas (Contacto y Eventos)
  const filteredConsultas = consultas.filter((c) => {
    if (consultaTipoFilter === "contacto" && c.tipo === "evento") return false;
    if (consultaTipoFilter === "evento" && c.tipo !== "evento") return false;
    if (consultaEstadoFilter !== "all" && c.estado !== consultaEstadoFilter) return false;
    if (consultaSearch.trim()) {
      const q = consultaSearch.toLowerCase();
      const match =
        c.nombre.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.telefono && c.telefono.toLowerCase().includes(q)) ||
        (c.asunto && c.asunto.toLowerCase().includes(q)) ||
        c.mensaje.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtrado de productos
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === "all" || p.categoria_id.toString() === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-mint-50/40 text-forest-900 flex flex-col font-sans">
      {/* Barra Superior */}
      <header className="bg-white border-b border-mint-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-2xl">🌺</span>
              <div>
                <span className="font-serif font-bold text-lg text-forest leading-none block">
                  Alma de Flor
                </span>
                <span className="text-[9px] tracking-widest text-forest-600 font-semibold block">
                  PANEL ADMINISTRADOR
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint-100/70 border border-mint-200 text-xs text-forest-800">
              <Shield size={13} className="text-forest" />
              <span>{adminEmail}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-forest text-[10px] font-bold text-white uppercase tracking-wider">
                Admin
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mint-300 text-xs font-medium text-forest-700 hover:bg-mint-100 hover:text-forest transition"
            >
              <span>Ver Tienda</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-700 transition disabled:opacity-50 cursor-pointer shadow-xs"
              title="Cerrar sesión de administrador"
              aria-label="Cerrar sesión"
            >
              {loggingOut ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-red-700 border-t-transparent animate-spin" />
                  <span>Saliendo...</span>
                </>
              ) : (
                <>
                  <LogOut size={14} />
                  <span>Salir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notificación flotante */}
      {actionMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm ${
              actionMessage.type === "success"
                ? "bg-forest-900 text-white border-forest-800"
                : "bg-red-700 text-white border-red-800"
            }`}
          >
            {actionMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{actionMessage.text}</span>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        {/* Navegación por pestañas (Tres Apartados: Productos, Comentarios, Usuario) */}
        <div className="flex border-b border-mint-200 gap-2 mb-8 bg-white p-2 rounded-2xl shadow-xs border">
          <button
            onClick={() => setActiveTab("productos")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "productos"
                ? "bg-forest text-white shadow-xs font-semibold"
                : "text-forest-700 hover:bg-mint-50 hover:text-forest"
            }`}
          >
            <Package size={17} />
            <span>Productos</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "productos" ? "bg-white/20 text-white" : "bg-mint-200 text-forest-800"
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("comentarios")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "comentarios"
                ? "bg-forest text-white shadow-xs font-semibold"
                : "text-forest-700 hover:bg-mint-50 hover:text-forest"
            }`}
          >
            <MessageSquare size={17} />
            <span>Comentarios</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "comentarios" ? "bg-white/20 text-white" : "bg-mint-200 text-forest-800"
              }`}
            >
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("usuarios")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "usuarios"
                ? "bg-forest text-white shadow-xs font-semibold"
                : "text-forest-700 hover:bg-mint-50 hover:text-forest"
            }`}
          >
            <Users size={17} />
            <span>Usuario</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "usuarios" ? "bg-white/20 text-white" : "bg-mint-200 text-forest-800"
              }`}
            >
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("consultas")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition relative ${
              activeTab === "consultas"
                ? "bg-forest text-white shadow-xs font-semibold"
                : "text-forest-700 hover:bg-mint-50 hover:text-forest"
            }`}
          >
            <Inbox size={17} />
            <span>Consulta</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "consultas" ? "bg-white/20 text-white" : "bg-mint-200 text-forest-800"
              }`}
            >
              {consultas.length}
            </span>
            {consultas.some((c) => c.estado === "nueva") && (
              <span
                className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse"
                title={`${consultas.filter((c) => c.estado === "nueva").length} nuevas consultas por responder`}
              />
            )}
          </button>
        </div>

        {/* -------------------- APARTADO 1: PRODUCTOS -------------------- */}
        {activeTab === "productos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif text-forest font-bold">Gestión de Productos</h1>
                <p className="text-xs text-forest-600">
                  Sube y edita imágenes, asigna categorías, redacta descripciones y administra el stock de unidades.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllData}
                  className="p-2.5 rounded-xl border border-mint-200 hover:bg-mint-100 text-forest-700 transition"
                  title="Refrescar datos de MySQL"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    resetProductForm();
                    setShowProductModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Plus size={16} />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl border border-mint-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search size={15} className="absolute left-3.5 top-3 text-forest-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, SKU o descripción..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-mint-50/60 border border-mint-200 rounded-lg text-xs focus:ring-1 focus:ring-forest focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Layers size={15} className="text-forest-500 shrink-0" />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full md:w-56 px-3 py-2 bg-mint-50/60 border border-mint-200 rounded-lg text-xs focus:ring-1 focus:ring-forest focus:outline-none"
                >
                  <option value="all">Todas las categorías ({products.length})</option>
                  {categories
                    .filter((c) => c.slug !== "eventos" && c.nombre.toLowerCase() !== "eventos")
                    .map((c) => (
                      <option key={c.id} value={c.id.toString()}>
                        {c.nombre}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Tabla de Productos */}
            <div className="bg-white rounded-2xl border border-mint-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-mint-100/60 text-forest-800 uppercase tracking-wider font-semibold border-b border-mint-200">
                    <tr>
                      <th className="py-3.5 px-4">Imagen</th>
                      <th className="py-3.5 px-4">Producto / SKU</th>
                      <th className="py-3.5 px-4">Categoría</th>
                      <th className="py-3.5 px-4">Precio</th>
                      <th className="py-3.5 px-4">Unidades (Stock)</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mint-100">
                    {filteredProducts.map((p) => {
                      const imgUrl = p.producto_imagenes?.[0]?.url || `/products/${p.slug}.jpg`;
                      const stockVal = p.stock ?? 0;
                      return (
                        <tr key={p.id} className="hover:bg-mint-50/40 transition">
                          <td className="py-3 px-4">
                            <div className="h-12 w-12 rounded-lg bg-mint-100 border border-mint-200 overflow-hidden flex items-center justify-center shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgUrl}
                                alt={p.nombre}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-forest-900 text-sm">{p.nombre}</div>
                            <div className="text-[11px] text-forest-500 font-mono">SKU: {p.sku}</div>
                            <div className="text-[11px] text-forest-600 line-clamp-1 max-w-xs">{p.descripcion}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-mint-100 text-forest-800 text-[11px] font-medium border border-mint-200">
                              {p.categorias?.nombre || "General"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-forest-900">
                            <div>$ {Number(p.precio).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            {p.producto_variantes && p.producto_variantes.filter((v) => !v.etiqueta.toLowerCase().includes("estándar") && !v.etiqueta.toLowerCase().includes("estandar")).length > 1 && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                12/24/36/42 uds
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                stockVal > 10
                                  ? "bg-green-100 text-green-800"
                                  : stockVal > 0
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  stockVal > 10 ? "bg-green-600" : stockVal > 0 ? "bg-amber-600" : "bg-red-600"
                                }`}
                              />
                              {stockVal} unidades
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {p.activo ? (
                              <span className="text-green-700 font-medium inline-flex items-center gap-1">
                                <Check size={13} /> Activo
                              </span>
                            ) : (
                              <span className="text-forest-400 font-medium">Inactivo</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="p-1.5 text-forest-600 hover:text-forest hover:bg-mint-100 rounded-lg transition"
                                title="Editar producto"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                                title="Eliminar producto"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-forest-500">
                          No se encontraron productos que coincidan con la búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- APARTADO 2: COMENTARIOS -------------------- */}
        {activeTab === "comentarios" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif text-forest font-bold">Gestión de Comentarios y Reseñas</h1>
                <p className="text-xs text-forest-600">
                  Modera valoraciones, aprueba opiniones de clientes y responde a testimonios sobre flores y arreglos.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllData}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-mint-200 hover:bg-mint-100 text-forest-700 text-xs font-semibold transition"
                  title="Actualizar comentarios"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>

            {/* Tabla de Reseñas */}
            <div className="bg-white rounded-2xl border border-mint-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-mint-100/60 text-forest-800 uppercase tracking-wider font-semibold border-b border-mint-200">
                    <tr>
                      <th className="py-3.5 px-4">Autor / Usuario</th>
                      <th className="py-3.5 px-4">Comentario</th>
                      <th className="py-3.5 px-4">Fecha</th>
                      <th className="py-3.5 px-4">Responder</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mint-100">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-mint-50/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-medium text-forest-800">
                            {r.usuarios?.nombre || "Cliente Anónimo"}
                          </div>
                          <div className="text-[11px] text-forest-500">{r.usuarios?.email || ""}</div>
                        </td>
                        <td className="py-3 px-4 max-w-sm">
                          <p className="text-forest-700 italic">“{r.comentario || "Sin comentario escrito"}”</p>
                          {r.respuesta && (
                            <div className="mt-2 p-2 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-200/70 text-[11px] leading-relaxed">
                              <span className="font-semibold block text-[10px] text-emerald-800 uppercase tracking-wider mb-0.5">
                                Respuesta enviada al usuario:
                              </span>
                              {r.respuesta}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-forest-500 text-[11px]">
                          {new Date(r.creado_en).toLocaleDateString("es-ES")}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setReplyingReview(r);
                              setReplyMessage(r.respuesta || "");
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-800 text-white font-semibold text-xs shadow-xs transition"
                            title="Responder a la consulta del usuario"
                          >
                            <MessageSquare size={13} />
                            <span>{r.respuesta ? "Ver / Editar Respuesta" : "Responder"}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleReviewStatus(r.id, r.aprobada)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                              r.aprobada
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            }`}
                            title="Haz clic para alternar estado"
                          >
                            {r.aprobada ? (
                              <>
                                <CheckCircle size={12} /> Respondido
                              </>
                            ) : (
                              <>
                                <AlertCircle size={12} /> Pendiente
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar comentario"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-forest-500">
                          Aún no hay comentarios ni consultas registradas en la base de datos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- APARTADO 3: USUARIO -------------------- */}
        {activeTab === "usuarios" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif text-forest font-bold">Gestión de Usuarios</h1>
                <p className="text-xs text-forest-600">
                  Visualiza usuarios registrados en MySQL, asigna privilegios de administrador o crea nuevas cuentas.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllData}
                  className="p-2.5 rounded-xl border border-mint-200 hover:bg-mint-100 text-forest-700 transition"
                  title="Refrescar usuarios"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Plus size={16} />
                  <span>Nuevo Usuario</span>
                </button>
              </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-2xl border border-mint-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-mint-100/60 text-forest-800 uppercase tracking-wider font-semibold border-b border-mint-200">
                    <tr>
                      <th className="py-3.5 px-4">Nombre</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Teléfono</th>
                      <th className="py-3.5 px-4">Rol</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Fecha Registro</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mint-100">
                    {users.map((u) => {
                      const isMainAdmin = u.email.toLowerCase() === "flore@gmail.com";
                      return (
                        <tr key={u.id} className="hover:bg-mint-50/40 transition">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-forest-900">{u.nombre} {u.apellido || ""}</div>
                            {u.fecha_nacimiento && (
                              <div className="text-[10px] text-forest-500">
                                Nac: {new Date(u.fecha_nacimiento).toLocaleDateString("es-ES")}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-forest-700">{u.email}</td>
                          <td className="py-3 px-4 text-forest-600">{u.telefono || "No especificado"}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                u.rol === "admin"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : "bg-mint-100 text-forest-800 border border-mint-200"
                              }`}
                            >
                              {u.rol === "admin" ? <Shield size={11} /> : null}
                              {u.rol}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              disabled={isMainAdmin}
                              onClick={() => handleToggleUserActive(u.id, u.activo)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                                u.activo
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-red-50 text-red-700 hover:bg-red-100"
                              } ${isMainAdmin ? "opacity-60 cursor-not-allowed" : ""}`}
                              title={isMainAdmin ? "No se puede desactivar al admin principal" : "Alternar estado"}
                            >
                              {u.activo ? <CheckCircle size={12} /> : <XCircle size={12} />}
                              {u.activo ? "Activo" : "Inactivo"}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-forest-500 text-[11px]">
                            {new Date(u.creado_en).toLocaleDateString("es-ES")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!isMainAdmin && (
                                <>
                                  <button
                                    onClick={() => handleToggleUserRole(u.id, u.rol)}
                                    className="px-2 py-1 bg-mint-100 hover:bg-mint-200 text-forest-800 rounded-lg text-[10px] font-semibold transition"
                                    title="Cambiar entre Cliente y Admin"
                                  >
                                    Hacer {u.rol === "admin" ? "Cliente" : "Admin"}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                                    title="Eliminar usuario"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                              {isMainAdmin && (
                                <span className="text-[10px] text-forest-500 italic">Admin principal</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- APARTADO 4: CONSULTA (CONTACTO & EVENTOS) -------------------- */}
        {activeTab === "consultas" && (
          <div className="space-y-6">
            {/* Header del apartado */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif text-forest font-bold flex items-center gap-2.5">
                  <span>Bandeja de Consultas</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint-200 text-forest-800 font-sans font-semibold">
                    Contacto &amp; Eventos
                  </span>
                </h1>
                <p className="text-xs text-forest-600 mt-1">
                  Recepción y seguimiento de mensajes y solicitudes enviadas por clientes desde las pestañas de Contacto y Eventos.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllData}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-mint-200 hover:bg-mint-100 text-forest-700 text-xs font-semibold transition"
                  title="Actualizar consultas"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>

            {/* Tarjetas resumen de métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-mint-200 shadow-xs">
                <div className="flex items-center justify-between text-forest-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
                  <Inbox size={15} />
                </div>
                <div className="text-2xl font-bold font-serif text-forest-900">{consultas.length}</div>
                <div className="text-[10px] text-forest-600 mt-0.5">Mensajes recibidos</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-mint-200 shadow-xs">
                <div className="flex items-center justify-between text-emerald-600 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Nuevas</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-2xl font-bold font-serif text-emerald-900">
                  {consultas.filter((c) => c.estado === "nueva").length}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Pendientes de respuesta</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-mint-200 shadow-xs">
                <div className="flex items-center justify-between text-forest-600 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Contacto</span>
                  <Mail size={15} />
                </div>
                <div className="text-2xl font-bold font-serif text-forest-900">
                  {consultas.filter((c) => c.tipo !== "evento").length}
                </div>
                <div className="text-[10px] text-forest-600 mt-0.5">Atelier &amp; pedidos a medida</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-mint-200 shadow-xs">
                <div className="flex items-center justify-between text-amber-700 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Eventos</span>
                  <Sparkles size={15} />
                </div>
                <div className="text-2xl font-bold font-serif text-amber-900">
                  {consultas.filter((c) => c.tipo === "evento").length}
                </div>
                <div className="text-[10px] text-amber-800 mt-0.5">Bodas &amp; grandes montajes</div>
              </div>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="bg-white p-4 rounded-2xl border border-mint-200 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Pestañas de Origen */}
                <div className="flex items-center gap-1.5 p-1 bg-mint-50/70 rounded-xl border border-mint-200/60 overflow-x-auto">
                  <button
                    onClick={() => setConsultaTipoFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                      consultaTipoFilter === "all"
                        ? "bg-forest text-white shadow-xs"
                        : "text-forest-700 hover:bg-mint-100"
                    }`}
                  >
                    Todas ({consultas.length})
                  </button>
                  <button
                    onClick={() => setConsultaTipoFilter("contacto")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                      consultaTipoFilter === "contacto"
                        ? "bg-forest text-white shadow-xs"
                        : "text-forest-700 hover:bg-mint-100"
                    }`}
                  >
                    <Mail size={12} />
                    <span>Pestaña Contacto ({consultas.filter((c) => c.tipo !== "evento").length})</span>
                  </button>
                  <button
                    onClick={() => setConsultaTipoFilter("evento")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                      consultaTipoFilter === "evento"
                        ? "bg-forest text-white shadow-xs"
                        : "text-forest-700 hover:bg-mint-100"
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>Pestaña Eventos ({consultas.filter((c) => c.tipo === "evento").length})</span>
                  </button>
                </div>

                {/* Filtro por Estado */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-forest-700 whitespace-nowrap">Estado:</span>
                  <select
                    value={consultaEstadoFilter}
                    onChange={(e) =>
                      setConsultaEstadoFilter(
                        e.target.value as "all" | "nueva" | "en_curso" | "respondida" | "cerrada"
                      )
                    }
                    className="text-xs px-3 py-1.5 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest text-forest-800 font-medium"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="nueva">🟢 Nuevas ({consultas.filter((c) => c.estado === "nueva").length})</option>
                    <option value="en_curso">🔵 En curso ({consultas.filter((c) => c.estado === "en_curso").length})</option>
                    <option value="respondida">✅ Respondidas ({consultas.filter((c) => c.estado === "respondida").length})</option>
                    <option value="cerrada">⚪ Cerradas ({consultas.filter((c) => c.estado === "cerrada").length})</option>
                  </select>
                </div>
              </div>

              {/* Input de Búsqueda */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type="text"
                  placeholder="Buscar consulta por nombre de cliente, correo, teléfono, palabras del mensaje o asunto..."
                  value={consultaSearch}
                  onChange={(e) => setConsultaSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-mint-50/30 border border-mint-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-forest text-forest-900 placeholder:text-forest-400"
                />
              </div>
            </div>

            {/* Listado de Consultas */}
            <div className="space-y-4">
              {filteredConsultas.map((c) => {
                const isEvento = c.tipo === "evento";
                const telClean = c.telefono ? c.telefono.replace(/\D/g, "") : "";
                const fechaRecepcion = new Date(c.creado_en).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={c.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md p-5 sm:p-6 ${
                      c.estado === "nueva"
                        ? "border-emerald-300 ring-1 ring-emerald-200/50"
                        : "border-mint-200"
                    }`}
                  >
                    {/* Fila superior: Origen, Fecha, Estado y Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mint-100 pb-3 mb-4">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {isEvento ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                            <Sparkles size={13} className="text-amber-700" />
                            <span>Pestaña Eventos &amp; Bodas</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
                            <Mail size={13} className="text-emerald-700" />
                            <span>Pestaña Contacto &amp; Atelier</span>
                          </span>
                        )}

                        <span className="text-xs text-forest-500 flex items-center gap-1 font-mono">
                          <Clock size={12} />
                          <span>{fechaRecepcion}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-forest-600 uppercase tracking-wider">
                          Estado:
                        </span>
                        <select
                          value={c.estado}
                          onChange={(e) =>
                            handleUpdateConsultaEstado(c.id, e.target.value as Consulta["estado"])
                          }
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition cursor-pointer focus:outline-none ${
                            c.estado === "nueva"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200"
                              : c.estado === "en_curso"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : c.estado === "respondida"
                              ? "bg-teal-50 text-teal-800 border-teal-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          <option value="nueva">🟢 Nueva</option>
                          <option value="en_curso">🔵 En curso</option>
                          <option value="respondida">✅ Respondida</option>
                          <option value="cerrada">⚪ Cerrada</option>
                        </select>
                      </div>
                    </div>

                    {/* Datos del Cliente y Asunto */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Columna Izquierda: Información de Contacto */}
                      <div className="md:col-span-5 space-y-2">
                        <div className="font-serif text-lg font-bold text-forest-900 leading-tight">
                          {c.nombre}
                        </div>

                        <div className="space-y-1.5 text-xs text-forest-700">
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-forest-500 shrink-0" />
                            <a
                              href={`mailto:${c.email}?subject=Alma de Flor - Respuesta a tu consulta`}
                              className="font-mono text-forest-800 hover:text-forest underline underline-offset-2 break-all"
                              title="Enviar correo"
                            >
                              {c.email}
                            </a>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Phone size={13} className="text-forest-500 shrink-0" />
                            {c.telefono ? (
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${c.telefono}`}
                                  className="text-forest-800 hover:text-forest font-semibold"
                                >
                                  {c.telefono}
                                </a>
                                {telClean && (
                                  <a
                                    href={`https://wa.me/${telClean}?text=Hola%20${encodeURIComponent(
                                      c.nombre
                                    )},%20te%20escribimos%20desde%20el%20atelier%20Alma%20de%20Flor...`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                                    title="Abrir chat de WhatsApp"
                                  >
                                    <MessageCircle size={12} />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-forest-400 italic">No proporcionó teléfono</span>
                            )}
                          </div>

                          {c.fecha_evento && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 mt-1">
                              <Calendar size={13} className="text-amber-700 shrink-0" />
                              <span>
                                Fecha requerida:{" "}
                                <strong>
                                  {new Date(c.fecha_evento).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Columna Derecha: Asunto y Mensaje */}
                      <div className="md:col-span-7 flex flex-col justify-between">
                        {c.asunto && (
                          <div className="text-xs font-semibold text-forest-800 bg-mint-100/50 px-3 py-1.5 rounded-lg border border-mint-200/70 mb-2">
                            <span className="text-[10px] uppercase tracking-wider text-forest-600 block">
                              Asunto / Tipo de solicitud:
                            </span>
                            <span className="font-medium text-forest-900">{c.asunto}</span>
                          </div>
                        )}

                        <div className="p-3.5 bg-mint-50/40 rounded-xl border border-mint-200 text-xs sm:text-sm text-forest-900 leading-relaxed whitespace-pre-wrap font-sans">
                          {c.mensaje}
                        </div>
                      </div>
                    </div>

                    {/* Fila Inferior: Botones de Acción */}
                    <div className="mt-4 pt-3 border-t border-mint-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Botón Responder por Email */}
                        <a
                          href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(
                            c.asunto || "Consulta en Alma de Flor"
                          )}&body=Hola%20${encodeURIComponent(
                            c.nombre
                          )},%0A%0AGracias%20por%20comunicarte%20con%20nuestro%20atelier%20Alma%20de%20Flor.%0A%0ACon%20respecto%20a%20tu%20consulta:%0A`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition"
                        >
                          <Mail size={13} />
                          <span>Responder por Email</span>
                        </a>

                        {/* Botón Marcar Respondida */}
                        {c.estado !== "respondida" && (
                          <button
                            onClick={() => handleUpdateConsultaEstado(c.id, "respondida")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold transition"
                          >
                            <Check size={13} />
                            <span>Marcar Respondida</span>
                          </button>
                        )}

                        {/* Botón Cerrar / Reabrir */}
                        {c.estado !== "cerrada" ? (
                          <button
                            onClick={() => handleUpdateConsultaEstado(c.id, "cerrada")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint-50 hover:bg-mint-100 border border-mint-200 text-forest-700 text-xs font-medium transition"
                          >
                            <span>Archivar / Cerrar</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateConsultaEstado(c.id, "nueva")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint-50 hover:bg-mint-100 border border-mint-200 text-forest-700 text-xs font-medium transition"
                          >
                            <span>Reabrir</span>
                          </button>
                        )}
                      </div>

                      {/* Botón Eliminar Consulta */}
                      <button
                        onClick={() => handleDeleteConsulta(c.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg text-xs font-medium transition"
                        title="Eliminar consulta"
                      >
                        <Trash2 size={13} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredConsultas.length === 0 && (
                <div className="bg-white rounded-2xl border border-mint-200 p-12 text-center shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-mint-100 text-forest flex items-center justify-center mx-auto mb-3">
                    <Inbox size={26} />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-forest-900">
                    No se encontraron consultas
                  </h3>
                  <p className="text-xs text-forest-600 max-w-md mx-auto mt-1 leading-relaxed">
                    {consultaSearch || consultaTipoFilter !== "all" || consultaEstadoFilter !== "all"
                      ? "No hay consultas que coincidan con los filtros aplicados. Intenta restablecer los filtros."
                      : "Aún no se han recibido consultas desde las pestañas de Contacto ni Eventos."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: CREAR / EDITAR PRODUCTO ================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-mint-200 shadow-xl overflow-hidden my-8">
            <div className="bg-mint-100/70 px-6 py-4 border-b border-mint-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-forest">
                {editingProductId ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-forest-500 hover:text-forest p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
              {/* Sección Imagen */}
              <div className="bg-mint-50/50 p-4 rounded-xl border border-mint-200">
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-2">
                  1. Imagen del Producto
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="h-24 w-24 rounded-xl bg-white border border-mint-300 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {productForm.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={productForm.imagen}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl text-mint-300">🌸</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-mint-300 hover:bg-mint-50 rounded-lg font-medium text-forest-700 transition"
                      >
                        <Upload size={14} />
                        <span>{uploadingImage ? "Subiendo..." : "Subir archivo de imagen"}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-forest-500">
                      O coloca directamente la URL pública o ruta (ej. <code>/products/ramo-silvestre.jpg</code>):
                    </div>
                    <input
                      type="text"
                      placeholder="https://... o /products/..."
                      value={productForm.imagen}
                      onChange={(e) => setProductForm({ ...productForm, imagen: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                  </div>
                </div>
              </div>

              {/* Nombre y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ramo Silvestre Amanecer"
                    value={productForm.nombre}
                    onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })}
                    className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                    2. Categoría *
                  </label>
                  <select
                    required
                    value={productForm.categoria_id}
                    onChange={(e) =>
                      setProductForm({ ...productForm, categoria_id: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  >
                    {categories
                      .filter((c) => c.slug !== "eventos" && c.nombre.toLowerCase() !== "eventos")
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Precio y Stock de Unidades */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={productForm.precio}
                    onChange={(e) =>
                      setProductForm({ ...productForm, precio: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                    3. Cantidad de Unidades (Stock) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    placeholder="SILVESTRE & CAMPESTRE"
                    value={productForm.etiqueta}
                    onChange={(e) => setProductForm({ ...productForm, etiqueta: e.target.value })}
                    className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
              </div>

              {/* ================= OPCIÓN DE PRECIOS SEGÚN UNIDADES (12, 24, 36, 42) ================= */}
              <div className="rounded-xl border border-mint-200 bg-mint-50/50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-forest-900">
                      <input
                        type="checkbox"
                        checked={productForm.has_unit_pricing}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setProductForm((prev) => ({
                            ...prev,
                            has_unit_pricing: checked,
                            precios_unidades: checked
                              ? {
                                  u12: prev.precios_unidades.u12 || prev.precio || 35,
                                  u24: prev.precios_unidades.u24 || Number((prev.precio * 1.85).toFixed(2)) || 65,
                                  u36: prev.precios_unidades.u36 || Number((prev.precio * 2.7).toFixed(2)) || 90,
                                  u42: prev.precios_unidades.u42 || Number((prev.precio * 3.1).toFixed(2)) || 105,
                                }
                              : prev.precios_unidades,
                          }));
                        }}
                        className="rounded text-forest focus:ring-forest h-4 w-4"
                      />
                      <span className="uppercase tracking-wider">
                        Opción: Precios según unidades (12, 24, 36 y 42 unidades)
                      </span>
                    </label>
                    <p className="text-[11px] text-forest-600 mt-1 leading-relaxed">
                      Permite que el comprador elija entre 12, 24, 36 o 42 unidades en la tienda, asignando un precio específico para cada opción.
                      <span className="text-forest-500 italic block mt-0.5">
                        * Esta opción es opcional: desmárcala si el producto se vende a precio fijo único.
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                      productForm.has_unit_pricing
                        ? "bg-forest text-white shadow-2xs"
                        : "bg-mint-200 text-forest-700"
                    }`}
                  >
                    {productForm.has_unit_pricing ? "Habilitada" : "Opcional"}
                  </span>
                </div>

                {productForm.has_unit_pricing && (
                  <div className="pt-3 border-t border-mint-200/80">
                    <div className="text-[11px] font-semibold text-forest-800 mb-2.5">
                      Ingresa el precio final ($) para cada una de las 4 opciones de unidades:
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* 12 Unidades */}
                      <div className="bg-white p-3 rounded-xl border border-mint-200 shadow-2xs">
                        <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-wider mb-1">
                          12 Unidades ($) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-forest-400 font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required={productForm.has_unit_pricing}
                            value={productForm.precios_unidades.u12}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                precio: parseFloat(e.target.value) || prev.precio,
                                precios_unidades: {
                                  ...prev.precios_unidades,
                                  u12: parseFloat(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="35.00"
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-mint-50/30 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest font-mono font-bold text-forest-900"
                          />
                        </div>
                        <span className="text-[10px] text-forest-500 mt-1 block">
                          Base (12 uds)
                        </span>
                      </div>

                      {/* 24 Unidades */}
                      <div className="bg-white p-3 rounded-xl border border-mint-200 shadow-2xs">
                        <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-wider mb-1">
                          24 Unidades ($) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-forest-400 font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required={productForm.has_unit_pricing}
                            value={productForm.precios_unidades.u24}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                precios_unidades: {
                                  ...prev.precios_unidades,
                                  u24: parseFloat(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="65.00"
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-mint-50/30 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest font-mono font-bold text-forest-900"
                          />
                        </div>
                        <span className="text-[10px] text-forest-500 mt-1 block">
                          24 uds
                        </span>
                      </div>

                      {/* 36 Unidades */}
                      <div className="bg-white p-3 rounded-xl border border-mint-200 shadow-2xs">
                        <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-wider mb-1">
                          36 Unidades ($) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-forest-400 font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required={productForm.has_unit_pricing}
                            value={productForm.precios_unidades.u36}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                precios_unidades: {
                                  ...prev.precios_unidades,
                                  u36: parseFloat(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="90.00"
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-mint-50/30 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest font-mono font-bold text-forest-900"
                          />
                        </div>
                        <span className="text-[10px] text-forest-500 mt-1 block">
                          36 uds
                        </span>
                      </div>

                      {/* 42 Unidades */}
                      <div className="bg-white p-3 rounded-xl border border-mint-200 shadow-2xs">
                        <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-wider mb-1">
                          42 Unidades ($) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-forest-400 font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required={productForm.has_unit_pricing}
                            value={productForm.precios_unidades.u42}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                precios_unidades: {
                                  ...prev.precios_unidades,
                                  u42: parseFloat(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="105.00"
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-mint-50/30 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest font-mono font-bold text-forest-900"
                          />
                        </div>
                        <span className="text-[10px] text-forest-500 mt-1 block">
                          42 uds
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                  4. Descripción del Producto *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalla las flores, procedencia, aromas y follajes que componen este producto..."
                  value={productForm.descripcion}
                  onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })}
                  className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              {/* Opciones de catálogo */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-mint-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.es_oferta_flash}
                    onChange={(e) => setProductForm({ ...productForm, es_oferta_flash: e.target.checked })}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span>Oferta Flash</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.es_nuevo}
                    onChange={(e) => setProductForm({ ...productForm, es_nuevo: e.target.checked })}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span>Recién Llegado</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.es_favorito}
                    onChange={(e) => setProductForm({ ...productForm, es_favorito: e.target.checked })}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span>Favorito de la Casa</span>
                </label>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-mint-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-mint-300 rounded-xl text-forest-700 hover:bg-mint-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest hover:bg-forest-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  {editingProductId ? "Guardar Cambios" : "Guardar Producto en MySQL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ================= MODAL: RESPONDER CONSULTA / COMENTARIO ================= */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-mint-200 shadow-xl overflow-hidden">
            <div className="bg-mint-100/70 px-6 py-4 border-b border-mint-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-forest" />
                <h3 className="font-serif font-bold text-lg text-forest">Responder Consulta al Usuario</h3>
              </div>
              <button
                onClick={() => setReplyingReview(null)}
                className="text-forest-500 hover:text-forest p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Información del Cliente */}
              <div className="bg-mint-50/60 p-4 rounded-xl border border-mint-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-forest-900 text-sm block">
                      {replyingReview.usuarios?.nombre || "Cliente"}
                    </span>
                    {replyingReview.usuarios?.email && (
                      <span className="text-forest-600 font-mono text-[11px]">
                        {replyingReview.usuarios.email}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-forest-500 font-mono">
                    {new Date(replyingReview.creado_en).toLocaleDateString("es-ES")}
                  </span>
                </div>

                <div className="pt-2 border-t border-mint-200/60">
                  <span className="font-semibold text-forest-800 uppercase tracking-wider text-[10px] block mb-1">
                    Consulta / Comentario del Usuario:
                  </span>
                  <p className="text-forest-800 italic bg-white p-3 rounded-lg border border-mint-100 leading-relaxed">
                    “{replyingReview.comentario || "Sin comentario escrito"}”
                  </p>
                </div>
              </div>

              {/* Redactar Respuesta */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Tu Respuesta para el Panel del Usuario *
                </label>
                <textarea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Escribe aquí tu respuesta. El usuario la verá directamente en la sección 'Tus Comentarios Enviados' de su panel..."
                  className="w-full px-3 py-2.5 bg-mint-50/50 border border-mint-200 rounded-xl text-forest-900 text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <p className="text-[11px] text-forest-500 mt-1">
                  Esta respuesta se guardará en la base de datos y se mostrará directamente en el panel del usuario (no se envía por mail).
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="w-full sm:w-auto px-4 py-2 border border-mint-300 rounded-xl text-forest-700 hover:bg-mint-50 transition font-medium"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={savingReply}
                  onClick={async () => {
                    if (!replyMessage.trim()) {
                      notify("Por favor, escribe una respuesta para el usuario.", "error");
                      return;
                    }
                    setSavingReply(true);
                    try {
                      const res = await fetch(`/api/admin/comments/${replyingReview.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ respuesta: replyMessage.trim(), aprobada: true }),
                      });
                      if (!res.ok) throw new Error("Error al guardar la respuesta");
                      notify("Respuesta enviada y guardada en el panel del usuario con éxito");
                      setReplyingReview(null);
                      fetchAllData();
                    } catch (err: unknown) {
                      notify(err instanceof Error ? err.message : "Error al responder", "error");
                    } finally {
                      setSavingReply(false);
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-forest hover:bg-forest-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  <Send size={14} />
                  <span>{savingReply ? "Enviando respuesta..." : "Enviar Respuesta al Usuario"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREAR USUARIO ================= */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-mint-200 shadow-xl overflow-hidden">
            <div className="bg-mint-100/70 px-6 py-4 border-b border-mint-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-forest">Crear Nuevo Usuario</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-forest-500 hover:text-forest p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Gómez"
                  value={userForm.nombre}
                  onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                  className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@ejemplo.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showUserPassword ? "text" : "password"}
                    required
                    placeholder="Contraseña segura"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserPassword(!showUserPassword)}
                    aria-label={showUserPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    title={showUserPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-forest-500 hover:text-forest-800 transition focus:outline-none"
                  >
                    {showUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  placeholder="+34 600 000 000"
                  value={userForm.telefono}
                  onChange={(e) => setUserForm({ ...userForm, telefono: e.target.value })}
                  className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-forest-800 mb-1">
                  Rol del Usuario
                </label>
                <select
                  value={userForm.rol}
                  onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                  className="w-full px-3 py-2 bg-mint-50/50 border border-mint-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="pt-4 border-t border-mint-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-mint-300 rounded-xl text-forest-700 hover:bg-mint-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest hover:bg-forest-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
