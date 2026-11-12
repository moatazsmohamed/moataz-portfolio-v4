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

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const items = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  const slug = String(b.slug || b.titleEn || b.titleAr || "project")
    .toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-").replace(/^-|-$/g, "")
    .slice(0, 60) || `project-${Date.now()}`;
  const item = await prisma.project.create({
    data: {
      slug: `${slug}-${Math.random().toString(36).slice(2, 6)}`,
      titleAr: String(b.titleAr || ""),
      titleEn: String(b.titleEn || b.titleAr || ""),
      categoryAr: String(b.categoryAr || ""),
      categoryEn: String(b.categoryEn || ""),
      descAr: String(b.descAr || ""),
      descEn: String(b.descEn || ""),
      longAr: String(b.longAr || ""),
      longEn: String(b.longEn || ""),
      image: String(b.image || ""),
      url: String(b.url || ""),
      repo: String(b.repo || ""),
      tech: Array.isArray(b.tech) ? b.tech.map(String) : String(b.tech || "").split(",").map((x: string) => x.trim()).filter(Boolean),
      featured: Boolean(b.featured),
      published: b.published !== false,
      year: String(b.year || ""),
      order: Number(b.order) || 0,
    },
  });
  return NextResponse.json(item);
}
