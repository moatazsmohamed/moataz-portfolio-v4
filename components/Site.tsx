"use client";
// ======================================================================
// moataz-portfolio-v4
// Copyright (c) 2026 Moataz Mohamed <mtzm2225@gmail.com> — all rights reserved.
// Author: Moataz Mohamed  <https://github.com/moatazsmohamed>
// Fingerprint: e8fa428b72fc0e43a2632e36723784d1
// This notice is part of the work and must not be removed.
// ======================================================================

import { useEffect, useMemo, useRef, useState } from "react";

type Settings = {
  nameAr: string; nameEn: string; roleAr: string; roleEn: string;
  taglineAr: string; taglineEn: string; bioAr: string; bioEn: string;
  email: string; phone: string; locationAr: string; locationEn: string;
  avatarUrl: string; heroImage: string; cvUrl: string;
  github: string; linkedin: string; instagram: string; facebook: string; whatsapp: string;
  available: boolean;
};
type Project = {
  id: string; slug: string; titleAr: string; titleEn: string;
  categoryAr: string; categoryEn: string; descAr: string; descEn: string;
  image: string; url: string; repo: string; tech: string[]; featured: boolean; year: string;
};
type Skill = { id: string; name: string; categoryAr: string; categoryEn: string; level: number };
type Experience = {
  id: string; roleAr: string; roleEn: string; company: string;
  periodAr: string; periodEn: string; descAr: string; descEn: string; typeAr: string; typeEn: string;
};
type Certificate = { id: string; titleAr: string; titleEn: string; issuer: string; date: string; image: string; url: string };
type Data = {
  settings: Settings | null; projects: Project[]; skills: Skill[];
  experience: Experience[]; certificates: Certificate[]; visits: number;
};

const T = {
  ar: {
    nav: ["الرئيسية", "أعمالي", "من أنا", "المهارات", "الخبرات", "تواصل"],
    talk: "خلّينا نتكلم",
    available: "متاح للشغل الحر والفرص التدريبية",
    viewWork: "شوف أعمالي",
    downloadCv: "تحميل السيرة الذاتية",
    stats: ["مشاريع منشورة", "تقنيات وأدوات", "سنين تجربة"],
    aboutNum: "01 — من أنا",
    aboutTitle: "شوية كلام عنّي",
    aboutSub: "مطوّر واجهات أمامية من الإسكندرية، بحب المشاريع اللي فيها تفاصيل تصميم حقيقية مش بس كود بيشتغل.",
    projectsNum: "02 — أعمالي",
    projectsTitle: "أحدث أعمالي",
    projectsSub: "منتجات كاملة — من الفكرة والتصميم لحد النشر على Vercel.",
    skillsNum: "03 — أدواتي",
    skillsTitle: "التقنيات اللي بشتغل بيها",
    skillsSub: "أدوات بستخدمها يوميًا لبناء واجهات سريعة وواضحة.",
    expNum: "04 — المسار",
    expTitle: "الخبرات العملية",
    expSub: "خبرة عملية بين إدارة المنصات الرقمية والقيادة التشغيلية والشغل التقني الدقيق.",
    certNum: "05 — الشهادات",
    certTitle: "شهاداتي",
    certSub: "شهادات ودورات أكملتها في تطوير الويب.",
    contactNum: "06 — تواصل",
    contactTitle: "خلّينا نبني حاجة تتحكي",
    contactSub: "متاح للشغل الحر والفرص التدريبية — ولأي فكرة حابب ننفّذها سوا.",
    formName: "الاسم", formEmail: "الإيميل", formPhone: "الموبايل (اختياري)",
    formType: "نوع المشروع", formBody: "الفكرة / تفاصيل المشروع", formSend: "ابعت الفكرة",
    formNote: "الرسالة بتوصل مباشرة للوحة التحكم وبتتخزن في قاعدة البيانات.",
    types: ["موقع تعريفي", "متجر إلكتروني", "تطبيق ويب", "لوحة تحكم", "حاجة تاني"],
    viewProject: "زيارة المشروع", viewRepo: "الكود",
    footer: "مصمّم ومبني بإيد من الإسكندرية",
    rights: "كل الحقوق محفوظة",
    admin: "لوحة التحكم",
    sent: "تم إرسال رسالتك بنجاح — هرد عليك في أقرب وقت.",
    err: "حصلت مشكلة، جرّب تاني.",
    required: "من فضلك اكمل الاسم والإيميل والرسالة.",
    visits: "زيارة",
  },
  en: {
    nav: ["Home", "Work", "About", "Skills", "Experience", "Contact"],
    talk: "Let's talk",
    available: "Open to freelance & internships",
    viewWork: "View my work",
    downloadCv: "Download CV",
    stats: ["Live projects", "Technologies", "Years experience"],
    aboutNum: "01 — About",
    aboutTitle: "A few words about me",
    aboutSub: "Frontend developer from Alexandria, drawn to projects with real design detail — not just code that runs.",
    projectsNum: "02 — Work",
    projectsTitle: "Selected work",
    projectsSub: "Complete products — from idea and design to deployment on Vercel.",
    skillsNum: "03 — Toolkit",
    skillsTitle: "Technologies I work with",
    skillsSub: "Tools I use daily to build fast, clear interfaces.",
    expNum: "04 — Path",
    expTitle: "Professional experience",
    expSub: "Hands-on experience across digital platform management, operational leadership and precise technical work.",
    certNum: "05 — Certificates",
    certTitle: "Certificates",
    certSub: "Certificates and courses I completed in web development.",
    contactNum: "06 — Contact",
    contactTitle: "Let's build something worth talking about",
    contactSub: "Available for freelance work and internships — and for any idea you'd like to build together.",
    formName: "Name", formEmail: "Email", formPhone: "Phone (optional)",
    formType: "Project type", formBody: "Idea / project details", formSend: "Send the idea",
    formNote: "Your message goes straight to the dashboard and is stored in the database.",
    types: ["Landing page", "E-commerce", "Web app", "Dashboard", "Something else"],
    viewProject: "Visit project", viewRepo: "Source",
    footer: "Designed & built by hand from Alexandria",
    rights: "All rights reserved",
    admin: "Dashboard",
    sent: "Your message was sent — I'll get back to you soon.",
    err: "Something went wrong, please try again.",
    required: "Please fill in name, email and message.",
    visits: "visits",
  },
};

export default function Site({ data }: { data: Data }) {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", projectType: "", body: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [formMsg, setFormMsg] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const t = T[lang];
  const s = data.settings;
  const isAr = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }, [lang, isAr]);

  useEffect(() => {
    const key = "mp_visited";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: window.location.pathname }),
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll(".reveal");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  const skillGroups = useMemo(() => {
    const map = new Map<string, Skill[]>();
    data.skills.forEach((sk) => {
      const key = (isAr ? sk.categoryAr : sk.categoryEn) || (isAr ? "أخرى" : "Other");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(sk);
    });
    return Array.from(map.entries());
  }, [data.skills, isAr]);

  const marqueeItems = useMemo(() => {
    const base = data.skills.map((x) => x.name);
    return base.length ? base : ["React", "Next.js", "TypeScript", "Supabase", "Node.js"];
  }, [data.skills]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.body.trim()) {
      setStatus("err");
      setFormMsg(t.required);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      setFormMsg(t.sent);
      setForm({ name: "", email: "", phone: "", projectType: "", body: "" });
    } catch {
      setStatus("err");
      setFormMsg(t.err);
    }
  }

  const name = isAr ? s?.nameAr : s?.nameEn;
  const role = isAr ? s?.roleAr : s?.roleEn;
  const tagline = isAr ? s?.taglineAr : s?.taglineEn;
  const bio = isAr ? s?.bioAr : s?.bioEn;
  const location = isAr ? s?.locationAr : s?.locationEn;

  const navIds = ["home", "work", "about", "skills", "experience", "contact"];

  return (
    <div ref={rootRef}>
      <div className="bg-grid" />
      <div className="bg-glow a" />
      <div className="bg-glow b" />
      <div className="bg-noise" />

      <div className="wrap">
        {/* NAV */}
        <header className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-inner">
            <a href="#home" className="brand">
              <span className="brand-mark">M&amp;M</span>
              <span>
                {name}
                <small>{role}</small>
              </span>
            </a>

            <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
              {t.nav.map((label, i) => (
                <a key={label} href={`#${navIds[i]}`} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </nav>

            <div className="nav-actions">
              <div className="lang-toggle">
                <button className={isAr ? "on" : ""} onClick={() => setLang("ar")}>AR</button>
                <button className={!isAr ? "on" : ""} onClick={() => setLang("en")}>EN</button>
              </div>
              <a href="#contact" className="btn btn-primary" style={{ padding: "9px 16px" }}>
                {t.talk}
              </a>
              <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="menu">
                ☰
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="hero" id="home">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">
                  <span className="dot" />
                  {s?.available ? t.available : role}
                </div>
                <h1>
                  <span className="grad">{name}</span>
                  <span className="jp">{isAr ? "フロントエンド・デベロッパー" : "FRONTEND DEVELOPER"}</span>
                </h1>
                <p className="lead">{tagline || bio}</p>
                <div className="hero-cta">
                  <a href="#work" className="btn btn-primary">
                    {t.viewWork} <span>→</span>
                  </a>
                  {s?.cvUrl ? (
                    <a href={s.cvUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                      {t.downloadCv}
                    </a>
                  ) : (
                    <a href="#contact" className="btn btn-ghost">{t.talk}</a>
                  )}
                </div>
                <div className="hero-stats">
                  <div className="s">
                    <b>{data.projects.length}+</b>
                    <span>{t.stats[0]}</span>
                  </div>
                  <div className="s">
                    <b>{data.skills.length}+</b>
                    <span>{t.stats[1]}</span>
                  </div>
                  <div className="s">
                    <b>2+</b>
                    <span>{t.stats[2]}</span>
                  </div>
                </div>
              </div>

              <div className="portrait-wrap">
                <div className="portrait-ring" />
                <div className="portrait">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s?.heroImage || s?.avatarUrl || "/img/face.webp"} alt={name || "portrait"} />
                  <div className="portrait-tag">
                    <span>{location}</span>
                    <b>{data.visits} {t.visits}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section className="section" id="about">
          <div className="container">
            <div className="section-head reveal">
              <div className="section-num">{t.aboutNum}</div>
              <h2>{t.aboutTitle}</h2>
              <p>{t.aboutSub}</p>
            </div>
            <div className="about-grid">
              <div className="about-text reveal">
                {(bio || "").split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <div className="hero-cta" style={{ marginTop: 26, marginBottom: 0 }}>
                  <a href="#contact" className="btn btn-ghost">{t.talk}</a>
                  {s?.github && (
                    <a href={s.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
              <div className="pillars reveal">
                {[
                  { k: "01", ar: "تطوير الويب", en: "Web development", dar: "واجهات سريعة ومتجاوبة بـ React و Next.js مع تفاصيل تصميم حقيقية.", den: "Fast, responsive interfaces with React and Next.js — with real design detail." },
                  { k: "02", ar: "قواعد البيانات", en: "Databases", dar: "نماذج بيانات وصلاحيات على Supabase و PostgreSQL.", den: "Data models and permissions on Supabase and PostgreSQL." },
                  { k: "03", ar: "تجربة المستخدم", en: "User experience", dar: "المستخدم لازم يفهم المكان اللي هو فيه من أول ثانية.", den: "The user should understand where they are from the first second." },
                  { k: "04", ar: "من الفكرة للنشر", en: "Idea to deployment", dar: "من التصميم للكود للنشر على Vercel — مسؤولية كاملة.", den: "From design to code to deployment on Vercel — full ownership." },
                ].map((p) => (
                  <div className="pillar" key={p.k}>
                    <h4>
                      <i>{p.k}</i>
                      {isAr ? p.ar : p.en}
                    </h4>
                    <p>{isAr ? p.dar : p.den}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="section" id="work">
          <div className="container">
            <div className="section-head reveal">
              <div className="section-num">{t.projectsNum}</div>
              <h2>{t.projectsTitle}</h2>
              <p>{t.projectsSub}</p>
            </div>
            <div className="projects-grid">
              {data.projects.map((p, i) => (
                <article className="project-card reveal" key={p.id}>
                  <div className="project-media">
                    <span className="project-index">{String(i + 1).padStart(2, "0")}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image || "/img/portfolio-preview.webp"} alt={isAr ? p.titleAr : p.titleEn} loading="lazy" />
                  </div>
                  <div className="project-body">
                    <div className="project-cat">
                      {(isAr ? p.categoryAr : p.categoryEn) || p.year}
                    </div>
                    <h3>{isAr ? p.titleAr : p.titleEn}</h3>
                    <p>{isAr ? p.descAr : p.descEn}</p>
                    <div className="tech-row">
                      {p.tech.slice(0, 6).map((tech) => (
                        <span className="tech" key={tech}>{tech}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer">
                          {t.viewProject} <span>↗</span>
                        </a>
                      )}
                      {p.repo && (
                        <a href={p.repo} target="_blank" rel="noreferrer" className="muted">
                          {t.viewRepo} <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="section" id="skills">
          <div className="container">
            <div className="section-head reveal">
              <div className="section-num">{t.skillsNum}</div>
              <h2>{t.skillsTitle}</h2>
              <p>{t.skillsSub}</p>
            </div>
            <div className="skills-grid">
              {skillGroups.map(([group, items]) => (
                <div className="skill-group reveal" key={group}>
                  <h4>{group}</h4>
                  {items.map((sk) => (
                    <div className="skill-item" key={sk.id}>
                      <div className="skill-top">
                        <span>{sk.name}</span>
                        <span>{sk.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <i style={{ width: `${Math.min(100, Math.max(0, sk.level))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="section" id="experience">
          <div className="container">
            <div className="section-head reveal">
              <div className="section-num">{t.expNum}</div>
              <h2>{t.expTitle}</h2>
              <p>{t.expSub}</p>
            </div>
            <div className="timeline">
              {data.experience.map((x) => (
                <div className="tl-item reveal" key={x.id}>
                  <div className="tl-period">
                    {(isAr ? x.periodAr : x.periodEn) || (isAr ? x.typeAr : x.typeEn)}
                  </div>
                  <h4>{isAr ? x.roleAr : x.roleEn}</h4>
                  <div className="tl-company">
                    {x.company}
                    {(isAr ? x.typeAr : x.typeEn) ? ` · ${isAr ? x.typeAr : x.typeEn}` : ""}
                  </div>
                  <p>{isAr ? x.descAr : x.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATES */}
        {data.certificates.length > 0 && (
          <section className="section" id="certificates">
            <div className="container">
              <div className="section-head reveal">
                <div className="section-num">{t.certNum}</div>
                <h2>{t.certTitle}</h2>
                <p>{t.certSub}</p>
              </div>
              <div className="cert-grid">
                {data.certificates.map((c) => (
                  <div className="cert reveal" key={c.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image || "/img/certificate-html.webp"} alt={isAr ? c.titleAr : c.titleEn} loading="lazy" />
                    <div className="cert-body">
                      <h5>{isAr ? c.titleAr : c.titleEn}</h5>
                      <span>{c.issuer || c.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info reveal">
                <div className="section-num">{t.contactNum}</div>
                <h2>{t.contactTitle}</h2>
                <p>{t.contactSub}</p>
                <div className="contact-lines">
                  {s?.email && (
                    <a className="contact-line" href={`mailto:${s.email}`}>
                      <span className="ic">✉</span>
                      <span>
                        <small>Email</small>
                        <b>{s.email}</b>
                      </span>
                    </a>
                  )}
                  {s?.phone && (
                    <a className="contact-line" href={`tel:${s.phone}`}>
                      <span className="ic">☎</span>
                      <span>
                        <small>Phone</small>
                        <b dir="ltr">{s.phone}</b>
                      </span>
                    </a>
                  )}
                  {s?.github && (
                    <a className="contact-line" href={s.github} target="_blank" rel="noreferrer">
                      <span className="ic">⌥</span>
                      <span>
                        <small>GitHub</small>
                        <b>{s.github.replace("https://github.com/", "@")}</b>
                      </span>
                    </a>
                  )}
                  {s?.linkedin && (
                    <a className="contact-line" href={s.linkedin} target="_blank" rel="noreferrer">
                      <span className="ic">in</span>
                      <span>
                        <small>LinkedIn</small>
                        <b>LinkedIn</b>
                      </span>
                    </a>
                  )}
                </div>
              </div>

              <form className="form-card reveal" onSubmit={submit}>
                {status === "ok" && <div className="alert ok">{formMsg}</div>}
                {status === "err" && <div className="alert err">{formMsg}</div>}
                <div className="field-row">
                  <div className="field">
                    <label>{t.formName}</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={isAr ? "اسمك" : "Your name"}
                    />
                  </div>
                  <div className="field">
                    <label>{t.formEmail}</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>{t.formPhone}</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+20 ..."
                      dir="ltr"
                    />
                  </div>
                  <div className="field">
                    <label>{t.formType}</label>
                    <select
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    >
                      <option value="">—</option>
                      {t.types.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>{t.formBody}</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder={isAr ? "احكيلي عن الفكرة..." : "Tell me about the idea..."}
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={status === "sending"} style={{ width: "100%", justifyContent: "center" }}>
                  {status === "sending" ? "..." : t.formSend}
                </button>
                <p className="form-note">{t.formNote}</p>
              </form>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footer-inner">
            <p>© {new Date().getFullYear()} {name} — {t.footer}</p>
            <div className="footer-links">
              {s?.github && <a href={s.github} target="_blank" rel="noreferrer">GitHub</a>}
              {s?.linkedin && <a href={s.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {s?.instagram && <a href={s.instagram} target="_blank" rel="noreferrer">Instagram</a>}
              <a href="/admin">{t.admin}</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
