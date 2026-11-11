import { getPortfolioData } from "@/lib/data";
import Site from "@/components/Site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();
  return <Site data={JSON.parse(JSON.stringify(data))} />;
}
