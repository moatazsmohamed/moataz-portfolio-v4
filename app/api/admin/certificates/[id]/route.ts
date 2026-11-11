import { updateItem, deleteItem } from "@/lib/crud";
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return updateItem("certificate", id, req);
}
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return deleteItem("certificate", id);
}
