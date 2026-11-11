import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PROJECTS = [
  {
    slug: "taqasim", titleAr: "تَقاسيم", titleEn: "Taqasim",
    categoryAr: "آلة صوت", categoryEn: "Audio instrument",
    descAr: "وتر بيتولّد قدامك بمعادلة Karplus–Strong: سبعة مقامات بدرجاتها بالسنت، ستة أدوار إيقاع، ومؤلف تَقاسي ببذرة عشوائية — بصفّر عيّنة صوتية.",
    descEn: "A string synthesised live with the Karplus–Strong equation: seven maqams with cent-accurate intervals, six rhythmic cycles, and a seeded taqasim composer — zero audio samples.",
    image: "/img/taqasim-preview.webp", url: "https://taqasim.vercel.app", repo: "",
    tech: ["Web Audio API", "JavaScript", "Karplus–Strong"], year: "2026", order: 1,
  },
  {
    slug: "general-inventory-erp", titleAr: "General Inventory ERP", titleEn: "General Inventory ERP",
    categoryAr: "نظام ERP", categoryEn: "ERP system",
    descAr: "نظام مخزون وجرد شامل بالعربي: استيراد مستندات ومراجعتها قبل الاعتماد، توزيع ذكي للكميات، باركود كهوية، جرد فعلي، وتقارير لحظية.",
    descEn: "A full Arabic inventory and stock system: document import with review before approval, smart quantity distribution, barcode identity, live stocktake and real-time reports.",
    image: "/img/erp-preview.webp", url: "https://sportswear-warehouse-manager.vercel.app", repo: "",
    tech: ["React", "TypeScript", "Supabase", "PostgreSQL"], year: "2026", order: 2,
  },
  {
    slug: "tasheela", titleAr: "تسهيلة", titleEn: "Tasheela",
    categoryAr: "منصة محاسبة", categoryEn: "Accounting platform",
    descAr: "منصة محاسبة وتشغيل متكاملة لفريق المحاسبة — كل حساب في مكانه، وشغل يومي منظم.",
    descEn: "An integrated accounting and operations platform for accounting teams — every account in its place, and an organised daily workflow.",
    image: "/img/tasheela-preview.webp", url: "https://tasheela.vercel.app", repo: "",
    tech: ["Next.js", "TypeScript", "PostgreSQL"], year: "2026", order: 3,
  },
  {
    slug: "social-intelligence", titleAr: "Social Intelligence", titleEn: "Social Intelligence",
    categoryAr: "رصد وتحليل", categoryEn: "Analytics",
    descAr: "منصة ذكاء اجتماعي: افهم كل حساب من مكان واحد — رصد وتحليل ولوحة تحكم للمطوّر.",
    descEn: "A social intelligence platform: understand every account from one place — monitoring, analysis and a developer dashboard.",
    image: "/img/social-intelligence-preview.webp", url: "https://social-intelligence-gilt.vercel.app", repo: "",
    tech: ["React", "Vite", "APIs"], year: "2026", order: 4,
  },
  {
    slug: "zakhraf", titleAr: "زَخْرَف", titleEn: "Zakhraf",
    categoryAr: "زخرفة توليدية", categoryEn: "Generative art",
    descAr: "محرّك يرسم نجوم girih ويضفر خطوطها على الشاشة لحظيًا: أربع رتب تناظر، ١٢ لوحة ألوان تاريخية، وتصدير بدقة 2048.",
    descEn: "An engine that draws girih stars and weaves their lines live: four symmetry orders, 12 historical palettes, and 2048px export.",
    image: "/img/zakhraf-preview.webp", url: "https://zakhraf.vercel.app", repo: "",
    tech: ["Canvas", "TypeScript", "Generative"], year: "2026", order: 5,
  },
  {
    slug: "marab", titleAr: "مِرَآب", titleEn: "Marab",
    categoryAr: "معرض تفاعلي", categoryEn: "Interactive showcase",
    descAr: "معرض سيارات فخم بالعربي: عدّاد افتتاح، شرح الاسم بالحركة، مخصّص ألوان، وحلبة تُسجّل فيها لفة حقيقية.",
    descEn: "A premium Arabic car showcase: an opening counter, animated name reveal, colour customiser, and a track that records a real lap.",
    image: "/img/marab-preview.webp", url: "https://car-showcase-weld.vercel.app", repo: "",
    tech: ["React", "Three.js", "Framer Motion"], year: "2026", order: 6,
  },
  {
    slug: "motryx", titleAr: "MOTRYX", titleEn: "MOTRYX",
    categoryAr: "استوديو", categoryEn: "Studio",
    descAr: "هوية رقمية كاملة لاستوديو برمجيات وذكاء اصطناعي: موقع عربي وإنجليزي، صفحات خدمات، ودراسات حالة.",
    descEn: "A complete digital identity for a software and AI studio: bilingual site, service pages and case studies.",
    image: "/img/motryx-preview.webp", url: "https://motryx-delta.vercel.app", repo: "",
    tech: ["Next.js", "Tailwind CSS", "i18n"], year: "2026", order: 7,
  },
  {
    slug: "mtz-ai", titleAr: "MTZ AI", titleEn: "MTZ AI",
    categoryAr: "ذكاء اصطناعي", categoryEn: "AI",
    descAr: "مساحة عمل شخصية للذكاء الاصطناعي: محادثات محفوظة وذاكرة خاصة، بواجهة عربية وإنجليزية سليمة الاتجاه.",
    descEn: "A personal AI workspace: saved conversations and private memory, with a properly bidirectional Arabic and English interface.",
    image: "/img/mtz-ai-preview.webp", url: "https://mtzz-ai-pi.vercel.app", repo: "",
    tech: ["React", "Vite", "LLM APIs"], year: "2026", order: 8,
  },
  {
    slug: "pcverse", titleAr: "PCVERSE", titleEn: "PCVERSE",
    categoryAr: "مختبر 3D", categoryEn: "3D lab",
    descAr: "مختبر حاسب تفاعلي ثلاثي الأبعاد: تفكّك المكوّنات، تفهم وظايفها، وتتعلّم بالعربي والإنجليزي.",
    descEn: "An interactive 3D computer lab: take components apart, understand what they do, and learn in Arabic and English.",
    image: "/img/pcverse-preview.webp", url: "https://pcverse-lac.vercel.app", repo: "",
    tech: ["Three.js", "React", "Vite"], year: "2026", order: 9,
  },
  {
    slug: "computer-explorer", titleAr: "مستكشف الحاسب", titleEn: "Computer Explorer",
    categoryAr: "3D تفاعلي", categoryEn: "Interactive 3D",
    descAr: "تفكيك الحاسب قطعة قطعة في مشهد ثلاثي الأبعاد: تدوير، تكبير، وشرح لكل مكوّن بالعربي.",
    descEn: "Take a computer apart piece by piece in a 3D scene: rotate, zoom, and an explanation for every component in Arabic.",
    image: "/img/computer-explorer-preview.webp", url: "https://computer-explorer-three.vercel.app", repo: "",
    tech: ["Three.js", "Vite", "JavaScript"], year: "2026", order: 10,
  },
  {
    slug: "madar", titleAr: "مدار", titleEn: "Madar",
    categoryAr: "SaaS", categoryEn: "SaaS",
    descAr: "منصة لإدارة الفرق والمساحات العملية بتصميم عربي كامل: مهام يومية بمؤقتات، أقسام وصلاحيات، تقارير شهرية، ولوحة مطوّر.",
    descEn: "A multi-tenant team-operations platform with a fully Arabic RTL interface: timed daily tasks, departments and roles, monthly reports and a developer console.",
    image: "/img/madar-login.webp", url: "https://madar-m.vercel.app", repo: "https://github.com/moatazsmohamed/madar",
    tech: ["React Native", "TypeScript", "Supabase", "PostgreSQL"], year: "2026", order: 11, featured: true,
  },
  {
    slug: "webvault", titleAr: "WebVault", titleEn: "WebVault",
    categoryAr: "تطبيق ويب", categoryEn: "Web app",
    descAr: "خزنة ملفات في المتصفح: رفع، تنظيم، ومشاركة بدون سيرفر.",
    descEn: "A file vault in the browser: upload, organise and share without a server.",
    image: "/img/webvault-preview.webp", url: "https://webvault-app.vercel.app", repo: "https://github.com/moatazsmohamed/webvault",
    tech: ["TypeScript", "Next.js", "IndexedDB"], year: "2026", order: 12,
  },
  {
    slug: "tafrawear", titleAr: "تافراوير", titleEn: "Tafrawear",
    categoryAr: "متجر", categoryEn: "Store",
    descAr: "متجر ملابس كامل: كتالوج، سلة، وتجربة شراء سريعة.",
    descEn: "A complete clothing store: catalogue, cart and a fast checkout experience.",
    image: "/img/tafra-preview.webp", url: "https://tafrawear.vercel.app", repo: "",
    tech: ["React", "Vite", "CSS"], year: "2026", order: 13,
  },
  {
    slug: "ms-woodworks", titleAr: "MS Woodworks", titleEn: "MS Woodworks",
    categoryAr: "موقع تعريفي", categoryEn: "Business site",
    descAr: "هوية رقمية لورشة خشب: أعمال، معرض صور، وتواصل مباشر.",
    descEn: "A digital identity for a wood workshop: work, a photo gallery and direct contact.",
    image: "/img/mswood-preview.webp", url: "https://ms-wood-works.vercel.app", repo: "https://github.com/moatazsmohamed/ms-wood-works",
    tech: ["JavaScript", "HTML", "CSS"], year: "2026", order: 14,
  },
  {
    slug: "personal-site", titleAr: "الموقع الشخصي", titleEn: "Personal site",
    categoryAr: "موقع شخصي", categoryEn: "Personal site",
    descAr: "موقعي الشخصي بالإنجليزي: نبذة، السيرة الذاتية، ومشاريعي البرمجية في مكان واحد.",
    descEn: "My personal site in English: bio, CV and software projects all in one place.",
    image: "/img/personal-site-preview.webp", url: "https://moatazsmohamed.github.io", repo: "https://github.com/moatazsmohamed/moatazsmohamed.github.io",
    tech: ["HTML", "CSS", "JavaScript"], year: "2025", order: 15,
  },
  {
    slug: "portfolio-v1", titleAr: "البورتفوليو الأول", titleEn: "Portfolio v1",
    categoryAr: "موقع شخصي", categoryEn: "Personal site",
    descAr: "النسخة اللي بدأت منها: عربي وإنجليزي، وصندوق رسائل حقيقي.",
    descEn: "The version it all started from: Arabic and English, with a real message inbox.",
    image: "/img/portfolio-preview.webp", url: "https://portfolio-moataz.vercel.app", repo: "https://github.com/moatazsmohamed/portfolio",
    tech: ["HTML", "CSS", "JavaScript"], year: "2025", order: 16,
  },
];

const SKILLS = [
  { name: "HTML5", categoryAr: "تطوير الويب", categoryEn: "Web development", level: 95, order: 1 },
  { name: "CSS3", categoryAr: "تطوير الويب", categoryEn: "Web development", level: 92, order: 2 },
  { name: "JavaScript", categoryAr: "تطوير الويب", categoryEn: "Web development", level: 88, order: 3 },
  { name: "React", categoryAr: "تطوير الويب", categoryEn: "Web development", level: 85, order: 4 },
  { name: "Next.js", categoryAr: "تطوير الويب", categoryEn: "Web development", level: 82, order: 5 },
  { name: "TypeScript", categoryAr: "تطوير الويب", categoryEn: "Web development", level: 80, order: 6 },
  { name: "Vite", categoryAr: "تطوير الويب", categoryEn: "Web development", level: 78, order: 7 },
  { name: "Node.js", categoryAr: "البرمجة والأساسيات", categoryEn: "Programming & core", level: 72, order: 8 },
  { name: "C Programming", categoryAr: "البرمجة والأساسيات", categoryEn: "Programming & core", level: 70, order: 9 },
  { name: "Arduino Nano", categoryAr: "البرمجة والأساسيات", categoryEn: "Programming & core", level: 65, order: 10 },
  { name: "ESP32", categoryAr: "البرمجة والأساسيات", categoryEn: "Programming & core", level: 62, order: 11 },
  { name: "Supabase", categoryAr: "قواعد البيانات والأدوات", categoryEn: "Data & tools", level: 80, order: 12 },
  { name: "PostgreSQL", categoryAr: "قواعد البيانات والأدوات", categoryEn: "Data & tools", level: 74, order: 13 },
  { name: "Git", categoryAr: "قواعد البيانات والأدوات", categoryEn: "Data & tools", level: 85, order: 14 },
  { name: "GitHub", categoryAr: "قواعد البيانات والأدوات", categoryEn: "Data & tools", level: 85, order: 15 },
  { name: "VS Code", categoryAr: "قواعد البيانات والأدوات", categoryEn: "Data & tools", level: 90, order: 16 },
  { name: "Prompt Engineering", categoryAr: "قواعد البيانات والأدوات", categoryEn: "Data & tools", level: 78, order: 17 },
  { name: "Canva", categoryAr: "قواعد البيانات والأدوات", categoryEn: "Data & tools", level: 75, order: 18 },
];

const EXPERIENCE = [
  {
    roleAr: "Online Moderator & Content Specialist", roleEn: "Online Moderator & Content Specialist",
    company: "Remote", periodAr: "الأحدث", periodEn: "Most recent",
    typeAr: "إدارة منصات", typeEn: "Platform management",
    descAr: "إدارة المنصات الرقمية والتفاعل المجتمعي، وإنتاج محتوى تعليمي وتقني باستخدام أدوات الذكاء الاصطناعي.",
    descEn: "Managing digital platforms and community engagement, and producing educational and technical content using AI tools.",
    order: 1,
  },
  {
    roleAr: "مدير فرع / قائد تشغيلي", roleEn: "Branch Manager / Operational Lead",
    company: "", periodAr: "العمليات والإدارة", periodEn: "Operations & management",
    typeAr: "العمليات والإدارة", typeEn: "Operations & management",
    descAr: "إدارة العمليات اليومية وسير العمل في الفرع، وقيادة الفريق للوصول لمعايير البيع والخدمة.",
    descEn: "Running daily operations and branch workflow, and leading the team to meet sales and service standards.",
    order: 2,
  },
  {
    roleAr: "مساعد عمليات مخازن", roleEn: "Warehouse Operations Assistant",
    company: "", periodAr: "العمليات واللوجستيات", periodEn: "Operations & logistics",
    typeAr: "العمليات واللوجستيات", typeEn: "Operations & logistics",
    descAr: "متابعة الجرد، وتنظيم التوزيع، والحفاظ على سجلات تشغيلية دقيقة.",
    descEn: "Overseeing inventory tracking, organising distribution, and keeping accurate operational records.",
    order: 3,
  },
];

const CERTIFICATES = [
  { titleAr: "HTML", titleEn: "HTML", issuer: "دورة مكتملة", date: "2026", image: "/img/certificate-html.webp", order: 1 },
  { titleAr: "CSS", titleEn: "CSS", issuer: "دورة مكتملة", date: "2025", image: "/img/certificate-css.webp", order: 2 },
  { titleAr: "JavaScript", titleEn: "JavaScript", issuer: "دورة مكتملة", date: "2025", image: "/img/certificate-4.webp", order: 3 },
  { titleAr: "Before Brand Event", titleEn: "Before Brand Event", issuer: "Arabian Academy & Before Brand Team", date: "27 أغسطس 2026", image: "/img/certificate-brand-event.webp", order: 4 },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "mtzm2225@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Moataz@2026";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: { email, passwordHash: await bcrypt.hash(password, 10), name: "Moataz Mohamed" },
    });
    console.log("✓ admin user created:", email);
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nameAr: "معتز محمد",
      nameEn: "Moataz Mohamed",
      roleAr: "مطوّر واجهات أمامية",
      roleEn: "Frontend Developer",
      taglineAr:
        "مطوّر واجهات أمامية من الإسكندرية، طالب في كلية تكنولوجيا المعلومات. بشتغل على بناء واجهات عربية سريعة وواضحة، وبحب المشاريع اللي فيها تفاصيل تصميم حقيقية مش بس كود بيشتغل.",
      taglineEn:
        "Frontend developer from Alexandria, an IT student. I build fast, clear Arabic interfaces — and I love projects with real design detail, not just code that runs.",
      bioAr:
        "أنا معتز محمد، مطوّر واجهات أمامية من الإسكندرية وطالب في كلية تكنولوجيا المعلومات بجامعة برج العرب التكنولوجية.\nبدأت من HTML و CSS، ودلوقتي ببني منتجات كاملة بـ React و Supabase — من الفكرة والتصميم لحد النشر على Vercel.\nأهم حاجة عندي إن المستخدم يفهم المكان اللي هو فيه من أول ثانية، وإن التفاصيل الصغيرة في التصميم تبقى ليها معنى.\nبشتغل كمان على إدارة المنصات الرقمية والقيادة التشغيلية، وده بيديني نظرة عملية للمنتج من برّه الكود.",
      bioEn:
        "I'm Moataz Mohamed, a frontend developer from Alexandria and an IT student at Borg El Arab Technological University.\nI started with HTML and CSS, and today I build complete products with React and Supabase — from idea and design to deployment on Vercel.\nWhat matters most to me is that the user understands where they are from the first second, and that the small design details actually mean something.\nI also work in digital platform management and operational leadership, which gives me a practical view of the product beyond the code.",
      email: "mtzm2225@gmail.com",
      phone: "+20 103 571 2862",
      locationAr: "الإسكندرية، مصر",
      locationEn: "Alexandria, Egypt",
      avatarUrl: "/img/face.webp",
      heroImage: "/img/face.webp",
      cvUrl: "",
      github: "https://github.com/moatazsmohamed",
      linkedin: "https://www.linkedin.com/in/moatazsmohamed",
      instagram: "https://www.instagram.com/moatazsmohamed",
      facebook: "",
      whatsapp: "https://wa.me/201035712862",
      available: true,
    },
  });

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    for (const p of PROJECTS) {
      await prisma.project.create({
        data: {
          ...p,
          tech: p.tech,
          featured: (p as any).featured ?? false,
          published: true,
        },
      });
    }
    console.log("✓ projects seeded:", PROJECTS.length);
  }

  if ((await prisma.skill.count()) === 0) {
    for (const s of SKILLS) await prisma.skill.create({ data: s });
    console.log("✓ skills seeded:", SKILLS.length);
  }

  if ((await prisma.experience.count()) === 0) {
    for (const e of EXPERIENCE) await prisma.experience.create({ data: e });
    console.log("✓ experience seeded:", EXPERIENCE.length);
  }

  if ((await prisma.certificate.count()) === 0) {
    for (const c of CERTIFICATES) await prisma.certificate.create({ data: c });
    console.log("✓ certificates seeded:", CERTIFICATES.length);
  }

  console.log("✓ seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
