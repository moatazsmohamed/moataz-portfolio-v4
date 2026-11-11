import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json(s);
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const allowed = [
    "nameAr","nameEn","roleAr","roleEn","taglineAr","taglineEn","bioAr","bioEn",
    "email","phone","locationAr","locationEn","avatarUrl","heroImage","cvUrl",
    "github","linkedin","instagram","facebook","whatsapp","available",
  ];
  const data: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) data[k] = body[k];
  const s = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return NextResponse.json(s);
}
