"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Phone,
  Mail,
  Heart,
  Search,
  Truck,
  RotateCcw,
  Store,
  ArrowRight,
  Leaf,
} from "lucide-react";

const portfolio = [
  {
    id: 1,
    image: "/eventos/boda-botanica.png",
    tag: "BODAS DE VIÑEDO • BODEGA CENTENARIA",
    title: "Boda Botánica en Bodega de Rioja Alta",
    desc: "Arco orgánico con sarmientos y flor silvestre de la zona, centros de mesa con flor de temporada cultivada en el valle y luminarias suspendidas.",
    invitados: "180 personas",
    montaje: "Arco Ceremonia + 18 Mesas Imperiales",
  },
  {
    id: 2,
    image: "/eventos/quince-anos.png",
    tag: "CELEBRACIÓN PRIVADA • FINCA PALACIEGA",
    title: "Jardín Encantado de Quince Años",
    desc: "Túnel floral de bienvenida con glicinias y rosas de jardín, fotomatón botánico y dosel floral sobre la mesa principal.",
    invitados: "120 personas",
    montaje: "Túnel Floral + Photowall + Mesas Redondas",
  },
  {
    id: 3,
    image: "/eventos/ceremonia-romanica.png",
    tag: "CLAUSTRO MONÁSTICO • PATRIMONIO HISTÓRICO",
    title: "Ceremonia Lugareña & Claustro Románico",
    desc: "Composición floral sobria y elegante para pasillo central en claustro de piedra arenisca, laureles y olivos en vasijas de barro centenario.",
    invitados: "200 personas",
    montaje: "Pasillo Ceremonial + Altar Monástico + Peanas de Entrada",
  },
  {
    id: 4,
    image: "/eventos/gala-riojana.png",
    tag: "EVENTO CORPORATIVO • D.O.CA RIOJA",
    title: "Ambientación Institucional de Gala Riojana",
    desc: "Guirnaldas de laurel y flores en tonos vino para cena de gala corporativa en calado histórico, copas de cristal soplado y candelabros de forja.",
    invitados: "95 personas",
    montaje: "Calado Histórico + Mesas Imperiales + Rincón Protocolario",
  },
  {
    id: 5,
    image: "/eventos/sunset-valle-ebro.png",
    tag: "FIESTA PRIVADA • PAISAJE SINGULAR",
    title: "Campamento Sunset del Valle del Ebro",
    desc: "Montaje boho chic con pampas grass, maderas rústicas y alfombras bereberes. Iluminación con guirnaldas y antorchas para atardecer riojano.",
    invitados: "60 personas",
    montaje: "Zona Chillout + Estructura Tipí + Fuego Central",
  },
  {
    id: 6,
    image: "/eventos/aniversario-privado.png",
    tag: "ANIVERSARIO EXCLUSIVO • CASTILLO MEDIEVAL",
    title: "Cena de Gala & Aniversario Privado",
    desc: "Mesa imperial en salón de banquetes medieval con rosas terciopelo rojo, velas de cera de abeja y fruteros con uvas frescas de temporada.",
    invitados: "45 personas",
    montaje: "Mesa Presidencial + Iluminación Vela + Calado Histórico",
  },
];

const steps = [
  {
    num: "01",
    Icon: Heart,
    title: "Entrevista & Moodboard",
    desc: "Nos reunimos en el atelier o por videollamada para conocer vuestra visión, paleta cromática, tipo de espacio y preferencias botánicas. Creamos una propuesta y presupuesto sin compromiso.",
  },
  {
    num: "02",
    Icon: Search,
    title: "Visita Técnica & Prueba Real",
    desc: "Visitamos el espacio del evento para evaluar iluminación, corrientes, puntos de anclaje y escala. Elaboramos una muestra real de centro de mesa para vuestra aprobación final.",
  },
  {
    num: "03",
    Icon: Truck,
    title: "Logística & Montaje In-Situ",
    desc: "Transporte refrigerado propio el mismo día del evento. Nuestro equipo de floristas realiza el montaje in-situ cuidando cada detalle hasta el último minuto previo a la llegada.",
  },
  {
    num: "04",
    Icon: RotateCcw,
    title: "Desmontaje Responsable",
    desc: "Una vez concluido el evento, nos encargamos de la recogida rápida y respetuosa. Ofrecemos servicio de empaquetado para que los invitados puedan llevarse las flores a casa.",
  },
];

export default function EventosView() {
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipo_celebracion: "Boda completa (Ceremonia + Banquete)",
    fecha_evento: "",
    invitados: "",
    lugar: "",
    mensaje: "",
    politica: false,
  });

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.politica) {
      setFeedback({
        type: "error",
        message: "Por favor, acepta la política de privacidad para enviar la solicitud.",
      });
      return;
    }

    setSending(true);
    setFeedback(null);

    try {
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        tipo_consulta: `[Evento: ${formData.tipo_celebracion}] Invitados: ${formData.invitados || "N/A"} - Espacio: ${formData.lugar || "Sin definir"}`,
        fecha_entrega: formData.fecha_evento,
        mensaje: formData.mensaje,
        origen: "evento",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar la solicitud.");

      setFeedback({
        type: "success",
        message: "¡Solicitud recibida! Nuestro equipo de eventos revisará la disponibilidad de fecha y os contactará en menos de 24 horas con una propuesta preliminar.",
      });

      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        tipo_celebracion: "Boda completa (Ceremonia + Banquete)",
        fecha_evento: "",
        invitados: "",
        lugar: "",
        mensaje: "",
        politica: false,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Ocurrió un error. Por favor inténtalo de nuevo.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen text-forest-900">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-[1240px] px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Columna Izquierda */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-mint-200 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-forest-700 uppercase">
              <Leaf size={11} /> DISEÑO FLORAL PARA BODAS Y GRANDES EVENTOS
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.15] text-[#0f2c22]">
              Diseño Floral para Momentos <br className="hidden sm:inline" />
              Inolvidables en La Rioja
            </h1>
            <p className="mt-5 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-forest-700">
              Transformamos espacios emblemáticos en celebraciones experienciales. Diseñamos montajes florales monumentales que dialogan con la arquitectura, el paisaje y la luz única de las bodegas, monasterios y fincas de La Rioja.
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={scrollToForm}
                className="rounded-sm bg-[#0e3b2b] px-6 py-3.5 text-xs font-semibold tracking-wider text-white hover:bg-forest/90 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span>Solicitar dossier de bodas &amp; eventos</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-mint-200/70 grid grid-cols-3 gap-6">
              <div>
                <span className="font-serif text-3xl font-semibold text-forest-900 block">+180</span>
                <span className="text-[11px] font-medium text-forest-600 uppercase tracking-wider block mt-0.5">
                  Bodas y Eventos
                </span>
              </div>
              <div className="border-l border-mint-200 pl-6">
                <span className="font-serif text-3xl font-semibold text-forest-900 block">14 Años</span>
                <span className="text-[11px] font-medium text-forest-600 uppercase tracking-wider block mt-0.5">
                  En el sector
                </span>
              </div>
              <div className="border-l border-mint-200 pl-6">
                <span className="font-serif text-3xl font-semibold text-forest-900 block">100% Proximidad</span>
                <span className="text-[11px] font-medium text-forest-600 uppercase tracking-wider block mt-0.5">
                  Flores de cultivo riojano
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Foto de Gran Boda con Nube Floral */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-mint-200/60 bg-[#162720]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/eventos/boda-imperial.png"
                alt="Boda imperial en bodega con nube floral"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                <span className="text-[9px] uppercase tracking-widest text-mint-200 block font-semibold">
                  FINCA VALDEGUERRA • VALLE DEL EBRO
                </span>
                <h3 className="font-serif text-base font-semibold text-white mt-1 leading-snug">
                  Boda imperial con nube floral y candelabros de latón
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUESTRAS CREACIONES EN ESPACIOS EMBLEMÁTICOS (PORTFOLIO) */}
      <section className="bg-white py-20 border-t border-mint-200/70">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-mint-200">
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
                PORTFOLIO SELECTO
              </span>
              <h2 className="font-serif text-3xl font-semibold text-forest-900 mt-1">
                Nuestras Creaciones en Espacios Emblemáticos
              </h2>
            </div>
            <p className="max-w-md text-xs text-forest-700 leading-relaxed md:text-right">
              Cada proyecto es un diálogo exclusivo entre el carácter botánico, el entorno patrimonial y la visión personal de los anfitriones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <article
                key={item.id}
                className="bg-[#faf9f5] rounded-xl overflow-hidden border border-mint-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#e4e7e2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                      {item.tag}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-forest-900 mt-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-mint-200/60 bg-white/60">
                  <div className="text-[10px] text-forest-700 font-medium space-y-0.5">
                    <p className="flex items-center gap-1.5">
                      <span className="font-semibold text-forest-900">INVITADOS:</span> {item.invitados}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="font-semibold text-forest-900">MONTAJE:</span> {item.montaje}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. METODOLOGÍA & SERVICIO (¿CÓMO CREAMOS LA MAGIA BOTÁNICA?) */}
      <section className="bg-[#f5f4ef] py-20 border-t border-mint-200/70">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
              METODOLOGÍA &amp; SERVICIO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest-900 mt-1">
              ¿Cómo Creamos la Magia Botánica de tu Evento?
            </h2>
            <p className="text-xs sm:text-sm text-forest-700 leading-relaxed mt-2">
              Un proceso riguroso y artesanal para asegurar que el día de tu evento todo luzca impecable, fresco y en perfecta armonía con el entorno.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((st) => {
              const Icon = st.Icon;
              return (
                <div
                  key={st.num}
                  className="bg-white rounded-xl p-5 border border-mint-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-2xl font-bold text-forest-800">
                        {st.num}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#d8f0e3] text-[#0e3b2b] flex items-center justify-center">
                        <Icon size={15} />
                      </div>
                    </div>
                    <h3 className="font-serif text-base font-bold text-forest-900 leading-snug">
                      {st.title}
                    </h3>
                    <p className="mt-2 text-xs text-forest-700/80 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HABLEMOS DE TU PROYECTO BOTÁNICO (FORMULARIO DE EVENTOS) */}
      <section ref={formRef} className="bg-white py-20 border-t border-mint-200/70">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Columna Izquierda: Información y Reserva */}
            <div className="lg:col-span-5">
              <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
                RESERVA DE FECHAS &amp; PRESUPUESTOS
              </span>
              <h2 className="font-serif text-3xl font-semibold text-forest-900 mt-1">
                Hablemos de tu Proyecto Botánico
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-forest-700 leading-relaxed">
                Las fechas para bodas y eventos en temporada alta (mayo a octubre) se reservan con varios meses de antelación. Cuéntanos vuestra idea y coordinaremos una cita en el taller o videollamada para comenzar a dar vida a vuestro sueño floral.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-[#faf9f5] p-3.5 border border-mint-200/70">
                  <div className="w-8 h-8 rounded-md bg-[#0e3b2b] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Store size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-forest-900">Atelier Botánico &amp; Showroom</h4>
                    <p className="text-[11px] text-forest-600 mt-0.5">
                      Calle Portales 42, Casco Histórico (26001 Logroño)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-[#faf9f5] p-3.5 border border-mint-200/70">
                  <div className="w-8 h-8 rounded-md bg-[#d8f0e3] text-[#0e3b2b] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-forest-900">Atención Directa de Eventos</h4>
                    <p className="text-[11px] text-forest-600 mt-0.5">
                      bodas@almadeflor.es &nbsp;•&nbsp; +34 941 20 40 60
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-[#faf9f5] p-3.5 border border-mint-200/70">
                  <div className="w-8 h-8 rounded-md bg-white border border-mint-300 text-forest flex items-center justify-center shrink-0 mt-0.5">
                    <Heart size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-forest-900">Compromiso de Exclusividad</h4>
                    <p className="text-[11px] text-forest-600 mt-0.5">
                      Máximo 2 bodas por fin de semana para garantizar presencia total del equipo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-[#f6f5f0] p-4 text-[11px] text-forest-700 leading-relaxed border border-mint-200/60">
                <span className="font-semibold text-forest-900 block mb-0.5">Horario de Atención:</span>
                Lunes a Viernes de 09:30 a 14:00 h y de 17:00 a 20:30 h. Sábados con cita previa.
              </div>
            </div>

            {/* Columna Derecha: Formulario de Eventos */}
            <div className="lg:col-span-7 bg-[#faf9f5] rounded-xl p-6 sm:p-8 border border-mint-200/80 shadow-sm">
              {feedback && (
                <div
                  className={`mb-6 rounded-md p-3.5 text-xs flex items-start gap-2.5 ${
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fila 1: Nombre + Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-forest-800 mb-1">
                      Nombre de los anfitriones / contacto <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej. Carmen y Javier / Familia Pérez"
                      className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest-800 mb-1">
                      Teléfono / WhatsApp de contacto <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Fila 2: Correo + Tipo de Celebración */}
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
                      placeholder="vuestro-email@ejemplo.com"
                      className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest-800 mb-1">
                      Tipo de celebración <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.tipo_celebracion}
                      onChange={(e) => setFormData({ ...formData, tipo_celebracion: e.target.value })}
                      className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Boda completa (Ceremonia + Banquete)">
                        Boda completa (Ceremonia + Banquete)
                      </option>
                      <option value="Boda íntima / Elopement">
                        Boda íntima / Elopement
                      </option>
                      <option value="Evento corporativo o gala">
                        Evento corporativo o gala
                      </option>
                      <option value="Celebración privada (Aniversario, Cumpleaños)">
                        Celebración privada (Aniversario, Cumpleaños)
                      </option>
                      <option value="Ambientación para espacio / local">
                        Ambientación para espacio / local
                      </option>
                    </select>
                  </div>
                </div>

                {/* Fila 3: Fecha + Invitados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-forest-800 mb-1">
                      Fecha deseada del evento <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.fecha_evento}
                      onChange={(e) => setFormData({ ...formData, fecha_evento: e.target.value })}
                      className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest-800 mb-1">
                      Número aprox. de invitados
                    </label>
                    <input
                      type="text"
                      value={formData.invitados}
                      onChange={(e) => setFormData({ ...formData, invitados: e.target.value })}
                      placeholder="Ej. 150 invitados"
                      className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Lugar o Espacio */}
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Lugar o espacio del evento (si ya está decidido)
                  </label>
                  <input
                    type="text"
                    value={formData.lugar}
                    onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                    placeholder="Ej. Bodega en Rioja Alta, Finca privada, Monasterio, etc."
                    className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Cuéntanos vuestra idea, gama de colores o necesidades <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Describidnos vuestro estilo, flores que os gusten, si necesitáis arco ceremonial, centros de mesa, ramos de novia..."
                    className="w-full rounded-sm bg-white border border-mint-200 focus:border-forest px-3.5 py-2.5 text-xs text-forest-900 focus:outline-none transition-colors resize-y"
                  />
                </div>

                {/* Checkbox Privacidad */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-[11px] text-forest-700/90 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.politica}
                      onChange={(e) => setFormData({ ...formData, politica: e.target.checked })}
                      className="accent-forest mt-0.5 rounded h-3.5 w-3.5 shrink-0"
                    />
                    <span>
                      He leído y acepto la política de privacidad. Consiento el tratamiento de mis datos para gestionar la propuesta del evento.
                    </span>
                  </label>
                </div>

                {/* Botón */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-sm bg-[#0e3b2b] text-white py-3 px-6 text-xs font-semibold tracking-wider hover:bg-forest/90 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Enviando solicitud...</span>
                      </>
                    ) : (
                      <>
                        <span>Solicitar Propuesta Floral Personalizada</span>
                        <span className="text-sm">🪶</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-forest-600 mt-2">
                    Sin compromiso. Responderemos con disponibilidad de fecha y presupuesto preliminar en menos de 24 horas.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BANNER EN VERDE BOSQUE PROFUNDO */}
      <section className="bg-[#0a271c] text-white py-16 px-6 text-center">
        <div className="mx-auto max-w-[900px]">
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic font-normal leading-snug text-white/95">
            &ldquo;Cada celebración merece florecer como una obra viva, irrepetible y en profunda armonía con la tierra de La Rioja.&rdquo;
          </blockquote>
          <p className="mt-6 text-[10px] tracking-[0.2em] text-mint-200 uppercase font-semibold">
            FLORISTERÍA BOTÁNICA DE AUTOR PARA BODAS Y EVENTOS SINGULARES • LOGROÑO &amp; LA RIOJA
          </p>
          <p className="mt-1 text-xs text-mint-300/80">
            Fincas vitivinícolas • Monasterios • Hoteles de ensueño • Salones de cata
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-mint-200">
            <Link href="/quienes-somos" className="hover:text-white transition">Quiénes Somos</Link>
            <span>•</span>
            <Link href="/ramos" className="hover:text-white transition">Ramos</Link>
            <span>•</span>
            <Link href="/eventos" className="hover:text-white transition font-semibold text-white">Bodas</Link>
            <span>•</span>
            <Link href="/contacto" className="hover:text-white transition">Contacto</Link>
          </div>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer id="eventos" className="border-t border-mint-200 py-8 text-center text-xs text-forest-600 bg-[#faf9f5]">
        © {new Date().getFullYear()} Alma de Flor · La Rioja
      </footer>
    </div>
  );
}
