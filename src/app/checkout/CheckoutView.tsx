"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Wallet,
  Banknote,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  QrCode,
  ShieldCheck,
  Truck,
  Calendar,
  AlertCircle,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { money, todayISO } from "@/lib/types";
import ProductImage from "@/components/ProductImage";

type PaymentMethod = "tarjeta" | "mercadopago" | "rapipago" | "transferencia";

interface PaymentResponse {
  id: number;
  orderNumber: string;
  totalCents: number;
  totalFormatted: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "aprobado" | "pendiente";
  paymentMeta: Record<string, any>;
  externalRef: string;
}

export interface CheckoutUser {
  id: number;
  nombre: string;
  apellido: string | null;
  email: string;
  telefono: string | null;
}

interface CheckoutViewProps {
  user: CheckoutUser;
}

export default function CheckoutView({ user }: CheckoutViewProps) {
  const router = useRouter();
  const { items, totalCents, clear } = useCart();

  // Verificación adicional del estado de autenticación en cliente
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/registro?redirect=/checkout");
        }
      })
      .catch(() => {});
  }, [router]);

  // Estados de proceso
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState<PaymentResponse | null>(null);

  // Descripciones complementarias por si algún ítem no traía descripción en localStorage
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});

  // Método de pago seleccionado
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("tarjeta");

  const fullName = `${user.nombre} ${user.apellido || ""}`.trim();

  // Datos de tarjeta
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: fullName.toUpperCase(),
    expiry: "",
    cvv: "",
    dni: "",
    installments: "1",
    cardBrand: "Visa",
  });
  const [showCvv, setShowCvv] = useState(false);

  // Datos de Mercado Pago
  const [mpOption, setMpOption] = useState<"balance" | "qr">("balance");

  // Datos de Rapipago
  const [rapipagoDni, setRapipagoDni] = useState("");

  // Estado de copiado al portapapeles
  const [copiedCode, setCopiedCode] = useState(false);

  // Obtener descripciones faltantes desde el backend
  useEffect(() => {
    const missingIds = items.filter((i) => !i.description).map((i) => i.productId);
    if (missingIds.length > 0) {
      fetch(`/api/products/details?ids=${missingIds.join(",")}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Array<{ id: number; description: string }>) => {
          const map: Record<number, string> = {};
          data.forEach((p) => {
            map[p.id] = p.description;
          });
          setDescriptions((prev) => ({ ...prev, ...map }));
        })
        .catch(() => {});
    }
  }, [items]);

  // Formatear número de tarjeta con espacios cada 4 dígitos
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    // Detectar marca
    let brand = "Visa";
    if (value.startsWith("5") || value.startsWith("2")) {
      brand = "Mastercard";
    } else if (value.startsWith("34") || value.startsWith("37")) {
      brand = "American Express";
    }
    setCardData((prev) => ({
      ...prev,
      cardNumber: value.replace(/(\d{4})/g, "$1 ").trim(),
      cardBrand: brand,
    }));
  };

  // Formatear fecha de expiración MM/AA
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardData((prev) => ({ ...prev, expiry: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const printReceipt = () => {
    window.print();
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");

    // Validaciones rápidas según método
    if (paymentMethod === "tarjeta") {
      const cleanNum = cardData.cardNumber.replace(/\s/g, "");
      if (cleanNum.length < 15) {
        setStatus("error");
        setError("Por favor ingresa un número de tarjeta válido (16 dígitos).");
        return;
      }
      if (cardData.cvv.length < 3) {
        setStatus("error");
        setError("Por favor ingresa el código de seguridad (CVV) de 3 dígitos.");
        return;
      }
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: f.get("customerName"),
          email: f.get("email"),
          phone: f.get("phone"),
          address: f.get("address"),
          city: f.get("city"),
          notes: f.get("notes") || undefined,
          deliveryDate: f.get("deliveryDate"),
          paymentMethod,
          paymentDetails: {
            ...cardData,
            rapipagoDni,
            mpOption,
          },
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            dedicatoria: i.dedicatoria,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(json.error ?? "No se pudo procesar el pedido.");
        return;
      }

      setOrderResult(json);
      clear();
      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Error al conectar con la pasarela de pagos.");
    }
  }

  // PANTALLA DE COMPROBANTE FINAL / PAGO REALIZADO
  if (status === "done" && orderResult) {
    const meta = orderResult.paymentMeta || {};
    return (
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-mint-200/80 bg-white p-8 shadow-sm">
          {/* Encabezado del comprobante */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-forest-900">
              {orderResult.paymentStatus === "aprobado" ? "¡Pago Confirmado con Éxito!" : "¡Pedido Registrado con Éxito!"}
            </h1>
            <p className="mt-2 text-xs text-forest-600">
              Hemos recibido tu orden <span className="font-semibold text-forest-900 font-mono">#{orderResult.orderNumber}</span>.
              Enviaremos la confirmación a tu correo electrónico.
            </p>
          </div>

          {/* DETALLES ESPECÍFICOS SEGÚN EL MEDIO DE PAGO */}
          <div className="mt-8 rounded-xl bg-[#faf9f5] p-6 border border-mint-200/60">
            {/* 1. Si pagó con Tarjeta Visa / Débito */}
            {orderResult.paymentMethod === "tarjeta" && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-mint-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest-600 flex items-center gap-1.5">
                    <CreditCard size={15} className="text-forest" /> Pago con {meta.cardBrand || "Tarjeta"}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Aprobado
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-forest-600">Titular de Tarjeta:</span>
                    <span className="font-semibold text-forest-900">{meta.cardHolder || fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600">Tarjeta:</span>
                    <span className="font-mono font-semibold text-forest-900">•••• •••• •••• {meta.last4}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600">Plan de Cuotas:</span>
                    <span className="font-semibold text-forest-900">{meta.installments} cuota(s) sin recargo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600">Código de Autorización:</span>
                    <span className="font-mono text-forest-800">{meta.authorizationCode}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-mint-200 font-serif text-base font-bold text-forest-900">
                    <span>Monto Cobrado:</span>
                    <span className="text-emerald-800">{money(orderResult.totalCents)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Si pagó con Mercado Pago */}
            {orderResult.paymentMethod === "mercadopago" && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-mint-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#009ee3] flex items-center gap-1.5">
                    <Wallet size={15} /> Mercado Pago Checkout
                  </span>
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-[#009ee3]">
                    Acreditado
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-forest-600">Cuenta de Débito:</span>
                    <span className="font-semibold text-forest-900">{meta.payerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600">Identificador MP:</span>
                    <span className="font-mono text-forest-800">{meta.preferenceId}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-mint-200 font-serif text-base font-bold text-forest-900">
                    <span>Monto Total:</span>
                    <span className="text-[#009ee3]">{money(orderResult.totalCents)}</span>
                  </div>

                  {meta.qrCode && (
                    <div className="mt-4 pt-4 border-t border-mint-200 text-center">
                      <p className="text-[11px] text-forest-600 mb-2">Comprobante con código QR dinámico de transacción</p>
                      <img src={meta.qrCode} alt="QR Mercado Pago" className="mx-auto h-32 w-32 border border-mint-300 rounded-lg p-1 bg-white" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Si seleccionó Rapipago (Cupón Oficial para Imprimir/Abonar en Sucursal) */}
            {orderResult.paymentMethod === "rapipago" && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-mint-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rosewood flex items-center gap-1.5">
                    <Banknote size={15} /> Cupón Oficial Rapipago
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Pendiente de Pago
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <p className="text-forest-700">
                    Presenta este cupón de pago en cualquier sucursal <strong>Rapipago</strong> o <strong>Pago Fácil</strong> de todo el país:
                  </p>

                  {/* Código numérico copiable */}
                  <div className="rounded-lg bg-white p-3.5 border border-mint-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-forest-600 block">Código Numérico de Pago</span>
                      <span className="font-mono text-base font-bold text-forest-900 tracking-wider">
                        {meta.barcodeFormatted || meta.barcode}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(meta.barcode)}
                      className="flex items-center gap-1 rounded bg-mint-100 px-3 py-1.5 text-[11px] font-semibold text-forest hover:bg-mint-200 transition"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
                      {copiedCode ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>

                  {/* Representación de Código de Barras */}
                  <div className="rounded-lg bg-white p-4 border border-mint-200 text-center">
                    <div className="mx-auto w-full max-w-[280px] h-12 flex items-center justify-center space-x-1 py-1">
                      {/* Simulación visual de barras de código */}
                      {Array.from({ length: 42 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="bg-black h-full"
                          style={{
                            width: idx % 3 === 0 ? "4px" : idx % 2 === 0 ? "2px" : "1px",
                            opacity: idx % 7 === 0 ? 0.3 : 1,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-forest-600 tracking-widest block mt-1.5">
                      {meta.barcode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-forest-600 block text-[10px]">Vencimiento del Cupón:</span>
                      <span className="font-semibold text-forest-900">{meta.expiration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-forest-600 block text-[10px]">Importe a Abonar:</span>
                      <span className="font-serif font-bold text-base text-rosewood">{money(orderResult.totalCents)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={printReceipt}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-forest/30 bg-mint-50/50 py-2.5 text-xs font-semibold text-forest hover:bg-mint-100 transition"
                    >
                      <Printer size={14} /> Imprimir Cupón de Pago
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Si seleccionó Transferencia Bancaria */}
            {orderResult.paymentMethod === "transferencia" && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-mint-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                    <Building2 size={15} className="text-forest" /> Datos de Transferencia Santander
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Aguardando Transferencia
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <p className="text-forest-700">
                    Por favor transfiere el importe total a la siguiente cuenta bancaria colocando la referencia en el concepto:
                  </p>

                  <div className="rounded-lg bg-white p-3.5 border border-mint-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-forest-600">Banco:</span>
                      <span className="font-semibold text-forest-900">{meta.bank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Titular:</span>
                      <span className="font-semibold text-forest-900">{meta.accountHolder}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-forest-600">CBU / CVU:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-forest-900">{meta.cbu}</span>
                        <button
                          onClick={() => copyToClipboard(meta.cbu)}
                          className="text-forest hover:text-forest-900"
                          title="Copiar CBU"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-forest-600">Alias:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-forest">{meta.alias}</span>
                        <button
                          onClick={() => copyToClipboard(meta.alias)}
                          className="text-forest hover:text-forest-900"
                          title="Copiar Alias"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-mint-200">
                      <span className="text-forest-600 font-semibold">Referencia obligatoria:</span>
                      <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {meta.reference}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 font-serif text-base font-bold text-forest-900">
                      <span>Importe Total:</span>
                      <span className="text-forest">{money(orderResult.totalCents)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-forest-600 leading-tight">
                    Una vez hecha la transferencia, tu pedido será confirmado inmediatamente por nuestro equipo en Logroño.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botón de volver */}
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/"
              className="rounded-sm bg-forest px-6 py-2.5 text-xs font-semibold text-white hover:bg-forest/90 transition shadow-sm"
            >
              Volver a la tienda
            </Link>
            <Link
              href="/cuenta"
              className="rounded-sm border border-forest px-6 py-2.5 text-xs font-semibold text-forest hover:bg-mint-50 transition"
            >
              Ver en Mi Cuenta
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-sm border border-mint-300 bg-white px-3 py-2 text-xs text-forest-900 focus:border-forest focus:outline-none transition-colors";

  return (
    <div className="bg-[#faf9f5] min-h-screen py-12">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mb-8 pb-4 border-b border-mint-200">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-forest-600">
            PROCESO DE COMPRA SEGURO
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-forest-900 mt-1">
            Finalizar Compra
          </h1>
        </div>

        {/* Tarjeta de usuario registrado conectado */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mint-50/90 px-5 py-3.5 border border-mint-200/90 text-xs text-forest-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0">
              <UserCheck size={14} />
            </div>
            <div>
              <span className="block font-semibold text-forest-900 text-sm">
                Comprando con tu cuenta registrada: {user.nombre} {user.apellido || ""}
              </span>
              <span className="block text-[11px] text-forest-600">
                Correo de facturación y seguimiento: {user.email}
              </span>
            </div>
          </div>
          <Link
            href="/cuenta"
            className="rounded-xl border border-forest/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition"
          >
            Ver Mi Cuenta
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* COLUMNA IZQUIERDA: FORMULARIO DE ENVÍO Y PASARELA DE PAGOS */}
          <form onSubmit={submit} className="lg:col-span-7 space-y-8">
            {/* 1. DATOS DE ENTREGA & CONTACTO */}
            <div className="rounded-xl border border-mint-200/80 bg-white p-6 sm:p-7 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-forest-900 mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-200 text-xs font-bold text-forest">
                  1
                </span>
                Datos de Envío y Contacto
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-700">
                    Nombre completo <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="customerName"
                    required
                    minLength={2}
                    defaultValue={fullName}
                    placeholder="Ej. Carmen Sáenz de Jubera"
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={user.email}
                      placeholder="tu-email@ejemplo.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700">
                      Teléfono / WhatsApp <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="phone"
                      required
                      minLength={6}
                      defaultValue={user.telefono || ""}
                      placeholder="+34 600 000 000"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700">
                      Dirección de entrega <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="address"
                      required
                      minLength={4}
                      placeholder="Calle, número, piso o tanatorio"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700">
                      Ciudad / Localidad <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="city"
                      required
                      defaultValue="Logroño (La Rioja)"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
                      <Calendar size={13} className="text-forest" /> Fecha de entrega deseada <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="deliveryDate"
                      type="date"
                      required
                      min={todayISO()}
                      defaultValue={todayISO()}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
                      <Truck size={13} className="text-forest" /> Franja de entrega
                    </label>
                    <select className={inputClass} defaultValue="manana">
                      <option value="manana">Mañana (09:30 – 14:00 h)</option>
                      <option value="tarde">Tarde (17:00 – 20:30 h)</option>
                      <option value="urgente">Urgente Tanatorio / Prioritario</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-forest-700">
                    Dedicatoria caligráfica o notas de entrega (Opcional)
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Escribe el mensaje para la tarjeta artesanal o instrucciones especiales de acceso..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* 2. MEDIOS DE PAGO (VISA, MERCADO PAGO, RAPIPAGO, TRANSFERENCIA) */}
            <div className="rounded-xl border border-mint-200/80 bg-white p-6 sm:p-7 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-forest-900 mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-200 text-xs font-bold text-forest">
                  2
                </span>
                Elige tu Medio de Pago
              </h2>

              {/* SELECTOR DE PESTAÑAS DE PAGO */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                {/* 1. Tarjeta (Visa / Mastercard) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("tarjeta")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    paymentMethod === "tarjeta"
                      ? "border-forest bg-mint-100/50 text-forest-900 shadow-xs ring-1 ring-forest"
                      : "border-mint-200 bg-white text-forest-700 hover:bg-mint-50/50"
                  }`}
                >
                  <CreditCard size={20} className={paymentMethod === "tarjeta" ? "text-forest" : "text-forest-600"} />
                  <span className="mt-1.5 text-xs font-semibold block">Tarjeta</span>
                  <span className="text-[10px] text-forest-600">Visa / Débito</span>
                </button>

                {/* 2. Mercado Pago */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mercadopago")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    paymentMethod === "mercadopago"
                      ? "border-[#009ee3] bg-[#009ee3]/5 text-forest-900 shadow-xs ring-1 ring-[#009ee3]"
                      : "border-mint-200 bg-white text-forest-700 hover:bg-mint-50/50"
                  }`}
                >
                  <Wallet size={20} className={paymentMethod === "mercadopago" ? "text-[#009ee3]" : "text-forest-600"} />
                  <span className="mt-1.5 text-xs font-semibold block">Mercado Pago</span>
                  <span className="text-[10px] text-forest-600">Billetera / QR</span>
                </button>

                {/* 3. Rapipago */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("rapipago")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    paymentMethod === "rapipago"
                      ? "border-rosewood bg-rosewood/5 text-forest-900 shadow-xs ring-1 ring-rosewood"
                      : "border-mint-200 bg-white text-forest-700 hover:bg-mint-50/50"
                  }`}
                >
                  <Banknote size={20} className={paymentMethod === "rapipago" ? "text-rosewood" : "text-forest-600"} />
                  <span className="mt-1.5 text-xs font-semibold block">Rapipago</span>
                  <span className="text-[10px] text-forest-600">Efectivo / Cupón</span>
                </button>

                {/* 4. Transferencia */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("transferencia")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    paymentMethod === "transferencia"
                      ? "border-forest bg-mint-100/50 text-forest-900 shadow-xs ring-1 ring-forest"
                      : "border-mint-200 bg-white text-forest-700 hover:bg-mint-50/50"
                  }`}
                >
                  <Building2 size={20} className={paymentMethod === "transferencia" ? "text-forest" : "text-forest-600"} />
                  <span className="mt-1.5 text-xs font-semibold block">Transferencia</span>
                  <span className="text-[10px] text-forest-600">CBU / Alias</span>
                </button>
              </div>

              {/* CONTENIDO DEL MÉTODO: 1. TARJETA VISA / MASTERCARD */}
              {paymentMethod === "tarjeta" && (
                <div className="rounded-lg bg-[#faf9f5] p-5 border border-mint-200/70 space-y-4 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-mint-200">
                    <span className="font-semibold text-forest-900 flex items-center gap-1.5">
                      <Lock size={13} className="text-emerald-700" /> Datos de la Tarjeta ({cardData.cardBrand})
                    </span>
                    <span className="text-[10px] text-forest-600">Procesamiento seguro cifrado</span>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700 mb-1">
                      Número de Tarjeta <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4500 0000 0000 0000"
                        className={inputClass}
                      />
                      <span className="absolute right-3 top-3 text-[11px] font-bold text-forest uppercase font-mono">
                        {cardData.cardBrand}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700 mb-1">
                      Nombre y Apellido como figura en la tarjeta <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cardHolder}
                      onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                      placeholder="CARMEN SAENZ DE JUBERA"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-forest-700 mb-1">
                        Vencimiento <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-forest-700 mb-1">
                        CVV (Seguridad) <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCvv ? "text" : "password"}
                          required
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })}
                          placeholder="123"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-2.5 top-2.5 text-forest-500 hover:text-forest-800"
                        >
                          {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-semibold uppercase tracking-wider text-forest-700 mb-1">
                        DNI Titular <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardData.dni}
                        onChange={(e) => setCardData({ ...cardData, dni: e.target.value })}
                        placeholder="DNI / NIE"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700 mb-1">
                      Financiación en Cuotas
                    </label>
                    <select
                      value={cardData.installments}
                      onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                      className={inputClass}
                    >
                      <option value="1">1 pago contado de {money(totalCents)} (Sin interés)</option>
                      <option value="3">3 cuotas fijas de {money(Math.round(totalCents / 3))} (Sin interés)</option>
                      <option value="6">6 cuotas fijas de {money(Math.round(totalCents / 6))} (Sin interés)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CONTENIDO DEL MÉTODO: 2. MERCADO PAGO */}
              {paymentMethod === "mercadopago" && (
                <div className="rounded-lg bg-[#faf9f5] p-5 border border-mint-200/70 space-y-4 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-mint-200">
                    <span className="font-semibold text-[#009ee3] flex items-center gap-1.5">
                      <Wallet size={15} /> Billetera Virtual Mercado Pago
                    </span>
                    <span className="rounded bg-sky-100 text-[#009ee3] px-2 py-0.5 text-[10px] font-bold">
                      Acreditación Instantánea
                    </span>
                  </div>

                  <p className="text-forest-700 leading-relaxed">
                    Paga de forma rápida y segura con tu dinero en cuenta de Mercado Pago o tarjetas asociadas:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-md border cursor-pointer select-none transition ${
                        mpOption === "balance" ? "border-[#009ee3] bg-white ring-1 ring-[#009ee3]" : "border-mint-200 bg-white/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mp_option"
                        checked={mpOption === "balance"}
                        onChange={() => setMpOption("balance")}
                        className="accent-[#009ee3] mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-forest-900 block">Dinero en Cuenta Mercado Pago</span>
                        <span className="text-[10px] text-forest-600 block mt-0.5">
                          Débito automático con tu email registrado.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-md border cursor-pointer select-none transition ${
                        mpOption === "qr" ? "border-[#009ee3] bg-white ring-1 ring-[#009ee3]" : "border-mint-200 bg-white/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mp_option"
                        checked={mpOption === "qr"}
                        onChange={() => setMpOption("qr")}
                        className="accent-[#009ee3] mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-forest-900 block flex items-center gap-1">
                          <QrCode size={13} className="text-[#009ee3]" /> Pagar con QR dinámico
                        </span>
                        <span className="text-[10px] text-forest-600 block mt-0.5">
                          Escanea desde tu app Mercado Pago.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* CONTENIDO DEL MÉTODO: 3. RAPIPAGO */}
              {paymentMethod === "rapipago" && (
                <div className="rounded-lg bg-[#faf9f5] p-5 border border-mint-200/70 space-y-4 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-mint-200">
                    <span className="font-semibold text-rosewood flex items-center gap-1.5">
                      <Banknote size={15} /> Pago en Efectivo (Rapipago / Pago Fácil)
                    </span>
                    <span className="rounded bg-rosewood/10 text-rosewood px-2 py-0.5 text-[10px] font-bold">
                      Red Nacional de Cobranza
                    </span>
                  </div>

                  <p className="text-forest-700 leading-relaxed">
                    Al confirmar tu pedido, generaremos automáticamente un <strong>cupón digital oficial</strong> con código de barras y clave numérica de 14 dígitos para pagar en efectivo en cualquier sucursal.
                  </p>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-forest-700 mb-1">
                      DNI del Pagador <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rapipagoDni}
                      onChange={(e) => setRapipagoDni(e.target.value)}
                      placeholder="Ingresa tu DNI para vincular el cupón"
                      className={inputClass}
                    />
                  </div>

                  <div className="rounded-md bg-amber-50 p-3 text-[11px] text-amber-900 border border-amber-200">
                    ⏳ <strong>Reserva de flores garantizada por 72 horas:</strong> Tu pedido quedará reservado hasta que se confirme el pago en sucursal.
                  </div>
                </div>
              )}

              {/* CONTENIDO DEL MÉTODO: 4. TRANSFERENCIA BANCARIA */}
              {paymentMethod === "transferencia" && (
                <div className="rounded-lg bg-[#faf9f5] p-5 border border-mint-200/70 space-y-4 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-mint-200">
                    <span className="font-semibold text-forest-900 flex items-center gap-1.5">
                      <Building2 size={15} className="text-forest" /> Datos para la Transferencia Bancaria
                    </span>
                    <span className="rounded bg-mint-200 text-forest-800 px-2 py-0.5 text-[10px] font-bold">
                      CBU / CVU / Alias
                    </span>
                  </div>

                  <div className="space-y-1.5 rounded-md bg-white p-3.5 border border-mint-200">
                    <p className="flex justify-between">
                      <span className="text-forest-600">Banco:</span>
                      <span className="font-semibold text-forest-900">Banco Santander</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-forest-600">Titular:</span>
                      <span className="font-semibold text-forest-900">Alma de Flor S.L.</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-forest-600">CBU:</span>
                      <span className="font-mono font-bold text-forest-900">0720194820000039201948</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-forest-600">Alias:</span>
                      <span className="font-mono font-bold text-forest">ALMA.DE.FLOR.RIOJA</span>
                    </p>
                  </div>

                  <p className="text-[11px] text-forest-600">
                    Al confirmar tu pedido recibirás la referencia para colocar en el concepto de la transferencia.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3.5 text-xs text-red-900 border border-red-200 flex items-start gap-2">
                <AlertCircle size={15} className="text-red-700 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={items.length === 0 || status === "sending"}
              className="w-full rounded-sm bg-[#0e3b2b] py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-white hover:bg-forest/90 transition shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Procesando pago y confirmando pedido...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Pedido &amp; Pagar ({money(totalCents)})</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* COLUMNA DERECHA: RESUMEN DE COMPRA CON DESCRIPCIÓN DE PRODUCTOS */}
          <aside className="lg:col-span-5 rounded-xl border border-mint-200/80 bg-white p-6 shadow-xs sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-forest-900 pb-3 border-b border-mint-200 flex items-center justify-between">
              <span>Resumen del Pedido</span>
              <span className="text-xs font-sans text-forest-600 font-normal">
                {items.reduce((acc, curr) => acc + curr.quantity, 0)} productos
              </span>
            </h2>

            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-forest-600">
                Tu carrito está vacío.{" "}
                <Link href="/ramos" className="font-semibold text-forest underline">
                  Explorar flores
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-mint-100/80 my-4 max-h-[480px] overflow-y-auto pr-1">
                {items.map((i) => {
                  const desc = i.description || descriptions[i.productId] || "";
                  return (
                    <article key={i.key} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-start">
                      {/* Imagen miniatura */}
                      <div className="h-16 w-16 shrink-0 rounded-md overflow-hidden bg-mint-100 border border-mint-200">
                        <ProductImage src={i.image} alt={i.name} className="h-full w-full object-cover" />
                      </div>

                      {/* Información y DESCRIPCIÓN DEL PRODUCTO */}
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif font-semibold text-forest-900 leading-tight truncate">
                            {i.name}
                          </h3>
                          <span className="font-semibold text-forest-900 shrink-0">
                            {money(i.unitCents * i.quantity)}
                          </span>
                        </div>

                        {/* DESCRIPCIÓN DEL PRODUCTO VISIBLE */}
                        {desc ? (
                          <p className="mt-1 text-[11px] text-forest-600 leading-snug line-clamp-2">
                            {desc}
                          </p>
                        ) : null}

                        {/* Metadatos (variante, fecha, dedicatoria) */}
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-forest-700">
                          <span className="rounded bg-mint-100 px-1.5 py-0.5 font-medium">
                            Cant: {i.quantity}
                          </span>
                          {i.variant && !["estándar", "estandar"].includes(i.variant.toLowerCase()) && (
                            <span className="rounded bg-mint-100 px-1.5 py-0.5">
                              {i.variant}
                            </span>
                          )}
                          {i.dedicatoria && (
                            <span className="rounded bg-mint-200 text-forest-800 px-1.5 py-0.5 font-medium">
                              + Dedicatoria
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Desglose de totales */}
            <div className="pt-4 border-t border-mint-200 space-y-2 text-xs">
              <div className="flex justify-between text-forest-700">
                <span>Subtotal de flores</span>
                <span>{money(totalCents)}</span>
              </div>
              <div className="flex justify-between text-forest-700">
                <span>Envío refrigerado en La Rioja</span>
                <span className="text-emerald-700 font-semibold uppercase text-[11px]">Gratis</span>
              </div>
              <div className="flex justify-between text-forest-700">
                <span>Medio de pago seleccionado</span>
                <span className="font-semibold text-forest-900 capitalize">
                  {paymentMethod === "tarjeta"
                    ? "Tarjeta Visa/Débito"
                    : paymentMethod === "mercadopago"
                    ? "Mercado Pago"
                    : paymentMethod === "rapipago"
                    ? "Rapipago (Efectivo)"
                    : "Transferencia"}
                </span>
              </div>

              <div className="pt-3 border-t border-mint-200/80 flex justify-between items-baseline font-serif text-lg font-bold text-forest-900">
                <span>Total a Pagar</span>
                <span className="text-2xl text-[#0f2c22]">{money(totalCents)}</span>
              </div>
            </div>

            {/* Sellos de garantía */}
            <div className="mt-6 rounded-lg bg-[#faf9f5] p-3.5 border border-mint-200/60 space-y-2 text-[11px] text-forest-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                <span>Garantía botánica de frescura 7 días</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-emerald-700 shrink-0" />
                <span>Vehículo propio climatizado en Logroño</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-emerald-700 shrink-0" />
                <span>Pasarela segura con encriptación SSL de 256 bits</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
