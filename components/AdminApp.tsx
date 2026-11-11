"use client";

import { useEffect, useState } from "react";

type Any = Record<string, any>;

const TABS = [
  { id: "overview", ar: "نظرة عامة", en: "Overview" },
  { id: "settings", ar: "المعلومات الشخصية", en: "Profile" },
  { id: "projects", ar: "المشاريع", en: "Projects" },
  { id: "skills", ar: "المهارات", en: "Skills" },
  { id: "experience", ar: "الخبرات", en: "Experience" },
  { id: "certificates", ar: "الشهادات", en: "Certificates" },
  { id: "messages", ar: "الرسائل", en: "Messages" },
];

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  dir,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
  dir?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {textarea ? (
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} dir={dir} />
      ) : (
        <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} dir={dir} />
      )}
    </div>
  );
}

export default function AdminApp({
  initialAuthed,
  email,
}: {
  initialAuthed: boolean;
  email: string;
}) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [settings, setSettings] = useState<Any | null>(null);
  const [projects, setProjects] = useState<Any[]>([]);
  const [skills, setSkills] = useState<Any[]>([]);
  const [experience, setExperience] = useState<Any[]>([]);
  const [certificates, setCertificates] = useState<Any[]>([]);
  const [messages, setMessages] = useState<Any[]>([]);
  const [editing, setEditing] = useState<Any | null>(null);
  const [creating, setCreating] = useState(false);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [s, p, sk, ex, ce, ms] = await Promise.all([
        fetch("/api/admin/settings").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/admin/projects").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/admin/skills").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/admin/experience").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/admin/certificates").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/admin/messages").then((r) => (r.ok ? r.json() : [])),
      ]);
      setSettings(s);
      setProjects(Array.isArray(p) ? p : []);
      setSkills(Array.isArray(sk) ? sk : []);
      setExperience(Array.isArray(ex) ? ex : []);
      setCertificates(Array.isArray(ce) ? ce : []);
      setMessages(Array.isArray(ms) ? ms : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) loadAll();
  }, [authed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPass }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginErr("بيانات الدخول غير صحيحة / Invalid credentials");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
  }

  async function saveSettings() {
    if (!settings) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) flash("تم الحفظ ✓");
    else flash("فشل الحفظ");
  }

  async function uploadImage(file: File, apply: (url: string) => void) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      apply(url);
      flash("تم رفع الصورة ✓");
    } else flash("فشل رفع الصورة");
  }

  const endpoints: Record<string, string> = {
    projects: "/api/admin/projects",
    skills: "/api/admin/skills",
    experience: "/api/admin/experience",
    certificates: "/api/admin/certificates",
  };

  async function saveItem(kind: string, item: Any) {
    const isNew = !item.id;
    const url = isNew ? endpoints[kind] : `${endpoints[kind]}/${item.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      flash("تم الحفظ ✓");
      setEditing(null);
      setCreating(false);
      loadAll();
    } else flash("فشل الحفظ");
  }

  async function removeItem(kind: string, id: string) {
    if (!confirm("متأكد من الحذف؟ / Delete this item?")) return;
    const res = await fetch(`${endpoints[kind]}/${id}`, { method: "DELETE" });
    if (res.ok) {
      flash("تم الحذف");
      loadAll();
    } else flash("فشل الحذف");
  }

  async function toggleRead(m: Any) {
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    loadAll();
  }

  async function removeMessage(id: string) {
    if (!confirm("متأكد من حذف الرسالة؟")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    loadAll();
  }

  if (!authed) {
    return (
      <div className="login-wrap">
        <div className="bg-grid" />
        <div className="bg-glow a" />
        <form className="login-card" onSubmit={login} style={{ position: "relative", zIndex: 2 }}>
          <div className="brand" style={{ marginBottom: 22 }}>
            <span className="brand-mark">M&amp;M</span>
            <span>
              لوحة التحكم
              <small>Admin dashboard</small>
            </span>
          </div>
          <h1>تسجيل الدخول</h1>
          <p>ادخل ببيانات الأدمن للتحكم في كل محتوى الموقع.</p>
          {loginErr && <div className="alert err">{loginErr}</div>}
          <div className="field">
            <label>الإيميل / Email</label>
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} dir="ltr" autoComplete="username" />
          </div>
          <div className="field">
            <label>كلمة المرور / Password</label>
            <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} dir="ltr" autoComplete="current-password" />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
            دخول
          </button>
          <p className="form-note" style={{ textAlign: "center" }}>
            <a href="/" style={{ color: "var(--accent)" }}>← رجوع للموقع</a>
          </p>
        </form>
      </div>
    );
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <span className="brand-mark">M&amp;M</span>
          <span>
            لوحة التحكم
            <small>{email}</small>
          </span>
        </div>
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "on" : ""}
              onClick={() => {
                setTab(t.id);
                setEditing(null);
                setCreating(false);
              }}
            >
              {t.ar}
              {t.id === "messages" && unread > 0 ? ` (${unread})` : ""}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 24, display: "grid", gap: 8 }}>
          <a href="/" className="btn-sm" style={{ textAlign: "center" }}>عرض الموقع ↗</a>
          <button className="btn-sm danger" onClick={logout}>تسجيل الخروج</button>
        </div>
      </aside>

      <main className="admin-main">
        {toast && <div className="alert ok" style={{ position: "fixed", top: 20, insetInlineEnd: 20, zIndex: 99 }}>{toast}</div>}

        {tab === "overview" && (
          <>
            <div className="admin-head">
              <div>
                <h1>نظرة عامة</h1>
                <p>ملخص سريع لمحتوى الموقع.</p>
              </div>
              <button className="btn-sm" onClick={loadAll}>{loading ? "..." : "تحديث"}</button>
            </div>
            <div className="stat-cards">
              <div className="stat-card"><b>{projects.length}</b><span>مشاريع</span></div>
              <div className="stat-card"><b>{skills.length}</b><span>مهارات</span></div>
              <div className="stat-card"><b>{experience.length}</b><span>خبرات</span></div>
              <div className="stat-card"><b>{messages.length}</b><span>رسائل ({unread} جديد)</span></div>
            </div>
            <div className="card">
              <h3>آخر الرسائل</h3>
              {messages.slice(0, 5).map((m) => (
                <div className="list-item" key={m.id}>
                  <div>
                    <b>{m.name} — {m.email}</b>
                    <small>{new Date(m.createdAt).toLocaleString("ar-EG")}</small>
                  </div>
                  <span className={`badge ${m.read ? "" : "on"}`}>{m.read ? "مقروءة" : "جديدة"}</span>
                </div>
              ))}
              {messages.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>لا توجد رسائل بعد.</p>}
            </div>
          </>
        )}

        {tab === "settings" && settings && (
          <>
            <div className="admin-head">
              <div>
                <h1>المعلومات الشخصية</h1>
                <p>كل ما يظهر في الهيرو وقسم «من أنا» والتواصل.</p>
              </div>
              <button className="btn-sm primary" onClick={saveSettings}>حفظ التغييرات</button>
            </div>
            <div className="card">
              <h3>الاسم والدور</h3>
              <div className="grid-2">
                <Field label="الاسم (عربي)" value={settings.nameAr} onChange={(v) => setSettings({ ...settings, nameAr: v })} />
                <Field label="Name (English)" value={settings.nameEn} onChange={(v) => setSettings({ ...settings, nameEn: v })} dir="ltr" />
                <Field label="الدور (عربي)" value={settings.roleAr} onChange={(v) => setSettings({ ...settings, roleAr: v })} />
                <Field label="Role (English)" value={settings.roleEn} onChange={(v) => setSettings({ ...settings, roleEn: v })} dir="ltr" />
              </div>
            </div>
            <div className="card">
              <h3>النبذة</h3>
              <Field label="الجملة التعريفية (عربي)" value={settings.taglineAr} onChange={(v) => setSettings({ ...settings, taglineAr: v })} textarea />
              <Field label="Tagline (English)" value={settings.taglineEn} onChange={(v) => setSettings({ ...settings, taglineEn: v })} textarea dir="ltr" />
              <Field label="النبذة الكاملة (عربي) — كل سطر = فقرة" value={settings.bioAr} onChange={(v) => setSettings({ ...settings, bioAr: v })} textarea />
              <Field label="Full bio (English)" value={settings.bioEn} onChange={(v) => setSettings({ ...settings, bioEn: v })} textarea dir="ltr" />
            </div>
            <div className="card">
              <h3>التواصل والصور</h3>
              <div className="grid-2">
                <Field label="الإيميل" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} dir="ltr" />
                <Field label="الموبايل" value={settings.phone} onChange={(v) => setSettings({ ...settings, phone: v })} dir="ltr" />
                <Field label="المكان (عربي)" value={settings.locationAr} onChange={(v) => setSettings({ ...settings, locationAr: v })} />
                <Field label="Location (English)" value={settings.locationEn} onChange={(v) => setSettings({ ...settings, locationEn: v })} dir="ltr" />
                <Field label="GitHub" value={settings.github} onChange={(v) => setSettings({ ...settings, github: v })} dir="ltr" />
                <Field label="LinkedIn" value={settings.linkedin} onChange={(v) => setSettings({ ...settings, linkedin: v })} dir="ltr" />
                <Field label="Instagram" value={settings.instagram} onChange={(v) => setSettings({ ...settings, instagram: v })} dir="ltr" />
                <Field label="WhatsApp" value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} dir="ltr" />
                <Field label="رابط السيرة الذاتية (CV)" value={settings.cvUrl} onChange={(v) => setSettings({ ...settings, cvUrl: v })} dir="ltr" />
                <Field label="صورة الهيرو" value={settings.heroImage} onChange={(v) => setSettings({ ...settings, heroImage: v })} dir="ltr" />
              </div>
              <div className="field">
                <label>رفع صورة الهيرو</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f, (url) => setSettings({ ...settings, heroImage: url }));
                  }}
                />
              </div>
              <div className="field">
                <label>متاح للعمل؟</label>
                <select
                  value={settings.available ? "1" : "0"}
                  onChange={(e) => setSettings({ ...settings, available: e.target.value === "1" })}
                >
                  <option value="1">نعم — متاح</option>
                  <option value="0">لا — غير متاح</option>
                </select>
              </div>
              <button className="btn-sm primary" onClick={saveSettings}>حفظ التغييرات</button>
            </div>
          </>
        )}

        {tab === "projects" && (
          <>
            <div className="admin-head">
              <div>
                <h1>المشاريع</h1>
                <p>إضافة وتعديل وحذف المشاريع المعروضة.</p>
              </div>
              <button
                className="btn-sm primary"
                onClick={() => {
                  setCreating(true);
                  setEditing({
                    titleAr: "", titleEn: "", categoryAr: "", categoryEn: "",
                    descAr: "", descEn: "", image: "", url: "", repo: "",
                    tech: [], year: "", order: projects.length, published: true, featured: false,
                  });
                }}
              >
                + مشروع جديد
              </button>
            </div>

            {editing && (
              <div className="card">
                <h3>{creating ? "مشروع جديد" : "تعديل مشروع"}</h3>
                <div className="grid-2">
                  <Field label="العنوان (عربي)" value={editing.titleAr} onChange={(v) => setEditing({ ...editing, titleAr: v })} />
                  <Field label="Title (English)" value={editing.titleEn} onChange={(v) => setEditing({ ...editing, titleEn: v })} dir="ltr" />
                  <Field label="التصنيف (عربي)" value={editing.categoryAr} onChange={(v) => setEditing({ ...editing, categoryAr: v })} />
                  <Field label="Category (English)" value={editing.categoryEn} onChange={(v) => setEditing({ ...editing, categoryEn: v })} dir="ltr" />
                </div>
                <Field label="الوصف (عربي)" value={editing.descAr} onChange={(v) => setEditing({ ...editing, descAr: v })} textarea />
                <Field label="Description (English)" value={editing.descEn} onChange={(v) => setEditing({ ...editing, descEn: v })} textarea dir="ltr" />
                <div className="grid-2">
                  <Field label="رابط المشروع" value={editing.url} onChange={(v) => setEditing({ ...editing, url: v })} dir="ltr" />
                  <Field label="رابط الكود" value={editing.repo} onChange={(v) => setEditing({ ...editing, repo: v })} dir="ltr" />
                  <Field label="صورة المشروع" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} dir="ltr" />
                  <Field label="السنة" value={editing.year} onChange={(v) => setEditing({ ...editing, year: v })} dir="ltr" />
                </div>
                <Field
                  label="التقنيات (مفصولة بفاصلة)"
                  value={Array.isArray(editing.tech) ? editing.tech.join(", ") : editing.tech}
                  onChange={(v) => setEditing({ ...editing, tech: v.split(",").map((x) => x.trim()).filter(Boolean) })}
                  dir="ltr"
                />
                <div className="field">
                  <label>رفع صورة</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImage(f, (url) => setEditing({ ...editing, image: url }));
                    }}
                  />
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>منشور؟</label>
                    <select value={editing.published ? "1" : "0"} onChange={(e) => setEditing({ ...editing, published: e.target.value === "1" })}>
                      <option value="1">منشور</option>
                      <option value="0">مخفي</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>الترتيب</label>
                    <input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="row-actions">
                  <button className="btn-sm primary" onClick={() => saveItem("projects", editing)}>حفظ</button>
                  <button className="btn-sm" onClick={() => { setEditing(null); setCreating(false); }}>إلغاء</button>
                </div>
              </div>
            )}

            <div className="card">
              <h3>كل المشاريع ({projects.length})</h3>
              {projects.map((p) => (
                <div className="list-item" key={p.id}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {p.image && <img src={p.image} alt="" className="thumb" />}
                    <div>
                      <b>{p.titleAr || p.titleEn}</b>
                      <small>{p.categoryAr || p.categoryEn} · {p.tech?.slice(0, 3).join(" · ")}</small>
                    </div>
                  </div>
                  <div className="row-actions">
                    <span className={`badge ${p.published ? "on" : ""}`}>{p.published ? "منشور" : "مخفي"}</span>
                    <button className="btn-sm" onClick={() => { setEditing(p); setCreating(false); }}>تعديل</button>
                    <button className="btn-sm danger" onClick={() => removeItem("projects", p.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "skills" && (
          <>
            <div className="admin-head">
              <div><h1>المهارات</h1><p>المهارات ومستواها ومجموعتها.</p></div>
              <button className="btn-sm primary" onClick={() => { setCreating(true); setEditing({ name: "", categoryAr: "", categoryEn: "", level: 80, order: skills.length }); }}>
                + مهارة جديدة
              </button>
            </div>
            {editing && (
              <div className="card">
                <h3>{creating ? "مهارة جديدة" : "تعديل مهارة"}</h3>
                <div className="grid-2">
                  <Field label="الاسم" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} dir="ltr" />
                  <Field label="المستوى (0-100)" value={editing.level} onChange={(v) => setEditing({ ...editing, level: Number(v) })} type="number" />
                  <Field label="المجموعة (عربي)" value={editing.categoryAr} onChange={(v) => setEditing({ ...editing, categoryAr: v })} />
                  <Field label="Group (English)" value={editing.categoryEn} onChange={(v) => setEditing({ ...editing, categoryEn: v })} dir="ltr" />
                </div>
                <div className="row-actions">
                  <button className="btn-sm primary" onClick={() => saveItem("skills", editing)}>حفظ</button>
                  <button className="btn-sm" onClick={() => { setEditing(null); setCreating(false); }}>إلغاء</button>
                </div>
              </div>
            )}
            <div className="card">
              <h3>كل المهارات ({skills.length})</h3>
              {skills.map((s) => (
                <div className="list-item" key={s.id}>
                  <div>
                    <b>{s.name}</b>
                    <small>{s.categoryAr || s.categoryEn} · {s.level}%</small>
                  </div>
                  <div className="row-actions">
                    <button className="btn-sm" onClick={() => { setEditing(s); setCreating(false); }}>تعديل</button>
                    <button className="btn-sm danger" onClick={() => removeItem("skills", s.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "experience" && (
          <>
            <div className="admin-head">
              <div><h1>الخبرات</h1><p>الخط الزمني للخبرات العملية.</p></div>
              <button className="btn-sm primary" onClick={() => { setCreating(true); setEditing({ roleAr: "", roleEn: "", company: "", periodAr: "", periodEn: "", descAr: "", descEn: "", typeAr: "", typeEn: "", order: experience.length }); }}>
                + خبرة جديدة
              </button>
            </div>
            {editing && (
              <div className="card">
                <h3>{creating ? "خبرة جديدة" : "تعديل خبرة"}</h3>
                <div className="grid-2">
                  <Field label="المسمى (عربي)" value={editing.roleAr} onChange={(v) => setEditing({ ...editing, roleAr: v })} />
                  <Field label="Role (English)" value={editing.roleEn} onChange={(v) => setEditing({ ...editing, roleEn: v })} dir="ltr" />
                  <Field label="الشركة" value={editing.company} onChange={(v) => setEditing({ ...editing, company: v })} />
                  <Field label="الفترة (عربي)" value={editing.periodAr} onChange={(v) => setEditing({ ...editing, periodAr: v })} />
                  <Field label="Period (English)" value={editing.periodEn} onChange={(v) => setEditing({ ...editing, periodEn: v })} dir="ltr" />
                  <Field label="النوع (عربي)" value={editing.typeAr} onChange={(v) => setEditing({ ...editing, typeAr: v })} />
                </div>
                <Field label="الوصف (عربي)" value={editing.descAr} onChange={(v) => setEditing({ ...editing, descAr: v })} textarea />
                <Field label="Description (English)" value={editing.descEn} onChange={(v) => setEditing({ ...editing, descEn: v })} textarea dir="ltr" />
                <div className="row-actions">
                  <button className="btn-sm primary" onClick={() => saveItem("experience", editing)}>حفظ</button>
                  <button className="btn-sm" onClick={() => { setEditing(null); setCreating(false); }}>إلغاء</button>
                </div>
              </div>
            )}
            <div className="card">
              <h3>كل الخبرات ({experience.length})</h3>
              {experience.map((x) => (
                <div className="list-item" key={x.id}>
                  <div>
                    <b>{x.roleAr || x.roleEn}</b>
                    <small>{x.company} · {x.periodAr || x.periodEn}</small>
                  </div>
                  <div className="row-actions">
                    <button className="btn-sm" onClick={() => { setEditing(x); setCreating(false); }}>تعديل</button>
                    <button className="btn-sm danger" onClick={() => removeItem("experience", x.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "certificates" && (
          <>
            <div className="admin-head">
              <div><h1>الشهادات</h1><p>الشهادات والدورات المعروضة.</p></div>
              <button className="btn-sm primary" onClick={() => { setCreating(true); setEditing({ titleAr: "", titleEn: "", issuer: "", date: "", image: "", url: "", order: certificates.length }); }}>
                + شهادة جديدة
              </button>
            </div>
            {editing && (
              <div className="card">
                <h3>{creating ? "شهادة جديدة" : "تعديل شهادة"}</h3>
                <div className="grid-2">
                  <Field label="العنوان (عربي)" value={editing.titleAr} onChange={(v) => setEditing({ ...editing, titleAr: v })} />
                  <Field label="Title (English)" value={editing.titleEn} onChange={(v) => setEditing({ ...editing, titleEn: v })} dir="ltr" />
                  <Field label="الجهة" value={editing.issuer} onChange={(v) => setEditing({ ...editing, issuer: v })} />
                  <Field label="التاريخ" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} />
                  <Field label="الصورة" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} dir="ltr" />
                  <Field label="الرابط" value={editing.url} onChange={(v) => setEditing({ ...editing, url: v })} dir="ltr" />
                </div>
                <div className="field">
                  <label>رفع صورة الشهادة</label>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, (url) => setEditing({ ...editing, image: url })); }} />
                </div>
                <div className="row-actions">
                  <button className="btn-sm primary" onClick={() => saveItem("certificates", editing)}>حفظ</button>
                  <button className="btn-sm" onClick={() => { setEditing(null); setCreating(false); }}>إلغاء</button>
                </div>
              </div>
            )}
            <div className="card">
              <h3>كل الشهادات ({certificates.length})</h3>
              {certificates.map((c) => (
                <div className="list-item" key={c.id}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {c.image && <img src={c.image} alt="" className="thumb" />}
                    <div>
                      <b>{c.titleAr || c.titleEn}</b>
                      <small>{c.issuer} · {c.date}</small>
                    </div>
                  </div>
                  <div className="row-actions">
                    <button className="btn-sm" onClick={() => { setEditing(c); setCreating(false); }}>تعديل</button>
                    <button className="btn-sm danger" onClick={() => removeItem("certificates", c.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "messages" && (
          <>
            <div className="admin-head">
              <div><h1>الرسائل</h1><p>رسائل التواصل الواردة من الموقع.</p></div>
              <button className="btn-sm" onClick={loadAll}>تحديث</button>
            </div>
            {messages.length === 0 && <div className="card"><p style={{ color: "var(--muted)", fontSize: 13 }}>لا توجد رسائل بعد.</p></div>}
            {messages.map((m) => (
              <div className="card" key={m.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <b style={{ fontSize: 14 }}>{m.name}</b>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }} dir="ltr">
                      {m.email} {m.phone ? `· ${m.phone}` : ""}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                      {new Date(m.createdAt).toLocaleString("ar-EG")} {m.projectType ? `· ${m.projectType}` : ""}
                    </div>
                  </div>
                  <div className="row-actions">
                    <span className={`badge ${m.read ? "" : "on"}`}>{m.read ? "مقروءة" : "جديدة"}</span>
                    <button className="btn-sm" onClick={() => toggleRead(m)}>{m.read ? "علّم كغير مقروءة" : "علّم كمقروءة"}</button>
                    <a className="btn-sm" href={`mailto:${m.email}`}>رد</a>
                    <button className="btn-sm danger" onClick={() => removeMessage(m.id)}>حذف</button>
                  </div>
                </div>
                <p className="msg-body">{m.body}</p>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
