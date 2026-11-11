import { prisma } from "./db";

export async function getSettings() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return s;
}

export async function getPortfolioData() {
  const [settings, projects, skills, experience, certificates, visits] =
    await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
      prisma.experience.findMany({ orderBy: [{ order: "asc" }] }),
      prisma.certificate.findMany({ orderBy: [{ order: "asc" }] }),
      prisma.visit.count(),
    ]);
  return { settings, projects, skills, experience, certificates, visits };
}

export type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>;
