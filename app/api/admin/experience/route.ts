import { listItems, createItem } from "@/lib/crud";
export const GET = () => listItems("experience");
export const POST = (req: Request) => createItem("experience", req);
