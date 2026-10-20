import { BadgeCheck, Leaf, Truck } from "lucide-react";

type Props = {
  bleed?: boolean;
  eyebrow?: string;
  quote?: string;
  text?: string;
  badges?: boolean;
};

export default function Manifesto({
  bleed = false,
  eyebrow = "MANIFIESTO DE SOSTENIBILIDAD • ALMA DE FLOR",
  quote = "Tratamos cada tallo con la reverencia de una escultura efímera.",
  text = "Empaques 100% biodegradables elaborados con pulpa de algodón reciclada, cinta de seda orgánica teñida con pigmentos vegetales y flores de cultivo ético certificado de La Rioja.",
  badges = true,
}: Props) {
  const inner = (
    <div className={`relative overflow-hidden bg-forest px-6 py-16 text-center text-white ${bleed ? "" : "rounded-xl"}`}>
      <p className="text-[10px] tracking-[0.25em] text-mint-200">{eyebrow}</p>
      <blockquote className="mx-auto mt-6 max-w-3xl font-serif text-4xl italic leading-snug">“{quote}”</blockquote>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-mint-200">{text}</p>
      {badges && (
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] text-mint-200">
          <li className="flex items-center gap-2"><BadgeCheck size={14} /> Garantía de frescura 7 días</li>
          <li className="flex items-center gap-2"><Truck size={14} /> Reparto refrigerado propio</li>
          <li className="flex items-center gap-2"><Leaf size={14} /> Cero plásticos envoltura</li>
        </ul>
      )}
    </div>
  );
  return bleed ? inner : <section id="quienes-somos" className="mx-auto max-w-[1240px] px-6 pb-20">{inner}</section>;
}
