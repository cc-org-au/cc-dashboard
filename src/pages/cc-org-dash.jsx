// cc-org-dash — GitHub-inspired Business Command Center
import { useState, useEffect } from "react";
import { THEMES, Avi, F } from "../components/cc-org-dash/primitives";
import { DB } from "../components/cc-org-dash/data";
import HomeScreen from "../components/cc-org-dash/HomeScreen";
import WorkScreen from "../components/cc-org-dash/WorkScreen";
import InboxScreen from "../components/cc-org-dash/InboxScreen";
import PeopleScreen from "../components/cc-org-dash/PeopleScreen";
import DataScreen from "../components/cc-org-dash/DataScreen";
import FilesScreen from "../components/cc-org-dash/FilesScreen";
import IntegrationsScreen from "../components/cc-org-dash/IntegrationsScreen";
import SettingsScreen from "../components/cc-org-dash/SettingsScreen";
import AccountScreen from "../components/cc-org-dash/AccountScreen";
import NotifDrawer from "../components/cc-org-dash/NotifDrawer";
import useIsMobile from "../components/cc-org-dash/useIsMobile";
import {
  Home, Briefcase, Inbox, Users, BarChart3, FolderOpen, Plug, SettingsIcon,
  Search, Bell, Plus, ChevronDown, User, LogOut, GitBranch
} from "../components/cc-org-dash/icons";

const TABS = [
  { id: "home",         label: "Dashboard",     icon: <Home size={16} /> },
  { id: "work",         label: "Work",          icon: <Briefcase size={16} /> },
  { id: "inbox",        label: "Inbox",         icon: <Inbox size={16} /> },
  { id: "people",       label: "People",        icon: <Users size={16} /> },
  { id: "data",         label: "Data",          icon: <BarChart3 size={16} /> },
  { id: "files",        label: "Files",         icon: <FolderOpen size={16} /> },
  { id: "integrations", label: "Integrations",  icon: <Plug size={16} /> },
  { id: "settings",     label: "Settings",      icon: <SettingsIcon size={16} /> },
];

const THEME_KEY = "cc-org-dash-theme";
const THEME_KEY_LEGACY = "ecoos_theme";

function readStoredTheme() {
  try {
    return (
      localStorage.getItem(THEME_KEY) ||
      localStorage.getItem(THEME_KEY_LEGACY) ||
      "light"
    );
  } catch {
    return "light";
  }
}

export default function CcOrgDash() {
  const [themeKey, setThemeKey] = useState(readStoredTheme);
  const T = THEMES[themeKey] || THEMES.light;
  const setTheme = (k) => {
    try {
      localStorage.setItem(THEME_KEY, k);
      localStorage.removeItem(THEME_KEY_LEGACY);
    } catch {
      /* quota / private mode */
    }
    setThemeKey(k);
  };

  const [tab, setTab] = useState("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const h = e => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(p => !p); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const unread = DB.notifications.filter(n => !n.read).length;
  const close = () => { setProfileOpen(false); setCreateOpen(false); };

  const cmdResults = [
    ...TABS.map(t => ({ label: `Go to ${t.label}`, cat: "Jump to", action: () => { setTab(t.id); setCmdOpen(false); } })),
    { label: "Open Notifications", cat: "Actions", action: () => { setNotifOpen(true); setCmdOpen(false); } },
    { label: "Change Theme", cat: "Actions", action: () => { setTab("settings"); setCmdOpen(false); } },
    { label: "My Account", cat: "Actions", action: () => { setTab("account"); setCmdOpen(false); } },
    ...DB.agents.map(a => ({ label: `Chat with ${a.name}`, cat: "Agents", action: () => { setTab("inbox"); setCmdOpen(false); } })),
  ].filter(r => !cmdQuery || r.label.toLowerCase().includes(cmdQuery.toLowerCase()));
  const grouped = cmdResults.reduce((acc, r) => { (acc[r.cat] = acc[r.cat] || []).push(r); return acc; }, {});

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.canvas, fontFamily: F.sans, color: T.t1 }} onClick={close}>

      {/* GitHub-style top nav */}
      <div style={{ background: T.nav, borderBottom: `1px solid ${T.border}`, color: T.t1, flexShrink: 0 }}>
        <div style={{ height: isMobile ? 52 : 60, display: "flex", alignItems: "center", padding: isMobile ? "0 10px" : "0 16px", gap: isMobile ? 8 : 16 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 7 : 10, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? 26 : 30, height: isMobile ? 26 : 30, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, boxShadow: T.shadowMd }}>
              <svg width={isMobile ? 15 : 18} height={isMobile ? 15 : 18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <span style={{ color: T.t1, fontSize: isMobile ? 13 : 15, fontWeight: 700, letterSpacing: "-0.01em", fontFamily: F.mono }}>cc-org-dash</span>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 400, minWidth: 0 }}>
            <button onClick={e => { e.stopPropagation(); setCmdOpen(true); setCmdQuery(""); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: T.raised, border: `1px solid ${T.border}`, borderRadius: 6, cursor: "pointer", color: T.t3, fontSize: 13, transition: "all .15s", fontFamily: F.sans }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
              <Search size={14} />
              <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{isMobile ? "Search" : "Type / to search"}</span>
              {!isMobile && <kbd style={{ color: T.t3, fontSize: 11, fontFamily: F.mono, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 5px", background: T.surface }}>⌘K</kbd>}
            </button>
          </div>

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {/* Create menu */}
            <div style={{ position: "relative" }}>
              <button onClick={e => { e.stopPropagation(); setCreateOpen(p => !p); }}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 8px", background: "none", border: "none", cursor: "pointer", color: T.t2, borderRadius: 6, transition: "all .12s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.hover}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                <Plus size={16} />
                {!isMobile && <ChevronDown size={12} />}
              </button>
              {createOpen && (
                <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, width: 180, zIndex: 200, boxShadow: T.shadowLg, overflow: "hidden" }}>
                  {[
                    { l: "New project",     a: () => { setTab("work"); setCreateOpen(false); } },
                    { l: "New issue",       a: () => { setTab("work"); setCreateOpen(false); } },
                    { l: "New workflow",    a: () => { setTab("work"); setCreateOpen(false); } },
                    { l: "New team",        a: () => { setTab("people"); setCreateOpen(false); } },
                    { l: "Invite member",   a: () => { setTab("people"); setCreateOpen(false); } },
                    { l: "Upload file",     a: () => { setTab("files"); setCreateOpen(false); } },
                  ].map(item => (
                    <button key={item.l} onClick={item.a} style={{ width: "100%", background: "none", border: "none", padding: "8px 14px", textAlign: "left", fontSize: 13, color: T.t1, cursor: "pointer", fontFamily: F.sans, transition: "background .12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hover}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>{item.l}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button onClick={e => { e.stopPropagation(); setNotifOpen(p => !p); }}
              style={{ position: "relative", padding: "6px", background: "none", border: "none", cursor: "pointer", color: T.t2, borderRadius: 6, display: "flex", transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.hover}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Bell size={18} />
              {unread > 0 && <span style={{ position: "absolute", top: 3, right: 3, width: 8, height: 8, borderRadius: "50%", background: T.accent, border: `2px solid ${T.nav}` }} />}
            </button>

            {/* Profile dropdown */}
            <div style={{ position: "relative" }}>
              <button onClick={e => { e.stopPropagation(); setProfileOpen(p => !p); }}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", transition: "all .15s" }}>
                <Avi name="EcoAdmin" size={26} />
              </button>
              {profileOpen && (
                <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, width: 220, zIndex: 200, boxShadow: T.shadowLg, overflow: "hidden" }}>
                  <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ color: T.t1, fontSize: 13 }}>Signed in as</div>
                    <div style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>EcoAdmin</div>
                  </div>
                  {[
                    { l: "Your profile",   icon: <User size={15} />, a: () => { setTab("account"); setProfileOpen(false); } },
                    { l: "Your projects",  icon: <GitBranch size={15} />, a: () => { setTab("work"); setProfileOpen(false); } },
                    { l: "Settings",       icon: <SettingsIcon size={15} />, a: () => { setTab("settings"); setProfileOpen(false); } },
                  ].map(item => (
                    <button key={item.l} onClick={item.a} style={{ width: "100%", background: "none", border: "none", padding: "8px 14px", textAlign: "left", fontSize: 13, color: T.t1, cursor: "pointer", fontFamily: F.sans, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hover}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <span style={{ color: T.t3, display: "flex" }}>{item.icon}</span>{item.l}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${T.border}` }}>
                    <button style={{ width: "100%", background: "none", border: "none", padding: "8px 14px", textAlign: "left", fontSize: 13, color: T.t1, cursor: "pointer", fontFamily: F.sans, display: "flex", alignItems: "center", gap: 10 }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hover}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <LogOut size={15} color={T.t3} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub-style primary tab strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, padding: isMobile ? "0 6px" : "0 16px", overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={e => { e.stopPropagation(); setTab(t.id); }}
                style={{
                  padding: isMobile ? "8px 10px" : "8px 12px",
                  display: "flex", alignItems: "center", gap: isMobile ? 5 : 8,
                  background: "transparent",
                  border: "none",
                  borderBottom: active ? `2px solid ${T.amber}` : "2px solid transparent",
                  marginBottom: -1,
                  color: active ? T.t1 : T.t2,
                  fontSize: isMobile ? 13 : 14,
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: F.sans,
                  transition: "all .12s",
                  whiteSpace: "nowrap",
                  position: "relative",
                  flexShrink: 0
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = T.t1; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = T.t2; }}>
                <span style={{ display: "flex", color: active ? T.t2 : T.t3 }}>{t.icon}</span>
                {(!isMobile || active) && t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: isMobile ? "16px 12px" : "24px 28px", maxWidth: 1280, width: "100%", margin: "0 auto", boxSizing: "border-box" }} onClick={close}>
        {tab === "home"         && <HomeScreen T={T} isMobile={isMobile} />}
        {tab === "work"         && <WorkScreen T={T} isMobile={isMobile} />}
        {tab === "inbox"        && <InboxScreen T={T} isMobile={isMobile} />}
        {tab === "people"       && <PeopleScreen T={T} isMobile={isMobile} />}
        {tab === "data"         && <DataScreen T={T} isMobile={isMobile} />}
        {tab === "files"        && <FilesScreen T={T} isMobile={isMobile} />}
        {tab === "integrations" && <IntegrationsScreen T={T} isMobile={isMobile} />}
        {tab === "settings"     && <SettingsScreen T={T} themeKey={themeKey} setTheme={setTheme} isMobile={isMobile} />}
        {tab === "account"      && <AccountScreen T={T} setTab={setTab} isMobile={isMobile} />}
      </div>

      {notifOpen && <NotifDrawer T={T} onClose={() => setNotifOpen(false)} />}

      {cmdOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 400, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh" }}
          onClick={() => setCmdOpen(false)}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, width: isMobile ? "92vw" : 520, maxWidth: 520, maxHeight: 400, overflow: "auto", boxShadow: T.shadowLg }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
              <Search size={15} color={T.t3} />
              <input autoFocus value={cmdQuery} onChange={e => setCmdQuery(e.target.value)}
                placeholder="Jump to a page, search agents, actions..." style={{ flex: 1, background: "none", border: "none", color: T.t1, fontSize: 14, outline: "none", fontFamily: F.sans }} />
              <kbd style={{ color: T.t3, fontSize: 11, fontFamily: F.mono, border: `1px solid ${T.border}`, borderRadius: 3, padding: "2px 6px", background: T.raised }}>ESC</kbd>
            </div>
            <div>
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <div style={{ padding: "8px 16px 4px", color: T.t3, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cat}</div>
                  {items.map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: F.sans, textAlign: "left", transition: "background .1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hover}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <span style={{ color: T.t1, fontSize: 13 }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
              {cmdResults.length === 0 && <div style={{ padding: "24px 16px", textAlign: "center", color: T.t3, fontSize: 13 }}>No results found</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}