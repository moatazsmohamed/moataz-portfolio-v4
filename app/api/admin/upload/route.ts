import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/avif", "application/pdf"];

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "too large (max 4MB)" }, { status: 400 });
    }
    const mime = file.type || "image/png";
    if (!ALLOWED.includes(mime)) {
      return NextResponse.json({ error: "unsupported type" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const media = await prisma.media.create({
      data: {
        filename: file.name.slice(0, 120),
        mime,
        size: buf.length,
        data: buf.toString("base64"),
      },
    });

    return NextResponse.json({ url: `/api/media/${media.id}`, id: media.id });
  } catch {
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}
