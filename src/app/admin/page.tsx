import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel — Batizado de Anthony Gael", robots: { index: false } };

export default async function AdminPage() {
  // segunda camada de proteção (a primeira é o middleware)
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/admin/login");

  return <AdminDashboard email={user.email ?? ""} />;
}
