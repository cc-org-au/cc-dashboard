// GitHub-inspired design tokens and primitives
import { useState } from "react";

export const F = {
  sans: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif",
  mono: "'JetBrains Mono',ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace"
};

// GitHub-inspired themes
export const THEMES = {
  light: {
    name: "Light", icon: "sun",
    bg: "#ffffff", canvas: "#f6f8fa", surface: "#ffffff", raised: "#f6f8fa", hover: "#f3f4f6",
    border: "#d1d9e0", borderMuted: "#d1d9e0bb", borderHover: "#afb8c1",
    t1: "#1f2328", t2: "#59636e", t3: "#6e7781", t4: "#9198a1",
    accent: "#0969da", accentBg: "#ddf4ff", accentBorder: "#54aeff66", accentHover: "#0550ae",
    green: "#1a7f37", greenBg: "#dafbe1", greenBorder: "#74c790",
    red: "#d1242f", redBg: "#ffebe9", redBorder: "#ffaba8",
    amber: "#9a6700", amberBg: "#fff8c5", amberBorder: "#eac54f",
    purple: "#8250df", purpleBg: "#fbefff", purpleBorder: "#c297ff",
    nav: "#ffffff", navText: "#59636e", navActive: "#1f2328", navHover: "#f6f8fa",
    btnPrimary: "#1f883d", btnPrimaryHover: "#1a7f37",
    shadow: "0 1px 0 rgba(31,35,40,0.04)",
    shadowMd: "0 3px 6px rgba(140,149,159,0.15)",
    shadowLg: "0 8px 24px rgba(140,149,159,0.2)",
  },
  dark: {
    name: "Dark", icon: "moon",
    bg: "#0d1117", canvas: "#010409", surface: "#0d1117", raised: "#151b23", hover: "#262c36",
    border: "#3d444d", borderMuted: "#3d444db3", borderHover: "#656c76",
    t1: "#f0f6fc", t2: "#9198a1", t3: "#7d8590", t4: "#6e7681",
    accent: "#4493f8", accentBg: "#121d2f", accentBorder: "#4493f866", accentHover: "#79c0ff",
    green: "#3fb950", greenBg: "#0f2d1e", greenBorder: "#2ea043",
    red: "#f85149", redBg: "#25181c", redBorder: "#da3633",
    amber: "#d29922", amberBg: "#2d2611", amberBorder: "#bf8700",
    purple: "#a371f7", purpleBg: "#211a36", purpleBorder: "#8957e5",
    nav: "#0d1117", navText: "#9198a1", navActive: "#f0f6fc", navHover: "#151b23",
    btnPrimary: "#238636", btnPrimaryHover: "#2ea043",
    shadow: "0 0 transparent",
    shadowMd: "0 3px 6px rgba(1,4,9,0.4)",
    shadowLg: "0 8px 24px rgba(1,4,9,0.6)",
  },
  dimmed: {
    name: "Dimmed", icon: "palette",
    bg: "#22272e", canvas: "#1c2128", surface: "#22272e", raised: "#2d333b", hover: "#373e47",
    border: "#444c56", borderMuted: "#444c56b3", borderHover: "#616871",
    t1: "#cdd9e5", t2: "#909dab", t3: "#768390", t4: "#636e7b",
    accent: "#539bf5", accentBg: "#1c2e4a", accentBorder: "#539bf566", accentHover: "#6cb6ff",
    green: "#57ab5a", greenBg: "#113417", greenBorder: "#46954a",
    red: "#e5534b", redBg: "#3c1a1a", redBorder: "#c93c37",
    amber: "#c69026", amberBg: "#341a1b", amberBorder: "#ae7c14",
    purple: "#986ee2", purpleBg: "#271e3e", purpleBorder: "#8256d0",
    nav: "#22272e", navText: "#909dab", navActive: "#cdd9e5", navHover: "#2d333b",
    btnPrimary: "#347d39", btnPrimaryHover: "#46954a",
    shadow: "0 0 transparent",
    shadowMd: "0 3px 6px rgba(1,4,9,0.4)",
    shadowLg: "0 8px 24px rgba(1,4,9,0.6)",
  },
};

// GitHub-style Box (card)
export function Surface({ children, T, style: ex = {}, onClick, hoverable }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hoverable && setHov(true)}
      onMouseLeave={() => hoverable && setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        boxShadow: hov ? T.shadowMd : "none",
        transition: "all 0.15s",
        cursor: onClick ? "pointer" : "default",
        ...ex
      }}>
      {children}
    </div>
  );
}

// GitHub-style button — primary green, outlined default, danger red
export function Btn({ children, onClick, variant = "default", small, disabled, T, full, style: ex = {} }) {
  const [hov, setHov] = useState(false);
  const v = {
    primary: { bg: T.btnPrimary, hbg: T.btnPrimaryHover, color: "#fff", border: `1px solid rgba(31,35,40,0.15)` },
    default: { bg: T.raised, hbg: T.hover, color: T.t1, border: `1px solid ${T.border}` },
    ghost:   { bg: "transparent", hbg: T.hover, color: T.t2, border: "1px solid transparent" },
    outline: { bg: "transparent", hbg: T.hover, color: T.t1, border: `1px solid ${T.border}` },
    accent:  { bg: T.accent, hbg: T.accentHover, color: "#fff", border: `1px solid rgba(31,35,40,0.15)` },
    danger:  { bg: T.raised, hbg: T.redBg, color: T.red, border: `1px solid ${T.border}` },
    success: { bg: T.greenBg, hbg: `${T.green}22`, color: T.green, border: `1px solid ${T.greenBorder}` },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? v.hbg : v.bg, color: v.color, border: v.border,
        borderRadius: 6,
        padding: small ? "3px 10px" : "5px 14px",
        fontSize: small ? 12 : 13,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: F.sans,
        display: "inline-flex", alignItems: "center", gap: 6,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.12s",
        whiteSpace: "nowrap",
        width: full ? "100%" : undefined,
        justifyContent: full ? "center" : undefined,
        lineHeight: 1.4,
        ...ex
      }}>
      {children}
    </button>
  );
}

// GitHub-style Label (pill badge)
export function Badge({ children, color, bg, T, variant = "default" }) {
  const styles = {
    default: { bg: T.raised, color: T.t2, border: T.border },
    colored: { bg: bg || `${color || T.accent}22`, color: color || T.accent, border: `${color || T.accent}44` },
  };
  const s = color ? styles.colored : styles.default;
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 999,
      padding: "0 7px",
      fontSize: 12,
      fontWeight: 500,
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      lineHeight: "18px",
      height: 20
    }}>
      {children}
    </span>
  );
}

// Status dot
export function Dot({ status, T, size = 8 }) {
  const c = {
    online: T.green, active: T.green, connected: T.green, on_track: T.green, done: T.green,
    idle: T.amber, away: T.amber, degraded: T.amber, at_risk: T.amber, review: T.amber,
    planning: T.t3, paused: T.t3, todo: T.t3,
    in_progress: T.accent,
    disconnected: T.red, error: T.red
  }[status] || T.t3;
  return <span style={{ width: size, height: size, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />;
}

export function Avi({ name, size = 28 }) {
  const ini = (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const palette = ["#0969da", "#1a7f37", "#8250df", "#9a6700", "#d1242f", "#bf3989", "#0550ae"];
  const c = palette[(name || "X").charCodeAt(0) % palette.length];
  return <div style={{
    width: size, height: size, borderRadius: "50%", background: c, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
    fontFamily: F.sans
  }}>{ini}</div>;
}

export function Toggle({ on, onChange, T }) {
  return (
    <div onClick={() => onChange?.(!on)} style={{
      width: 32, height: 18, borderRadius: 99,
      background: on ? T.btnPrimary : T.border,
      cursor: "pointer", position: "relative",
      transition: "background 0.15s", flexShrink: 0
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2, left: on ? 16 : 2,
        transition: "left 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,.2)"
      }} />
    </div>
  );
}

export function Input({ T, value, onChange, placeholder, type = "text", style: ex = {}, icon, onKeyDown, autoFocus, defaultValue }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {icon && <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: T.t3, display: "flex", pointerEvents: "none" }}>{icon}</span>}
      <input type={type} value={value} defaultValue={defaultValue} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} autoFocus={autoFocus}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          background: T.surface,
          border: `1px solid ${focus ? T.accent : T.border}`,
          boxShadow: focus ? `0 0 0 3px ${T.accentBg}` : "none",
          borderRadius: 6, color: T.t1,
          padding: icon ? "5px 12px 5px 30px" : "5px 12px",
          fontSize: 14, outline: "none", fontFamily: F.sans,
          width: "100%", boxSizing: "border-box",
          transition: "all .15s",
          ...ex
        }} />
    </div>
  );
}

export function Select({ T, value, onChange, children, style: ex = {}, defaultValue }) {
  return (
    <select value={value} defaultValue={defaultValue} onChange={onChange}
      style={{
        background: T.raised, border: `1px solid ${T.border}`,
        borderRadius: 6, color: T.t1,
        padding: "5px 28px 5px 12px",
        fontSize: 14, outline: "none", fontFamily: F.sans,
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16' fill='${encodeURIComponent(T.t3)}'%3E%3Cpath d='M4.427 9.427l3.396 3.396a.251.251 0 00.354 0l3.396-3.396A.25.25 0 0011.396 9H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
        cursor: "pointer",
        ...ex
      }}>
      {children}
    </select>
  );
}

export function Progress({ value, color, T }) {
  return (
    <div style={{ background: T.raised, borderRadius: 99, height: 6, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <div style={{
        width: `${Math.min(100, value)}%`, height: "100%",
        background: color || T.accent,
        transition: "width 0.8s ease"
      }} />
    </div>
  );
}

export function Sparkline({ data, color, height = 28, width = 80 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / r) * height}`).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible", flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`${color}18`} stroke="none" />
    </svg>
  );
}

// GitHub-style table
export function Table({ cols, rows, T, onRow, emptyMsg = "No data" }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={{
                padding: "8px 16px", textAlign: "left",
                fontSize: 12, fontWeight: 600, color: T.t2,
                borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                background: T.raised
              }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={cols.length} style={{ padding: 40, textAlign: "center", color: T.t3, fontSize: 13 }}>{emptyMsg}</td></tr>
          )}
          {rows.map((row, i) => (
            <tr key={row.id || i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onClick={() => onRow?.(row)}
              style={{ background: hov === i ? T.raised : "transparent", cursor: onRow ? "pointer" : "default", transition: "background 0.1s" }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: "10px 16px", fontSize: 13, color: c.muted ? T.t2 : T.t1, borderBottom: `1px solid ${T.border}`, verticalAlign: "middle" }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key] ?? <span style={{ color: T.t4 }}>—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SlideOver({ open, onClose, title, subtitle, children, T, width = 420 }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const effectiveWidth = isMobile ? Math.min(window.innerWidth - 32, width) : width;
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200 }} />}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: effectiveWidth, maxWidth: "100vw",
        background: T.surface, borderLeft: `1px solid ${T.border}`,
        zIndex: 201, transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column", boxShadow: T.shadowLg
      }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ color: T.t1, fontSize: 16, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ color: T.t3, fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.t3, padding: 4, borderRadius: 6, display: "flex" }}
            onMouseEnter={e => e.currentTarget.style.background = T.hover}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
      </div>
    </>
  );
}

export function Modal({ open, onClose, title, children, T, width = 520 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <div style={{ background: T.surface, borderRadius: 12, width: "100%", maxWidth: width, maxHeight: "88vh", overflow: "auto", boxShadow: T.shadowLg, border: `1px solid ${T.border}` }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: T.t1, fontSize: 15, fontWeight: 600 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.t3, fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "20px 22px" }}>{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children, T, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: T.t1, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ color: T.t3, fontSize: 12, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export function SectionLabel({ children, T, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
      <span style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>{children}</span>
      {action}
    </div>
  );
}

// GitHub-style sub-nav tabs (like Code / Issues / PRs)
export function SubNav({ T, tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, paddingLeft: 4, overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              padding: "8px 14px",
              display: "flex", alignItems: "center", gap: 7,
              background: isActive ? T.surface : "transparent",
              border: "none",
              borderBottom: isActive ? `2px solid ${T.amber}` : "2px solid transparent",
              marginBottom: -1,
              color: isActive ? T.t1 : T.t2,
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              fontFamily: F.sans,
              transition: "all .12s",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = T.t1; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = T.t2; }}>
            {t.icon && <span style={{ display: "flex", color: isActive ? T.t2 : T.t3 }}>{t.icon}</span>}
            <span>{t.label}</span>
            {t.count != null && (
              <span style={{
                background: T.raised,
                border: `1px solid ${T.border}`,
                borderRadius: 999,
                padding: "0 7px",
                fontSize: 12,
                fontWeight: 500,
                color: T.t2,
                lineHeight: "18px",
                minWidth: 20,
                textAlign: "center"
              }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// GitHub-style breadcrumb page header
export function PageHeader({ T, org = "cc-org-dash-global", name, description, actions, icon }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, paddingBottom: 16, borderBottom: `1px solid ${T.border}`, marginBottom: 0 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 400, marginBottom: description ? 4 : 0 }}>
          {icon && <span style={{ color: T.t2, display: "flex" }}>{icon}</span>}
          <span style={{ color: T.accent, cursor: "pointer" }}>{org}</span>
          <span style={{ color: T.t3 }}>/</span>
          <span style={{ color: T.t1, fontWeight: 600 }}>{name}</span>
          <Badge T={T}>Private</Badge>
        </div>
        {description && <div style={{ color: T.t2, fontSize: 13 }}>{description}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}