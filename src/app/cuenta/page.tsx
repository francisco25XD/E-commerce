import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserAccountView from "@/components/user/UserAccountView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi Cuenta — Alma de Flor",
  description: "Consulta tus productos añadidos al carrito, modifica tus datos y envía comentarios al administrador",
};

export default async function AccountPage() {
  const session = await getUserSession();

  if (!session) {
    redirect("/login");
  }

  // Obtener los datos más recientes del usuario desde la base de datos MySQL
  const user = await prisma.usuarios.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      fecha_nacimiento: true,
      rol: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const birthDateStr = user.fecha_nacimiento
    ? user.fecha_nacimiento.toISOString().slice(0, 10)
    : null;

  return (
    <UserAccountView
      initialUser={{
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        fecha_nacimiento: birthDateStr,
        rol: user.rol,
      }}
    />
  );
}
