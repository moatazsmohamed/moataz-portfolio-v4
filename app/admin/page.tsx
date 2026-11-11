import { getSession } from "@/lib/auth";
import AdminApp from "@/components/AdminApp";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  return <AdminApp initialAuthed={Boolean(session?.email)} email={session?.email || ""} />;
}
