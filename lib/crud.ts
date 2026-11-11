import { NextResponse } from "next/server";
import { prisma } from "./db";
import { requireAdmin } from "./auth";

type Model = "skill" | "experience" | "certificate";

const fields: Record<Model, { str: string[]; num: string[] }> = {
  skill: { str: ["name", "categoryAr", "categoryEn", "icon"], num: ["level", "order"] },
  experience: {
    str: ["roleAr", "roleEn", "company", "periodAr", "periodEn", "descAr", "descEn", "typeAr", "typeEn"],
    num: ["order"],
  },
  certificate: { str: ["titleAr", "titleEn", "issuer", "date", "image", "url"], num: ["order"] },
};

function clean(model: Model, b: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  const f = fields[model];
  for (const k of f.str) if (k in b) data[k] = String(b[k] ?? "");
  for (const k of f.num) if (k in b) data[k] = Number(b[k]) || 0;
  return data;
}

export async function listItems(model: Model) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // @ts-expect-error dynamic delegate
  const items = await prisma[model].findMany({ orderBy: [{ order: "asc" }] });
  return NextResponse.json(items);
}

export async function createItem(model: Model, req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  // @ts-expect-error dynamic delegate
  const item = await prisma[model].create({ data: clean(model, b) });
  return NextResponse.json(item);
}

export async function updateItem(model: Model, id: string, req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  // @ts-expect-error dynamic delegate
  const item = await prisma[model].update({ where: { id }, data: clean(model, b) });
  return NextResponse.json(item);
}

export async function deleteItem(model: Model, id: string) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // @ts-expect-error dynamic delegate
  await prisma[model].delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
