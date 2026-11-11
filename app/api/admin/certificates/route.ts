import { listItems, createItem } from "@/lib/crud";
export const GET = () => listItems("certificate");
export const POST = (req: Request) => createItem("certificate", req);
