// ======================================================================
// moataz-portfolio-v4
// Copyright (c) 2026 Moataz Mohamed <mtzm2225@gmail.com> — all rights reserved.
// Author: Moataz Mohamed  <https://github.com/moatazsmohamed>
// Fingerprint: e8fa428b72fc0e43a2632e36723784d1
// This notice is part of the work and must not be removed.
// ======================================================================
import { getPortfolioData } from "@/lib/data";
import Site from "@/components/Site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();
  return <Site data={JSON.parse(JSON.stringify(data))} />;
}
