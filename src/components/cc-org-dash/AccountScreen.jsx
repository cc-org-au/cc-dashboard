import { useState } from "react";
import { Surface, Btn, Badge, Toggle, Modal, Field, Input, Select, F } from "./primitives";
import { CheckCircle2, ArrowUp, Plus, CircleDot, GitBranch, LogIn } from "./icons";

export default function AccountScreen({ T, setTab, isMobile }) {
  const [editOpen, setEditOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const statItems = [
    { label: "Tasks completed", value: "284", color: T.green },
    { label: "Projects led", value: "12", color: T.accent },
    { label: "AI interactions", value: "1,840", color: T.purple },
    { label: "Days active", value: "94", color: T.amber },
  ];

  const timeline = [
    { when: "Just now", event: "Logged in from Sydney, AU", icon: <LogIn size={12} />, color: T.t3 },
    { when: "2h ago", event: "Approved ISO audit control #47", icon: <CheckCircle2 size={12} />, color: T.green },
    { when: "Yesterday", event: "Upgraded DataOracle to claude-3.5", icon: <ArrowUp size={12} />, color: T.accent },
    { when: "Mon", event: "Invited Priya Sharma to Engineering", icon: <Plus size={12} />, color: T.purple },
    { when: "Sat", event: "Created project: EMEA Expansion", icon: <GitBranch size={12} />, color: T.amber },
    { when: "Apr 10", event: "Account created", icon: <CircleDot size={12} />, color: T.green },
  ];

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "security", label: "Security" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero card */}
      <Surface T={T} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ height: 80, background: `linear-gradient(120deg,${T.accent}28,${T.accentBorder})` }} />
        <div style={{ padding: "0 28px 24px", marginTop: -40 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.accent, border: `4px solid ${T.surface}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 30, fontWeight: 700, boxShadow: T.shadowMd, fontFamily: F.sans }}>E</div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ color: T.t1, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>EcoAdmin</div>
                <div style={{ color: T.t2, fontSize: 14 }}>ccdashadmin · admin@cc-org-dash.io</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <Badge T={T} color={T.green}>Active</Badge>
                  <Badge T={T}>Administrator</Badge>
                  <Badge T={T} color={T.purple}>AI Access</Badge>
                </div>
              </div>
            </div>
            <Btn T={T} variant="default" onClick={() => setEditOpen(true)}>Edit profile</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10, marginTop: 20 }}>
            {statItems.map(s => (
              <div key={s.label} style={{ textAlign: "center", padding: "13px", background: T.raised, borderRadius: 8, border: `1px solid ${T.border}` }}>
                <div style={{ color: s.color, fontSize: 21, fontWeight: 700, fontVariantNumeric: "tabular-nums", fontFamily: F.sans }}>{s.value}</div>
                <div style={{ color: T.t3, fontSize: 11, marginTop: 3, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Surface>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "192px 1fr 268px", gap: 14, alignItems: "start" }}>
        <Surface T={T} style={{ padding: 0, overflow: "hidden" }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                width: "100%", padding: "11px 16px", background: "none", border: "none",
                borderLeft: activeSection === s.id ? `3px solid ${T.accent}` : "3px solid transparent",
                color: activeSection === s.id ? T.t1 : T.t2,
                fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
                cursor: "pointer", fontFamily: F.sans, textAlign: "left", transition: "all .12s",
                borderBottom: `1px solid ${T.border}`
              }}
              onMouseEnter={e => activeSection !== s.id && (e.currentTarget.style.background = T.hover)}
              onMouseLeave={e => activeSection !== s.id && (e.currentTarget.style.background = "none")}>
              {s.label}
            </button>
          ))}
          <div style={{ padding: "14px 16px" }}>
            <div style={{ color: T.t2, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Quick Links</div>
            {[["Notifications", "inbox"], ["API Keys", "settings"], ["Team", "people"]].map(([l, t]) => (
              <button key={l} onClick={() => setTab(t)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 0", background: "none", border: "none", color: T.accent, fontSize: 13, cursor: "pointer", fontFamily: F.sans }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                {l} →
              </button>
            ))}
          </div>
        </Surface>

        <Surface T={T} style={{ padding: "20px 24px", minHeight: 340 }}>
          {activeSection === "overview" && (
            <div>
              <div style={{ color: T.t1, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Profile Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {[["Full name", "EcoAdmin"], ["Email", "admin@cc-org-dash.io"], ["Role", "Administrator"], ["Organisation", "cc-org-dash Global"], ["Timezone", "Australia/Sydney"], ["Member since", "Jan 15, 2026"]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color: T.t2, fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{k}</div>
                    <div style={{ color: T.t1, fontSize: 13, fontWeight: 400 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                <div style={{ color: T.t1, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Connected Accounts</div>
                {[["Google Workspace", "Connected", "🔵"], ["GitHub", "Connected", "🐙"], ["Slack", "Not connected", "💬"]].map(([name, status, icon]) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 17 }}>{icon}</span>
                    <span style={{ color: T.t1, fontSize: 13, flex: 1 }}>{name}</span>
                    <Badge T={T} color={status === "Connected" ? T.green : T.t3}>{status}</Badge>
                    <Btn T={T} small variant="default">{status === "Connected" ? "Disconnect" : "Connect"}</Btn>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === "security" && (
            <div>
              <div style={{ color: T.t1, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Security</div>
              {[{ label: "Two-Factor Authentication", sub: "Enabled via TOTP app", on: true }, { label: "Login notifications", sub: "Email on new device sign-in", on: true }, { label: "API key expiry alerts", sub: "Alert 7 days before expiry", on: false }].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div>
                    <div style={{ color: T.t1, fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                    <div style={{ color: T.t3, fontSize: 12, marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <Toggle T={T} on={item.on} onChange={() => { }} />
                </div>
              ))}
              <div style={{ marginTop: 14 }}><Btn T={T} variant="default">Change Password</Btn></div>
            </div>
          )}
          {activeSection === "preferences" && (
            <div>
              <div style={{ color: T.t1, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Preferences</div>
              <Field label="Language" T={T}><Select T={T} style={{ width: "100%" }}><option>English (AU)</option><option>English (US)</option></Select></Field>
              <Field label="Date format" T={T}><Select T={T} style={{ width: "100%" }}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></Select></Field>
              <Field label="Default landing tab" T={T}><Select T={T} style={{ width: "100%" }}><option>Home</option><option>Work</option><option>Inbox</option></Select></Field>
            </div>
          )}
        </Surface>

        <Surface T={T} style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: T.raised }}>
            <div style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>Activity Timeline</div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {timeline.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "9px 16px", position: "relative" }}>
                {i < timeline.length - 1 && <div style={{ position: "absolute", left: 22, top: 28, bottom: -2, width: 1, background: T.border }} />}
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0, zIndex: 1 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.t1, fontSize: 12, lineHeight: 1.4 }}>{item.event}</div>
                  <div style={{ color: T.t4, fontSize: 10, marginTop: 2 }}>{item.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Modal T={T} open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <Field label="Display name" T={T}><Input T={T} defaultValue="EcoAdmin" /></Field>
        <Field label="Email" T={T}><Input T={T} defaultValue="admin@cc-org-dash.io" type="email" /></Field>
        <Field label="Role / title" T={T}><Input T={T} defaultValue="Administrator" /></Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn T={T} variant="default" onClick={() => setEditOpen(false)}>Cancel</Btn>
          <Btn T={T} variant="primary" onClick={() => setEditOpen(false)}>Save Changes</Btn>
        </div>
      </Modal>
    </div>
  );
}