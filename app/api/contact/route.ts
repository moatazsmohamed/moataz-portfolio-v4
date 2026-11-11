import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 160);
    const phone = String(body.phone || "").trim().slice(0, 40);
    const projectType = String(body.projectType || "").trim().slice(0, 80);
    const text = String(body.body || "").trim().slice(0, 5000);

    if (!name || !email || !text) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }

    const msg = await prisma.message.create({
      data: { name, email, phone, projectType, body: text },
    });
    return NextResponse.json({ ok: true, id: msg.id });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
