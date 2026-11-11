import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPass = String(password || "");
    if (!cleanEmail || !cleanPass) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) return NextResponse.json({ error: "invalid" }, { status: 401 });

    const ok = await bcrypt.compare(cleanPass, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "invalid" }, { status: 401 });

    await createSession(user.email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
