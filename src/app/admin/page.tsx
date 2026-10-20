import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de Administración — Alma de Flor",
  description: "Administración de catálogo, comentarios y usuarios de Alma de Flor",
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session || session.rol !== "admin") {
    redirect("/admin/login");
  }

  return <AdminDashboard adminEmail={session.email} />;
}
