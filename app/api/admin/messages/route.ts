import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const items = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}
