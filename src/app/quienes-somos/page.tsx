import type { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  ArrowDown,
  Sparkles,
  Droplets,
  Store,
  Clock,
  Heart,
  MapPin,
  Star,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quiénes Somos — Alma de Flor",
  description: "Conoce nuestra historia, floristas en residencia y el compromiso botánico artesanal que define a Alma de Flor en Logroño, La Rioja.",
};

export default function QuienesSomosPage() {
  return (
    <div className="bg-[#faf9f5] min-h-screen text-forest-900">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-[1240px] px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Columna Izquierda: Texto */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-mint-200 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-forest-700 uppercase">
              <Leaf size={11} /> COMPROMISO BOTÁNICO RIOJANO
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.15] text-[#0f2c22]">
              El Arte de Esculpir <br className="hidden sm:inline" />
              <span className="italic font-normal">Naturaleza Viva</span>
            </h1>
            <p className="mt-5 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-forest-700">
              Bajo la mirada atenta de nuestra florista de guardia y fundadora, Alma de Flor nace en 2012 para devolver la emoción a la floristería tradicional. Seleccionamos variedades autóctonas cultivadas en el Valle del Ebro y diseñamos composiciones vivas donde la flor de temporada es la protagonista absoluta.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/ramos"
                className="rounded-sm bg-[#0e3b2b] px-6 py-3 text-xs font-semibold tracking-wider text-white hover:bg-forest/90 transition-colors shadow-sm"
              >
                Ver nuestra colección
              </Link>
              <a
                href="#manifiesto"
                className="inline-flex items-center gap-1.5 rounded-sm border border-forest/30 bg-white px-5 py-3 text-xs font-semibold text-forest-900 hover:bg-forest/5 transition-colors"
              >
                <span>Conoce nuestro manifiesto</span>
                <ArrowDown size={13} />
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-mint-200/70 flex items-center gap-12">
              <div>
                <span className="font-serif text-3xl font-semibold text-forest-900 block">100%</span>
                <span className="text-[11px] font-medium text-forest-600 uppercase tracking-wider block mt-0.5">
                  Flores de Proximidad
                </span>
              </div>
              <div className="border-l border-mint-200 pl-12">
                <span className="font-serif text-3xl font-semibold text-forest-900 block">14 Años</span>
                <span className="text-[11px] font-medium text-forest-600 uppercase tracking-wider block mt-0.5">
                  De Oficio &amp; Pasión
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Collage Fotográfico */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-mint-200/60 bg-[#e7ebe5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/quienes-somos/esculpir-naturaleza.jpg"
                alt="Elaboración floral en taller"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Foto secundaria superpuesta */}
            <div className="absolute -bottom-6 -right-2 sm:-right-4 w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border-4 border-white bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/quienes-somos/taller-cultivo-etico.png"
                alt="Talleres con flores de cultivo ético en Logroño"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-forest/90 backdrop-blur-sm p-2 text-center text-white">
                <span className="text-[8px] uppercase tracking-widest text-mint-200 block font-semibold">TALLER LOGROÑO</span>
                <span className="text-[10px] font-medium leading-tight block text-white/95 mt-0.5">
                  Talleres con flores de cultivo ético
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MANIFIESTO EN VERDE BOSQUE PROFUNDO */}
      <section id="manifiesto" className="relative overflow-hidden bg-[#0a271c] text-white py-20 px-6">
        {/* Silueta de hoja orgánica en el fondo */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.06] pointer-events-none select-none text-emerald-300">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <path d="M42.7,-64.1C54.9,-56.3,64.2,-43.8,71.2,-29.8C78.2,-15.8,82.9,-0.3,80.1,14.6C77.4,29.4,67.3,43.7,54.5,54.3C41.7,65,26.2,72,9.6,74.9C-7,77.9,-24.8,76.8,-39.7,69.5C-54.6,62.2,-66.6,48.7,-74.1,33.1C-81.5,17.4,-84.4,-0.4,-79.8,-16.4C-75.1,-32.4,-63,-46.5,-48.7,-53.8C-34.4,-61.1,-17.2,-61.6,-0.5,-60.9C16.3,-60.1,30.5,-71.9,42.7,-64.1Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-[1000px] text-center">
          <span className="text-[10px] tracking-[0.25em] text-mint-200 uppercase font-semibold">
            FILOSOFÍA BOTÁNICA • MANIFIESTO ALMA DE FLOR
          </span>
          <blockquote className="mt-6 font-serif text-2xl sm:text-4xl italic font-normal leading-snug max-w-3xl mx-auto text-white/95">
            “Tratamos cada tallo con la reverencia de una escultura efímera, venerando los ciclos de la tierra y la nobleza del trabajo artesanal.”
          </blockquote>
          <p className="mt-6 max-w-2xl mx-auto text-xs sm:text-sm text-mint-200/90 leading-relaxed">
            Frente a la floristería industrializada y efímera de plástico, defendemos una floristería viva y honesta. Cada composición floral lleva impresa la huella del recolector, el clima de nuestra ribera y la dedicación paciente de nuestros maestros floristas.
          </p>

          {/* 3 Valores */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="rounded-lg bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border border-mint-300/40 bg-mint-400/10 flex items-center justify-center text-mint-200 mb-3">
                <Sparkles size={15} />
              </div>
              <h4 className="font-serif font-semibold text-sm text-white">Cero Plásticos de Envoltorio</h4>
              <p className="mt-1.5 text-xs text-mint-200/80 leading-relaxed">
                Papeles verjurados, cuerdas de yute y celofán biodegradable. Todo vuelve a la tierra.
              </p>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border border-mint-300/40 bg-mint-400/10 flex items-center justify-center text-mint-200 mb-3">
                <Droplets size={15} />
              </div>
              <h4 className="font-serif font-semibold text-sm text-white">Hidratación Óptima</h4>
              <p className="mt-1.5 text-xs text-mint-200/80 leading-relaxed">
                Nutrientes minerales exclusivos para que las flores mantengan su vigor hasta 12 días.
              </p>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border border-mint-300/40 bg-mint-400/10 flex items-center justify-center text-mint-200 mb-3">
                <Store size={15} />
              </div>
              <h4 className="font-serif font-semibold text-sm text-white">Economía de Cercanía</h4>
              <p className="mt-1.5 text-xs text-mint-200/80 leading-relaxed">
                Compramos directamente a cultivadores de La Rioja, Navarra y Álava, apoyando el campo local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOS TRES PILARES DE NUESTRO OFICIO */}
      <section className="bg-[#faf9f5] py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-mint-200">
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
                NUESTRO MÉTODO ARTESANAL
              </span>
              <h2 className="font-serif text-3xl font-semibold text-forest-900 mt-1">
                Los Tres Pilares de Nuestro Oficio
              </h2>
            </div>
            <p className="max-w-md text-xs text-forest-700 leading-relaxed md:text-right">
              Un proceso milimétrico que combina tradición botánica con la vanguardia del diseño floral contemporáneo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilar 1 */}
            <div className="bg-white rounded-xl overflow-hidden border border-mint-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-mint-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/quienes-somos/corte-manana.png"
                    alt="Corte de Mañana Diario"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                    01 • RECOLECCIÓN AL ALBA
                  </span>
                  <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">Corte de Mañana Diario</h3>
                  <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                    Recolectamos de madrugada en nuestros cultivos asociados para que recibas flores con el máximo vigor celular y aroma intacto.
                  </p>
                </div>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white rounded-xl overflow-hidden border border-mint-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-mint-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/quienes-somos/armonia-botanica.png"
                    alt="Armonía Botánica de Autor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                    02 • DISEÑO Y COMPOSICIÓN
                  </span>
                  <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">Armonía Botánica de Autor</h3>
                  <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                    Equilibrio botánico entre texturas silvestres y variedades nobles. Composiciones que respiran y evolucionan con gracia en el jarrón.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <Link
                  href="/arreglos-florales"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                >
                  <span>Explorar composiciones</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white rounded-xl overflow-hidden border border-mint-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-mint-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/quienes-somos/compromiso-etico.png"
                    alt="Compromiso Ético y Circular"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                    03 • PACKAGING SOSTENIBLE
                  </span>
                  <h3 className="font-serif text-lg font-bold text-forest-900 mt-1">Compromiso Ético y Circular</h3>
                  <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                    Embalajes sostenibles de celulosa libre de cloro y 100% reciclables. Envíos en furgoneta refrigerada para preservar la cadena de frío.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <a
                  href="#manifiesto"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                >
                  <span>Saber más sobre el envase</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLORISTAS EN RESIDENCIA */}
      <section className="bg-white py-20 border-t border-mint-200/70">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
              MANOS QUE CREAN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest-900 mt-1">
              Floristas en Residencia
            </h2>
            <p className="text-xs sm:text-sm text-forest-700 leading-relaxed mt-2">
              El corazón de Alma de Flor: tres floristas apasionados que unen botánica clásica, sensibilidad artística e innovación contemporánea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Elena */}
            <div className="bg-[#faf9f5] rounded-xl overflow-hidden border border-mint-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#e4e7e2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/quienes-somos/elena-jubera.png"
                    alt="Elena Sáenz de Jubera"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                    FUNDADORA &amp; DIRECTORA BOTÁNICA
                  </span>
                  <h3 className="font-serif text-xl font-bold text-forest-900 mt-1">Elena Sáenz de Jubera</h3>
                  <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                    Maestra florista por la Escuela de Barcelona. Con más de 18 años dedicados al arte floral, su visión aúna el rigor técnico con la soltura silvestre de la flora riojana.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 border-t border-mint-200/50">
                <span className="text-[11px] text-forest-800 font-medium block">
                  🌸 Flor favorita: Hortensia &ldquo;Annabelle&rdquo; y rosa David Austin
                </span>
              </div>
            </div>

            {/* Mateo */}
            <div className="bg-[#faf9f5] rounded-xl overflow-hidden border border-mint-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#e4e7e2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/quienes-somos/mateo-gomez.png"
                    alt="Mateo Gómez"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                    MAESTRO FLORISTA &amp; ARREGLOS
                  </span>
                  <h3 className="font-serif text-xl font-bold text-forest-900 mt-1">Mateo Gómez</h3>
                  <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                    Especialista en floristería monumental y diseño para grandes eventos y fincas. Creador de nuestras composiciones florales en recipientes cerámicos.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 border-t border-mint-200/50">
                <span className="text-[11px] text-forest-800 font-medium block">
                  🌿 Flor favorita: Delphinium azul cielo y eucalipto parvifolia
                </span>
              </div>
            </div>

            {/* Lucía */}
            <div className="bg-[#faf9f5] rounded-xl overflow-hidden border border-mint-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#e4e7e2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/quienes-somos/lucia-baquedano.png"
                    alt="Lucía Baquedano"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-semibold tracking-wider text-forest-600 uppercase block">
                    DISEÑADORA DE NOVIAS &amp; EVENTOS
                  </span>
                  <h3 className="font-serif text-xl font-bold text-forest-900 mt-1">Lucía Baquedano</h3>
                  <p className="text-xs text-forest-700/80 leading-relaxed mt-2">
                    Arquitecta de formación reconvertida al arte botánico. Encargada de plasmar las historias de amor en ramos de novia y decoraciones nupciales inolvidables.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 border-t border-mint-200/50">
                <span className="text-[11px] text-forest-800 font-medium block">
                  🌺 Flor favorita: Peonía &ldquo;Coral Sunset&rdquo; y olivo centenario
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NUESTRA TRAVESÍA EN CUATRO ESTACIONES */}
      <section className="bg-[#f5f4ef] py-16 border-t border-mint-200/70">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
              EVOLUCIÓN Y LEGADO
            </span>
            <h2 className="font-serif text-3xl font-semibold text-forest-900 mt-1">
              Nuestra Travesía en Cuatro Estaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 2012 */}
            <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-sm">
              <span className="font-serif text-2xl font-bold text-forest-900 block">2012</span>
              <h4 className="font-serif font-semibold text-sm text-forest-900 mt-2">La Primera Semilla</h4>
              <p className="mt-1.5 text-xs text-forest-700/80 leading-relaxed">
                Apertura del pequeño puesto original en la Calle Portales de Logroño, con apenas 12 variedades de temporada.
              </p>
            </div>

            {/* 2016 */}
            <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-sm">
              <span className="font-serif text-2xl font-bold text-forest-900 block">2016</span>
              <h4 className="font-serif font-semibold text-sm text-forest-900 mt-2">El Gran Taller</h4>
              <p className="mt-1.5 text-xs text-forest-700/80 leading-relaxed">
                Ampliación al atelier actual con espacio de cata floral, formación botánica y almacén refrigerado propio.
              </p>
            </div>

            {/* 2020 */}
            <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-sm">
              <span className="font-serif text-2xl font-bold text-forest-900 block">2020</span>
              <h4 className="font-serif font-semibold text-sm text-forest-900 mt-2">Floristería Circular</h4>
              <p className="mt-1.5 text-xs text-forest-700/80 leading-relaxed">
                Eliminación total del plástico en el empaque y adhesión al pacto riojano por la biodiversidad floral.
              </p>
            </div>

            {/* Hoy */}
            <div className="bg-white rounded-lg p-5 border border-mint-200/70 shadow-sm">
              <span className="font-serif text-2xl font-bold text-forest-900 block">Hoy</span>
              <h4 className="font-serif font-semibold text-sm text-forest-900 mt-2">Atelier Digital &amp; Vivo</h4>
              <p className="mt-1.5 text-xs text-forest-700/80 leading-relaxed">
                Entrega en el día en toda La Rioja y servicio integral para bodas de autor, grandes empresas y homenajes fúnebres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. UN REFUGIO BOTÁNICO EN EL CORAZÓN DE LOGROÑO */}
      <section className="bg-white py-20 border-t border-mint-200/70">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Columna Izquierda: Información del Taller */}
            <div className="lg:col-span-6">
              <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
                VISITA EL ATELIER
              </span>
              <h2 className="font-serif text-3xl font-semibold text-forest-900 mt-1">
                Un Refugio Botánico en el Corazón de Logroño
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-forest-700 leading-relaxed">
                En pleno Casco Antiguo de Logroño, nuestro atelier abre sus puertas como un santuario floral entre arcos de piedra centenarios. Un espacio donde oler, tocar y elegir cada tallo con calma, rodeado del aroma de lavanda y café recién hecho.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-[#faf9f5] p-3.5 border border-mint-200/70">
                  <div className="w-8 h-8 rounded-md bg-[#0e3b2b] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Store size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-forest-900">Calle Portales 42, Casco Histórico</h4>
                    <p className="text-[11px] text-forest-600 mt-0.5">
                      26001 Logroño, La Rioja (Junto a la Concatedral de Santa María de la Redonda)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-[#faf9f5] p-3.5 border border-mint-200/70">
                  <div className="w-8 h-8 rounded-md bg-[#d8f0e3] text-[#0e3b2b] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-forest-900">Horario del Taller Botánico</h4>
                    <p className="text-[11px] text-forest-600 mt-0.5">
                      Lunes a Viernes: 09:30 – 14:00 h | 17:00 – 20:30 h • Sábados: 10:00 – 14:30 h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-[#faf9f5] p-3.5 border border-mint-200/70">
                  <div className="w-8 h-8 rounded-md bg-white border border-mint-300 text-forest flex items-center justify-center shrink-0 mt-0.5">
                    <Heart size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-forest-900">Citas Privadas para Novias &amp; Eventos</h4>
                    <p className="text-[11px] text-forest-600 mt-0.5">
                      Atención personalizada con café o vino riojano. Reserva previa recomendada.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#0e3b2b] px-6 py-3 text-xs font-semibold tracking-wider text-white hover:bg-forest/90 transition-colors shadow-sm"
                >
                  <span>Cómo llegar a nuestro taller</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Columna Derecha: Fotos del Taller y Mapa */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="rounded-xl overflow-hidden border border-mint-200 shadow-sm bg-[#162720]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/quienes-somos/taller-flores.png"
                  alt="Interior del taller botánico Alma de Flor"
                  className="w-full h-auto object-cover block"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden border border-mint-200 bg-[#eef1ed]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/contacto/mapa.png"
                  alt="Mapa de ubicación del taller"
                  className="w-full h-auto object-cover block"
                />
                <div className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-forest-800 shadow-sm flex items-center gap-1">
                  <MapPin size={11} className="text-forest fill-forest/20" />
                  <span>Junto a Santa María de la Redonda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ECOS DE QUIENES NOS ELIGEN (TESTIMONIOS) */}
      <section className="bg-[#faf9f5] py-20 border-t border-mint-200/70">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-semibold tracking-widest text-forest-600 uppercase block">
              PALABRAS QUE NOS HONRAN
            </span>
            <h2 className="font-serif text-3xl font-semibold text-forest-900 mt-1">
              Ecos de Quienes Nos Eligen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonio 1 */}
            <div className="bg-white rounded-xl p-6 border border-mint-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-serif text-base italic text-forest-900 leading-snug">
                  &ldquo;El ramo para la boda de mi hermana fue sencillamente una obra de arte. La atención de Elena y su equipo no tiene parangón en toda La Rioja.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-mint-100">
                <div className="w-8 h-8 rounded-full bg-[#d8f0e3] text-forest font-serif font-bold text-xs flex items-center justify-center">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-forest-900">Patricia M. Ruiz</h4>
                  <span className="text-[11px] text-forest-600 block">Novia en Finca de los Arandinos</span>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white rounded-xl p-6 border border-mint-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-serif text-base italic text-forest-900 leading-snug">
                  &ldquo;El servicio de coronas fúnebres fue de una sensibilidad y pulcritud que agradecimos enormemente en un momento tan doloroso.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-mint-100">
                <div className="w-8 h-8 rounded-full bg-[#d8f0e3] text-forest font-serif font-bold text-xs flex items-center justify-center">
                  M
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-forest-900">Marcos Eguizábal</h4>
                  <span className="text-[11px] text-forest-600 block">Cliente particular, Logroño</span>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white rounded-xl p-6 border border-mint-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-serif text-base italic text-forest-900 leading-snug">
                  &ldquo;Contamos con Alma de Flor para la ambientación floral de nuestro restaurante con estrella Michelin. Flores frescas, frescas de verdad.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-mint-100">
                <div className="w-8 h-8 rounded-full bg-[#d8f0e3] text-forest font-serif font-bold text-xs flex items-center justify-center">
                  D
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-forest-900">Chef David Calvo</h4>
                  <span className="text-[11px] text-forest-600 block">Restaurante Gastronómico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer id="quienes-somos" className="border-t border-mint-200 py-8 text-center text-xs text-forest-600 bg-[#faf9f5]">
        © {new Date().getFullYear()} Alma de Flor · La Rioja
      </footer>
    </div>
  );
}
