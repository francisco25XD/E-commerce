"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Store,
  MapPin,
  Compass,
  ExternalLink,
  Heart,
  Flame,
  Wine,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";

export default function ContactoView() {
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipo_consulta: "Pedido personalizado / Ramo a medida",
    fecha_entrega: "",
    mensaje: "",
    politica: false,
  });

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.politica) {
      setFeedback({
        type: "error",
        message: "Por favor, acepta la política de privacidad para continuar.",
      });
      return;
    }

    setSending(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          origen: "contacto",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la consulta");
      }

      setFeedback({
        type: "success",
        message: "¡Gracias por contactar con nuestro atelier! Hemos recibido tu mensaje y nos pondremos en contacto contigo a la mayor brevedad.",
      });

      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        tipo_consulta: "Pedido personalizado / Ramo a medida",
        fecha_entrega: "",
        mensaje: "",
        politica: false,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Ocurrió un error al enviar tu consulta. Por favor inténtalo de nuevo.",
      });
    } finally {
      setSending(false);
    }
  };

  const selectService = (tipo: string) => {
    setFormData((prev) => ({ ...prev, tipo_consulta: tipo }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen text-forest-900">
      {/* 1. HERO SUPERIOR */}
      <section className="mx-auto max-w-[1240px] px-6 pt-12 pb-10 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#0f2c22]">
          Hablemos de Flores &amp; Momentos Especiales
        </h1>
        <p className="mt-4 max-w-2xl text-[14px] sm:text-[15px] leading-relaxed text-forest-700 mx-auto">
          Estamos a tu entera disposición en nuestro atelier botánico del Casco Antiguo de Logroño o a través de nuestros canales directos para asesorarte en ramos de autor, bodas, ambientaciones y condolencias.
        </p>

        {/* Badge de Horario */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-mint-200/90 bg-white/95 px-4 py-1.5 text-xs text-forest-800 shadow-sm">
          <Clock size={13} className="text-forest shrink-0" />
          <span>Atelier abierto hoy en Calle Portales hasta las 20:30 h</span>
        </div>
      </section>

      {/* 2. GRILLA DE 4 TARJETAS DE CONTACTO RÁPIDO */}
      <section className="mx-auto max-w-[1240px] px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tarjeta 1: Urgencias Florales */}
          <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-8 h-8 rounded-md bg-[#0e3b2b] text-white flex items-center justify-center mb-4">
                <Phone size={15} />
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                LLAMADA DIRECTA
              </span>
              <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">
                Urgencias Florales
              </h3>
              <p className="text-xs text-forest-700/80 leading-relaxed mt-1.5">
                Atención directa con florista de guardia para entregas en el mismo día.
              </p>
            </div>
            <a
              href="tel:+34941204060"
              className="font-serif text-base sm:text-lg font-semibold text-forest-900 mt-5 block hover:text-forest transition-colors"
            >
              +34 941 20 40 60
            </a>
          </div>

          {/* Tarjeta 2: WhatsApp Botánico */}
          <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-8 h-8 rounded-md bg-[#d8f0e3] text-[#0e3b2b] flex items-center justify-center mb-4">
                <MessageCircle size={15} />
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                RESPUESTA &lt; 15 MIN
              </span>
              <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">
                WhatsApp Botánico
              </h3>
              <p className="text-xs text-forest-700/80 leading-relaxed mt-1.5">
                Envío de fotos de flores recién llegadas y pedidos ágiles por mensajería.
              </p>
            </div>
            <a
              href="https://wa.me/34682112233"
              target="_blank"
              rel="noreferrer"
              className="font-serif text-base sm:text-lg font-semibold text-forest-900 mt-5 block hover:text-forest transition-colors"
            >
              +34 682 11 22 33
            </a>
          </div>

          {/* Tarjeta 3: Correo Electrónico */}
          <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-8 h-8 rounded-md border border-mint-300 bg-white text-forest flex items-center justify-center mb-4">
                <Mail size={15} />
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                ATELIER DIGITAL
              </span>
              <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">
                Correo Electrónico
              </h3>
              <p className="text-xs text-forest-700/80 leading-relaxed mt-1.5">
                Dossiers de bodas, presupuestos corporativos y consultas especiales.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-0.5">
              <a
                href="mailto:atelier@almadeflor.es"
                className="font-serif text-xs font-semibold text-forest-900 hover:text-forest transition-colors underline underline-offset-2"
              >
                atelier@almadeflor.es
              </a>
              <a
                href="mailto:pedidos@almadeflor.es"
                className="font-serif text-xs text-forest-700 hover:text-forest transition-colors"
              >
                pedidos@almadeflor.es
              </a>
            </div>
          </div>

          {/* Tarjeta 4: Taller en Logroño */}
          <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-8 h-8 rounded-md bg-[#0e3b2b] text-white flex items-center justify-center mb-4">
                <Store size={15} />
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                VISÍTANOS
              </span>
              <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">
                Taller en Logroño
              </h3>
              <p className="text-xs text-forest-700/80 leading-relaxed mt-1.5">
                Junto a la Concatedral de Santa María de la Redonda en zona peatonal.
              </p>
            </div>
            <div className="mt-5 text-xs text-forest-900 leading-snug">
              <p className="font-serif font-semibold text-[13px]">Calle Portales 42</p>
              <p className="text-forest-600 text-[11px]">26001 Logroño, La Rioja</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLOQUE PRINCIPAL: FORMULARIO (IZQUIERDA) + INFO ATELIER / MAPA (DERECHA) */}
      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div
            ref={formRef}
            className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 border border-mint-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
              ATENCIÓN DIRECTA DEL FLORISTA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-forest-900 mt-2">
              Escríbenos tu Consulta o Encargo
            </h2>
            <p className="text-xs sm:text-sm text-forest-700/80 mt-2 leading-relaxed">
              Coméntanos la ocasión, gama de colores preferida o tus dudas florales. Elaboramos cada propuesta como una pieza botánica única.
            </p>

            {feedback && (
              <div
                className={`mt-5 rounded-md p-3.5 text-xs flex items-start gap-2.5 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-red-700 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Nombre y apellidos */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Nombre y apellidos <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Carmen Sáenz de Jubera"
                  className="w-full rounded-sm bg-[#f6f5f0] border border-transparent focus:border-forest focus:bg-white px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Fila de 2: Correo + Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Correo electrónico <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu-correo@ejemplo.com"
                    className="w-full rounded-sm bg-[#f6f5f0] border border-transparent focus:border-forest focus:bg-white px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Teléfono / WhatsApp <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+34 600 00 00 00"
                    className="w-full rounded-sm bg-[#f6f5f0] border border-transparent focus:border-forest focus:bg-white px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Tipo de consulta o proyecto */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Tipo de consulta o proyecto <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.tipo_consulta}
                  onChange={(e) => setFormData({ ...formData, tipo_consulta: e.target.value })}
                  className="w-full rounded-sm bg-[#f6f5f0] border border-transparent focus:border-forest focus:bg-white px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Pedido personalizado / Ramo a medida">
                    Pedido personalizado / Ramo a medida
                  </option>
                  <option value="Citas para Novias & Bodas">
                    Citas para Novias &amp; Bodas
                  </option>
                  <option value="Encargos Urgentes a Tanatorios">
                    Encargos Urgentes a Tanatorios / Condolencias
                  </option>
                  <option value="Talleres & Floristería Corporativa">
                    Talleres &amp; Floristería Corporativa
                  </option>
                  <option value="Duda sobre mi pedido o entrega">
                    Duda sobre mi pedido o entrega
                  </option>
                  <option value="Otra consulta especial">
                    Otra consulta especial
                  </option>
                </select>
              </div>

              {/* Fecha deseada de entrega / evento */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-forest-800">
                    Fecha deseada de entrega / evento
                  </label>
                  <span className="text-[10px] text-forest-600">Opcional</span>
                </div>
                <input
                  type="date"
                  value={formData.fecha_entrega}
                  onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                  className="w-full rounded-sm bg-[#f6f5f0] border border-transparent focus:border-forest focus:bg-white px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Cuéntanos tu idea */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Cuéntanos tu idea, dedicatoria o especificaciones <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Indícanos si buscas flores de temporada, tonos pastel, flores silvestres de La Rioja o cualquier detalle especial..."
                  className="w-full rounded-sm bg-[#f6f5f0] border border-transparent focus:border-forest focus:bg-white px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors resize-y"
                />
              </div>

              {/* Checkbox de Privacidad */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-[11px] text-forest-700/90 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.politica}
                    onChange={(e) => setFormData({ ...formData, politica: e.target.checked })}
                    className="accent-forest mt-0.5 rounded h-3.5 w-3.5 shrink-0"
                  />
                  <span>
                    He leído y acepto la política de privacidad. Consiento el tratamiento de mis datos personales para gestionar la consulta botánica.
                  </span>
                </label>
              </div>

              {/* Botón de Enviar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-sm bg-[#0e3b2b] text-white py-3 px-6 text-xs font-semibold tracking-wider hover:bg-forest/90 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Enviando al Atelier...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Consulta al Atelier</span>
                      <span className="text-sm">🪶</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* COLUMNA DERECHA: HORARIO + FOTO ATELIER + UBICACIÓN Y ACCESOS */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* 1. Tarjeta Horario del Atelier */}
            <div className="bg-white rounded-xl p-5 border border-mint-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between pb-3 border-b border-mint-100">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-forest-900">
                  <Clock size={16} className="text-forest" />
                  <span>Horario del Atelier</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Abierto
                </span>
              </div>

              <div className="mt-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-forest-800">Lunes a Viernes</span>
                  <span className="text-forest-600 text-[11px]">09:30 – 14:00 h &nbsp;|&nbsp; 17:00 – 20:30 h</span>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-mint-100/60">
                  <span className="font-medium text-forest-800">Sábados</span>
                  <span className="text-forest-600 text-[11px]">10:00 – 14:30 h</span>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-mint-100/60">
                  <span className="font-medium text-forest-800">Domingos &amp; Festivos</span>
                  <span className="text-forest-700 font-semibold text-[11px]">Urgencias &amp; Eventos</span>
                </div>
              </div>

              <p className="mt-3.5 border-t border-mint-100 pt-3 text-[11px] text-forest-600 leading-relaxed">
                Entregas programadas a tanatorios y ceremonias. Atención telefónica prioritaria de 09:00 a 13:00 h.
              </p>
            </div>

            {/* 2. Tarjeta Foto del Atelier */}
            <div className="overflow-hidden rounded-xl relative shadow-sm border border-mint-200/60 bg-[#162720]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/contacto/fachada-noche.png"
                alt="Atelier Botánico & Espacio de Creación"
                className="w-full h-auto object-cover block"
              />
            </div>

            {/* 3. Tarjeta Ubicación & Accesos */}
            <div className="bg-white rounded-xl p-5 border border-mint-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-forest-900">
                  <Compass size={16} className="text-forest" />
                  <span>Ubicación &amp; Accesos</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Calle+Portales+42+Logroño"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-forest hover:underline"
                >
                  <span>Cómo llegar</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              {/* Imagen del mapa */}
              <div className="relative mt-3 rounded-lg overflow-hidden border border-mint-200 bg-[#eef1ed]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/contacto/mapa.png"
                  alt="Mapa de ubicación en Logroño"
                  className="w-full h-auto object-cover block"
                />
              </div>

              {/* Dos mini-cajas informativas */}
              <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                <div className="rounded-md bg-[#f6f5f0] p-2.5 text-[11px]">
                  <span className="font-semibold text-forest-900 block flex items-center gap-1">
                    🅿️ PARKING ESPOLÓN
                  </span>
                  <span className="text-forest-600 text-[10px] leading-tight block mt-0.5">
                    A 3 minutos a pie. Parking subterráneo 24h.
                  </span>
                </div>
                <div className="rounded-md bg-[#f6f5f0] p-2.5 text-[11px]">
                  <span className="font-semibold text-forest-900 block flex items-center gap-1">
                    📦 CLICK &amp; COLLECT
                  </span>
                  <span className="text-forest-600 text-[10px] leading-tight block mt-0.5">
                    Carga y descarga rápida para recogida de pedidos.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN INFERIOR: SERVICIOS ESPECIALES & CANALES PRIORITARIOS */}
      <section className="border-t border-mint-200/80 bg-white py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-mint-100">
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
                ATENCIÓN DEDICADA
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-forest-900 mt-1">
                Servicios Especiales &amp; Canales Prioritarios
              </h2>
            </div>
            <p className="max-w-md text-xs text-forest-700 leading-relaxed md:text-right">
              Cada ocasión requiere un tiempo diferente: desde la intimidad de organizar tu boda hasta la urgencia respetuosa de un pésame.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Canal 1: Citas para Novias & Bodas */}
            <div className="bg-[#faf9f5] rounded-xl p-6 border border-mint-200/70 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="w-8 h-8 rounded-md bg-[#d8f0e3] text-emerald-800 flex items-center justify-center mb-4">
                  <Heart size={15} />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                  ESPACIO PRIVADO
                </span>
                <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">
                  Citas para Novias &amp; Bodas
                </h3>
                <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                  Reserva una sesión privada en nuestro showroom. Te recibimos con un café o vino blanco riojano para diseñar la paleta, ramo de novia y montaje de fincas con calma y detalle.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectService("Citas para Novias & Bodas")}
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-800 transition-colors text-left"
              >
                <span>Agendar cita de novias</span>
                <span>→</span>
              </button>
            </div>

            {/* Canal 2: Encargos Urgentes a Tanatorios */}
            <div className="bg-[#faf9f5] rounded-xl p-6 border border-mint-200/70 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="w-8 h-8 rounded-md bg-[#fdeee4] text-[#a04e28] flex items-center justify-center mb-4">
                  <Flame size={15} />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-amber-800 uppercase block">
                  LÍNEA PRIORITARIA 24/7
                </span>
                <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">
                  Encargos Urgentes a Tanatorios
                </h3>
                <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                  Atención directa sin esperas para coronas, centros de condolencias y ramos fúnebres de autor. Entregas directas en Tanatorio San José, Pastrana y comarcas de La Rioja.
                </p>
              </div>
              <a
                href="tel:+34941204060"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-800 transition-colors"
              >
                <span>Línea funeraria prioritaria</span>
                <span>📞</span>
              </a>
            </div>

            {/* Canal 3: Talleres & Floristería Corporativa */}
            <div className="bg-[#faf9f5] rounded-xl p-6 border border-mint-200/70 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="w-8 h-8 rounded-md bg-[#e3f0e8] text-forest flex items-center justify-center mb-4">
                  <Wine size={15} />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                  D.O.CA RIOJA &amp; ESPACIOS
                </span>
                <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">
                  Talleres &amp; Floristería Corporativa
                </h3>
                <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                  Diseño de ambientaciones botánicas para salones de cata, hoteles boutique y restaurantes gastronómicos. Suscripciones florales semanales con reposición garantizada.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectService("Talleres & Floristería Corporativa")}
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-800 transition-colors text-left"
              >
                <span>Solicitar dossier corporativo</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer id="contacto" className="border-t border-mint-200 py-8 text-center text-xs text-forest-600 bg-[#faf9f5]">
        © {new Date().getFullYear()} Alma de Flor · La Rioja
      </footer>
    </div>
  );
}
