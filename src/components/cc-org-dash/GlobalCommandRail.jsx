import { useState } from "react";
import { F } from "./primitives";
import { GLOBAL_COMMAND } from "./data";
import {
  PanelLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  CircleDot,
  Target,
  Calendar,
  AlertCircle,
  BookOpen,
  TrendingUp,
} from "./icons";

const W = { open: 264, closed: 54 };
const SW = 1.5;

function healthColor(T, h) {
  if (h === "green") return T.green;
  if (h === "amber") return T.amber;
  return T.t3;
}

export default function GlobalCommandRail({ T, isOpen, onToggle, onSelectDetail, isMobile }) {
  const [moreExec, setMoreExec] = useState(true);

  const label = (text) => (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: T.t4,
        marginTop: 14,
        marginBottom: 6,
        paddingLeft: 10,
        paddingRight: 8,
      }}
    >
      {text}
    </div>
  );

  const railW = isMobile ? "100%" : isOpen ? W.open : W.closed;

  return (
    <aside
      style={{
        width: railW,
        maxWidth: isMobile ? "100%" : undefined,
        boxSizing: "border-box",
        flexShrink: 0,
        transition: isMobile ? undefined : "width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        background: T.raised,
        border: `1px solid ${T.borderMuted ?? T.border}`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        alignSelf: "stretch",
        maxHeight: isMobile ? "min(48vh, 420px)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          padding: isOpen ? "10px 8px 10px 12px" : "12px 6px",
          borderBottom: isOpen ? `1px solid ${T.borderMuted ?? T.border}` : "none",
          flexShrink: 0,
        }}
      >
        {isOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <PanelLeft size={17} strokeWidth={SW} color={T.t2} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: T.t1, fontSize: 12, fontWeight: 700, letterSpacing: "-0.02em" }}>Company command</div>
              <div style={{ color: T.t4, fontSize: 10, fontWeight: 500, marginTop: 1 }}>Portfolio · ops · risk</div>
            </div>
          </div>
        )}
        <button
          type="button"
          title={isOpen ? "Collapse" : "Expand"}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: `1px solid ${T.borderMuted ?? T.border}`,
            background: T.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: T.t2,
            flexShrink: 0,
          }}
        >
          {isOpen ? <ChevronLeft size={18} strokeWidth={SW} /> : <ChevronRight size={18} strokeWidth={SW} />}
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            padding: "8px 8px 14px",
          }}
        >
          {label("LIVE SIGNALS")}
          <button
            type="button"
            onClick={() => onSelectDetail({ kind: "signals-feed", group: "critical" })}
            style={signalRowStyle(T, T.red)}
          >
            <Zap size={15} strokeWidth={SW} color={T.red} />
            <span style={{ flex: 1, textAlign: "left" }}>Critical</span>
            <span style={{ fontFamily: F.mono, fontSize: 12 }}>{GLOBAL_COMMAND.signals.critical.length}</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectDetail({ kind: "signals-feed", group: "attention" })}
            style={signalRowStyle(T, T.amber)}
          >
            <CircleDot size={15} strokeWidth={SW} color={T.amber} />
            <span style={{ flex: 1, textAlign: "left" }}>Attention</span>
            <span style={{ fontFamily: F.mono, fontSize: 12 }}>{GLOBAL_COMMAND.signals.attention.length}</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectDetail({ kind: "signals-feed", group: "fyi" })}
            style={signalRowStyle(T, T.t3)}
          >
            <TrendingUp size={15} strokeWidth={SW} color={T.t3} />
            <span style={{ flex: 1, textAlign: "left" }}>FYI digest</span>
            <span style={{ fontFamily: F.mono, fontSize: 12 }}>{GLOBAL_COMMAND.signals.fyiCount}</span>
          </button>

          {label("INITIATIVES")}
          {GLOBAL_COMMAND.initiatives.map((ini) => (
            <button
              key={ini.id}
              type="button"
              onClick={() => onSelectDetail({ kind: "initiative", id: ini.id })}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                marginBottom: 2,
                border: "none",
                borderRadius: 8,
                background: "transparent",
                cursor: "pointer",
                fontFamily: F.sans,
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: healthColor(T, ini.health), flexShrink: 0 }} />
              <span style={{ flex: 1, color: T.t1, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ini.title}</span>
            </button>
          ))}

          {label("OBJECTIVES & MILESTONES")}
          <button type="button" onClick={() => setMoreExec((v) => !v)} style={moreBtnStyle(T)}>
            <span style={{ color: T.t2, fontSize: 12, fontWeight: 600 }}>Execution</span>
            <ChevronDown
              size={14}
              strokeWidth={SW}
              color={T.t3}
              style={{ transform: moreExec ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .18s" }}
            />
          </button>
          {moreExec && (
            <>
              {GLOBAL_COMMAND.objectives.map((kr) => (
                <button
                  key={kr.id}
                  type="button"
                  onClick={() => onSelectDetail({ kind: "objective", id: kr.id })}
                  style={subItemStyle(T)}
                >
                  <Target size={14} strokeWidth={SW} color={T.accent} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kr.title}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 11, color: T.t3 }}>{kr.progress}%</span>
                </button>
              ))}
              {GLOBAL_COMMAND.milestones.map((ms) => (
                <button
                  key={ms.id}
                  type="button"
                  onClick={() => onSelectDetail({ kind: "milestone", id: ms.id })}
                  style={subItemStyle(T)}
                >
                  <Calendar size={14} strokeWidth={SW} color={T.t2} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ms.title}</span>
                  <span style={{ fontSize: 11, color: T.t3 }}>{ms.date}</span>
                </button>
              ))}
            </>
          )}

          {label("BLOCKERS")}
          {GLOBAL_COMMAND.blockers.map((bl) => (
            <button
              key={bl.id}
              type="button"
              onClick={() => onSelectDetail({ kind: "blocker", id: bl.id })}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "8px 10px",
                marginBottom: 2,
                border: "none",
                borderRadius: 8,
                background: T.redBg ?? "rgba(248, 113, 113, 0.08)",
                cursor: "pointer",
                fontFamily: F.sans,
                textAlign: "left",
              }}
            >
              <AlertCircle size={15} strokeWidth={SW} color={T.red} style={{ marginTop: 2 }} />
              <span style={{ color: T.t1, fontSize: 13, lineHeight: 1.35 }}>{bl.title}</span>
            </button>
          ))}

          {label("EXEC PINBOARD")}
          {GLOBAL_COMMAND.notes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelectDetail({ kind: "note", id: n.id })}
              style={subItemStyle(T)}
            >
              <BookOpen size={14} strokeWidth={SW} color={T.t2} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

function signalRowStyle(T, accent) {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    marginBottom: 4,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    cursor: "pointer",
    fontFamily: F.sans,
    color: T.t1,
    fontSize: 13,
    fontWeight: 500,
  };
}

function moreBtnStyle(T) {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 10px",
    marginBottom: 4,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    cursor: "pointer",
    fontFamily: F.sans,
  };
}

function subItemStyle(T) {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    marginBottom: 2,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    cursor: "pointer",
    fontFamily: F.sans,
    color: T.t1,
    fontSize: 12,
    fontWeight: 500,
  };
}
