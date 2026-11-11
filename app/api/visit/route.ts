import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const path = String(b.path || "/").slice(0, 200);
    await prisma.visit.create({ data: { path } });
    const count = await prisma.visit.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
