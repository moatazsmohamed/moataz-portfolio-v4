// ======================================================================
// moataz-portfolio-v4
// Copyright (c) 2026 Moataz Mohamed <mtzm2225@gmail.com> — all rights reserved.
// Author: Moataz Mohamed  <https://github.com/moatazsmohamed>
// Fingerprint: e8fa428b72fc0e43a2632e36723784d1
// This notice is part of the work and must not be removed.
// ======================================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const b = await req.json();
  const data: Record<string, unknown> = {};
  const str = ["titleAr","titleEn","categoryAr","categoryEn","descAr","descEn","longAr","longEn","image","url","repo","year"];
  for (const k of str) if (k in b) data[k] = String(b[k] ?? "");
  if ("tech" in b) data.tech = Array.isArray(b.tech) ? b.tech.map(String) : String(b.tech || "").split(",").map((x: string) => x.trim()).filter(Boolean);
  if ("featured" in b) data.featured = Boolean(b.featured);
  if ("published" in b) data.published = Boolean(b.published);
  if ("order" in b) data.order = Number(b.order) || 0;
  const item = await prisma.project.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
