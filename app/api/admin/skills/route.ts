import { listItems, createItem } from "@/lib/crud";
export const GET = () => listItems("skill");
export const POST = (req: Request) => createItem("skill", req);
