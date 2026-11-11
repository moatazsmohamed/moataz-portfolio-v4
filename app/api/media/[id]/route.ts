import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return new Response("Not found", { status: 404 });

  const buf = Buffer.from(media.data, "base64");
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": media.mime,
      "Content-Length": String(buf.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
