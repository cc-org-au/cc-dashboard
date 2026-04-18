import { useState } from "react";
import { Surface, Btn, Badge, Dot, Avi, Toggle, Modal, Field, Input, Select, Progress, THEMES, F } from "./primitives";
import { DB } from "./data";
import { SettingsIcon, Bot, Bell, Lock, CreditCard, Users, Palette, Sun, Moon } from "../icons";

export default function SettingsScreen({ T, themeKey, setTheme, isMobile }) {
  const [tab, setTab] = useState("general");
  const [openAIKey, setOpenAIKey] = useState(() => localStorage.getItem("openai_key") || "");
  const [saved, setSaved] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [toggles, setToggles] = useState({ critical: true, warning: true, billing: false, digest: true, deployments: false });

  const save = () => { localStorage.setItem("openai_key", openAIKey); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const settingsTabs = [
    { id: "general",        label: "General",        icon: <SettingsIcon size={16} /> },
    { id: "ai",             label: "AI & Agents",    icon: <Bot size={16} /> },
    { id: "notifications",  label: "Notifications",  icon: <Bell size={16} /> },
    { id: "security",       label: "Security",       icon: <Lock size={16} /> },
    { id: "billing",        label: "Plan & Billing", icon: <CreditCard size={16} /> },
    { id: "team",           label: "Team",           icon: <Users size={16} /> },
    { id: "appearance",     label: "Appearance",     icon: <Palette size={16} /> },
  ];

  const plans = [
    { id: "starter", name: "Starter", price: "$0", features: ["5 users", "2 AI agents", "10K API calls/mo", "Basic integrations"], current: true },
    { id: "pro", name: "Professional", price: "$49/mo", features: ["25 users", "10 AI agents", "500K API calls/mo", "All integrations", "Priority support", "Custom workflows"], highlight: true },
    { id: "enterprise", name: "Enterprise", price: "Custom", features: ["Unlimited users", "Unlimited agents", "Unlimited API calls", "SSO + SAML", "Dedicated support", "Custom SLAs"], cta: "Contact Sales" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Settings</div>
        <div style={{ color: T.t2, fontSize: 13, marginTop: 2 }}>Manage your organization and preferences</div>
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 24, alignItems: "flex-start" }}>
        {/* GitHub-style left sidebar nav */}
        <div style={{ width: isMobile ? "100%" : 220, flexShrink: 0, display: isMobile ? "flex" : "block", gap: 4, overflowX: isMobile ? "auto" : "visible", paddingBottom: isMobile ? 4 : 0 }}>
          {settingsTabs.map(st => (
            <button key={st.id} onClick={() => setTab(st.id)}
              style={{
                width: isMobile ? "auto" : "100%", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 10px", marginBottom: 2, whiteSpace: "nowrap",
                background: tab === st.id ? T.accentBg : "none",
                border: "none", borderRadius: 6,
                color: tab === st.id ? T.t1 : T.t2,
                fontSize: 14, fontWeight: tab === st.id ? 600 : 400,
                cursor: "pointer", fontFamily: F.sans, textAlign: "left", transition: "all .1s",
                borderLeft: tab === st.id ? `2px solid ${T.accent}` : "2px solid transparent"
              }}
              onMouseEnter={e => tab !== st.id && (e.currentTarget.style.background = T.hover)}
              onMouseLeave={e => tab !== st.id && (e.currentTarget.style.background = "none")}>
              <span style={{ display: "flex", color: tab === st.id ? T.t1 : T.t3 }}>{st.icon}</span>
              {st.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, paddingBottom: 16, marginBottom: 20, borderBottom: `1px solid ${T.border}`, color: T.t1, fontSize: 20, fontWeight: 600 }}>
            {settingsTabs.find(s => s.id === tab)?.label}
          </h2>

          {tab === "general" && (
            <div style={{ maxWidth: 520 }}>
              <Field label="Organisation Name" T={T}><Input T={T} defaultValue="EcoOS Global" /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Timezone" T={T}><Select T={T} style={{ width: "100%" }}>{["Australia/Sydney", "UTC", "America/New_York", "Europe/London"].map(z => <option key={z}>{z}</option>)}</Select></Field>
                <Field label="Currency" T={T}><Select T={T} style={{ width: "100%" }}>{["USD", "AUD", "EUR", "GBP"].map(c => <option key={c}>{c}</option>)}</Select></Field>
              </div>
              <Field label="Default Language" T={T}><Select T={T} style={{ width: "100%" }}><option>English (AU)</option><option>English (US)</option></Select></Field>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Btn T={T} variant="primary" onClick={save}>{saved ? "✓ Saved" : "Save Changes"}</Btn>
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div style={{ maxWidth: 520 }}>
              <div style={{ color: T.t1, fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Theme mode</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(THEMES).map(([k, th]) => (
                  <button key={k} onClick={() => setTheme(k)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: themeKey === k ? T.accentBg : T.raised, border: `1px solid ${themeKey === k ? T.accentBorder : T.border}`, borderRadius: 8, cursor: "pointer", fontFamily: F.sans, textAlign: "left", transition: "all .12s" }}
                    onMouseEnter={e => themeKey !== k && (e.currentTarget.style.background = T.hover)}
                    onMouseLeave={e => themeKey !== k && (e.currentTarget.style.background = T.raised)}>
                    {th.icon === "sun" ? <Sun size={18} color={T.amber} /> : th.icon === "moon" ? <Moon size={18} color={T.accent} /> : <Palette size={18} color={T.purple} />}
                    <span style={{ color: T.t1, fontSize: 14, fontWeight: themeKey === k ? 600 : 500 }}>{th.name}</span>
                    {themeKey === k && <span style={{ color: T.accent, marginLeft: "auto", fontSize: 12, fontWeight: 600 }}>Active</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "ai" && (
            <div style={{ maxWidth: 520 }}>
              <Field label="OpenAI API Key" T={T} hint="Stored in browser. Required for live agent responses.">
                <Input T={T} type="password" value={openAIKey} onChange={e => setOpenAIKey(e.target.value)} placeholder="sk-..." />
              </Field>
              <Field label="Default Model" T={T}>
                <Select T={T} style={{ width: "100%" }}>{["gpt-4o", "gpt-4o-mini", "claude-3.5-sonnet", "claude-3-haiku"].map(m => <option key={m}>{m}</option>)}</Select>
              </Field>
              <Field label="LangSmith Project" T={T}><Input T={T} defaultValue="ecoos-production" /></Field>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Btn T={T} variant="primary" onClick={save}>{saved ? "✓ Saved" : "Save"}</Btn>
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
                <div style={{ color: T.t1, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Deployed Agents</div>
                {DB.agents.map(ag => (
                  <div key={ag.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                    <Dot status={ag.status} T={T} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: T.t1, fontSize: 13, fontWeight: 500 }}>{ag.name}</div>
                      <div style={{ color: T.t3, fontSize: 11 }}>{ag.model}</div>
                    </div>
                    <Badge T={T} color={{ online: T.green, idle: T.amber, paused: T.t3 }[ag.status]}>{ag.status}</Badge>
                    <Btn T={T} small variant="default">Config</Btn>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div style={{ maxWidth: 520 }}>
              {[
                { k: "critical", label: "Critical alerts", sub: "System outages, security incidents" },
                { k: "warning", label: "Warnings", sub: "Degraded services, approaching limits" },
                { k: "billing", label: "Billing", sub: "Invoice due, quota approaching" },
                { k: "digest", label: "Weekly digest", sub: "Summary email every Monday" },
                { k: "deployments", label: "Deployments", sub: "Production deployment events" },
              ].map(item => (
                <div key={item.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div>
                    <div style={{ color: T.t1, fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                    <div style={{ color: T.t3, fontSize: 12, marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <Toggle T={T} on={toggles[item.k]} onChange={v => setToggles(p => ({ ...p, [item.k]: v }))} />
                </div>
              ))}
            </div>
          )}

          {tab === "security" && (
            <div style={{ maxWidth: 520 }}>
              {[["Two-Factor Auth", "Enabled — TOTP", T.green], ["Single Sign-On", "Google Workspace", T.green], ["Session Timeout", "30 minutes", null], ["Audit Log Retention", "90 days", null], ["IP Allowlist", "3 ranges configured", null]].map(([l, v, c]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                  <span style={{ color: T.t2 }}>{l}</span>
                  {c ? <Badge T={T} color={c}>{v}</Badge> : <span style={{ color: T.t1, fontWeight: 500 }}>{v}</span>}
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <div style={{ color: T.t1, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>API Keys</div>
                {[{ name: "Production", key: "eco_prod_••••a4f2", active: true }, { name: "CI/CD", key: "eco_ci_••••b8e1", active: true }, { name: "Test", key: "eco_test_••••f1a0", active: false }].map(k => (
                  <div key={k.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: T.t1, fontSize: 13, fontWeight: 500 }}>{k.name}</div>
                      <div style={{ color: T.t3, fontSize: 11, fontFamily: F.mono }}>{k.key}</div>
                    </div>
                    <Badge T={T} color={k.active ? T.green : T.red}>{k.active ? "active" : "revoked"}</Badge>
                    <Btn T={T} small variant="default">Copy</Btn>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "billing" && (
            <div style={{ maxWidth: 560 }}>
              <Surface T={T} style={{ padding: "18px 20px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div><div style={{ color: T.t1, fontSize: 15, fontWeight: 600 }}>Starter</div><div style={{ color: T.t3, fontSize: 13 }}>Free plan · Resets monthly</div></div>
                  <Btn T={T} variant="primary" onClick={() => setUpgradeModal(true)}>Upgrade plan</Btn>
                </div>
                {[["API Calls", "8,420/10,000", 84], ["Users", "4/5", 80], ["AI Agents", "2/2", 100], ["Storage", "2.4 GB/5 GB", 48]].map(([l, v, p]) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: T.t2, fontSize: 12 }}>{l}</span>
                      <span style={{ color: T.t1, fontSize: 12, fontWeight: 600, fontFamily: F.mono }}>{v}</span>
                    </div>
                    <Progress value={p} color={p > 90 ? T.red : p > 75 ? T.amber : T.green} T={T} />
                  </div>
                ))}
              </Surface>
              <Surface T={T} style={{ overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, color: T.t1, fontSize: 14, fontWeight: 600, background: T.raised }}>Invoices</div>
                {[["Apr 2026", "$0.00", "paid"], ["Mar 2026", "$0.00", "paid"]].map(([d, a, s]) => (
                  <div key={d} style={{ padding: "10px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                    <span style={{ color: T.t2 }}>{d}</span>
                    <span style={{ color: T.t1, fontFamily: F.mono }}>{a}</span>
                    <Badge T={T} color={T.green}>{s}</Badge>
                    <Btn T={T} small variant="default">Download</Btn>
                  </div>
                ))}
              </Surface>
            </div>
          )}

          {tab === "team" && (
            <div style={{ maxWidth: 520 }}>
              {DB.people.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <Avi name={p.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: T.accent, fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ color: T.t3, fontSize: 12 }}>{p.role} · {p.dept}</div>
                  </div>
                  <Dot status={p.status} T={T} />
                  <Btn T={T} small variant="default">Edit</Btn>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal T={T} open={upgradeModal} onClose={() => setUpgradeModal(false)} title="Choose a Plan" width={640}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 14 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ border: `1px solid ${plan.highlight ? T.accent : T.border}`, borderRadius: 8, padding: "18px 16px", position: "relative", background: plan.highlight ? T.accentBg : T.raised }}>
              {plan.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: T.accent, color: "#fff", borderRadius: 99, padding: "2px 12px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Most Popular</div>}
              <div style={{ color: T.t1, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ color: T.accent, fontSize: 22, fontWeight: 700, marginBottom: 14 }}>{plan.price}</div>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                  <span style={{ color: T.green, fontSize: 13, flexShrink: 0 }}>✓</span>
                  <span style={{ color: T.t2, fontSize: 12 }}>{f}</span>
                </div>
              ))}
              <Btn T={T} full variant={plan.current ? "default" : plan.highlight ? "primary" : "default"} style={{ marginTop: 14 }}>
                {plan.current ? "Current Plan" : plan.cta || "Upgrade"}
              </Btn>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}