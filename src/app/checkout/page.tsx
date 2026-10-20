import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CheckoutView from "./CheckoutView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Finalizar Compra — Alma de Flor",
  description: "Completa tu pedido floral artesanal con entrega a domicilio en La Rioja",
};

export default async function CheckoutPage() {
  const session = await getUserSession();

  // Si el usuario no está registrado o autenticado, redirigir al registro
  if (!session) {
    redirect("/registro?redirect=/checkout");
  }

  // Traer los datos del usuario registrado para prellenar y validar la compra
  const user = await prisma.usuarios.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      rol: true,
    },
  });

  if (!user) {
    redirect("/registro?redirect=/checkout");
  }

  return (
    <CheckoutView
      user={{
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
      }}
    />
  );
}
