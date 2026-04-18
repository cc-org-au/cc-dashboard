import { useState, useMemo, useEffect } from "react";
import { Surface, Btn, Badge, Dot, Avi, Progress, Table, SlideOver, Modal, Field, Input, Select, SubNav, F } from "./primitives";
import { DB, WORKFLOW_PRESETS, ROADMAP_QUARTERS, ACTIVE_CYCLE } from "./data";
import WorkflowVis from "./WorkflowVis";
import { Briefcase, CircleDot, LayoutGrid, Workflow, Plus, BookOpen, Calendar, ChevronRight, MoreHorizontal } from "./icons";

function labelPillStyle(label) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h + label.charCodeAt(i) * 17) % 360;
  return {
    background: `hsla(${h}, 38%, 92%, 1)`,
    color: `hsla(${h}, 32%, 26%, 1)`,
    border: `1px solid hsla(${h}, 28%, 82%, 1)`,
  };
}

const ISSUE_GROUPS = [
  { status: "review", title: "In review" },
  { status: "in_progress", title: "In progress" },
  { status: "todo", title: "Todo" },
  { status: "done", title: "Done" },
];

function IssueTicketRow({ T, r, selected, checked, onToggleCheck, onOpen }) {
  const key = r.issueKey || r.id;
  const labels = r.labels || [];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      style={{
        display: "grid",
        gridTemplateColumns: "26px 22px minmax(56px,76px) 14px minmax(120px,1fr) minmax(96px,220px) 44px 30px",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px 8px 10px",
        borderBottom: `1px solid ${T.border}`,
        background: selected ? "rgba(9, 105, 218, 0.06)" : "transparent",
        cursor: "pointer",
        fontFamily: F.sans,
      }}
    >
      <input type="checkbox" checked={checked} onChange={onToggleCheck} onClick={(e) => e.stopPropagation()} style={{ width: 15, height: 15, accentColor: T.accent }} />
      <button type="button" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: T.t3, display: "flex" }} onClick={(e) => e.stopPropagation()} aria-label="More">
        <MoreHorizontal size={16} />
      </button>
      <span style={{ fontFamily: F.mono, fontSize: 11, color: T.t3, whiteSpace: "nowrap" }}>{key}</span>
      <Dot status={r.status} T={T} size={9} />
      <div style={{ minWidth: 0, color: T.t1, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
        {labels.map((lb) => (
          <span key={lb} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, ...labelPillStyle(lb) }}>{lb}</span>
        ))}
      </div>
      <span style={{ fontFamily: F.mono, fontSize: 11, color: T.t3, whiteSpace: "nowrap", textAlign: "right" }}>{r.due}</span>
      <Avi name={r.assignee} size={24} />
    </div>
  );
}

export default function WorkScreen({ T, isMobile }) {
  const [view, setView] = useState("projects");
  const [roadmapTab, setRoadmapTab] = useState("active");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [dragCard, setDragCard] = useState(null);
  const [issuePick, setIssuePick] = useState(() => new Set());

  const sc = { on_track: T.green, at_risk: T.amber, planning: T.t3, done: T.green, todo: T.t3, in_progress: T.accent, review: T.amber };
  const pc = { high: T.red, medium: T.amber, low: T.t3 };

  const filteredTasks = statusFilter === "all" ? DB.tasks : DB.tasks.filter(t => t.status === statusFilter);

  const groupedIssues = useMemo(() => {
    const map = { review: [], in_progress: [], todo: [], done: [] };
    for (const t of filteredTasks) {
      if (map[t.status]) map[t.status].push(t);
    }
    return map;
  }, [filteredTasks]);

  const [board, setBoard] = useState({
    todo: DB.tasks.filter(t => t.status === "todo"),
    in_progress: DB.tasks.filter(t => t.status === "in_progress"),
    review: DB.tasks.filter(t => t.status === "review"),
    done: DB.tasks.filter(t => t.status === "done"),
  });
  const handleDrop = (col) => {
    if (!dragCard) return;
    setBoard(prev => { const next = {}; for (const [k, v] of Object.entries(prev)) next[k] = v.filter(c => c.id !== dragCard.id); next[col] = [...(next[col] || []), dragCard]; return next; });
    setDragCard(null);
  };

  const workView = view === "cycles" ? "roadmap" : view;
  useEffect(() => {
    if (view === "cycles") setView("roadmap");
  }, [view]);

  const roadmapCount = ROADMAP_QUARTERS.reduce((n, q) => n + q.items.length, 0);
  const subTabs = [
    { id: "projects",  label: "Projects",   icon: <Briefcase size={16} />, count: DB.projects.length },
    { id: "tasks",     label: "Issues",     icon: <CircleDot size={16} />, count: DB.tasks.length },
    { id: "kanban",    label: "Board",      icon: <LayoutGrid size={16} /> },
    { id: "roadmap",   label: "Roadmap",    icon: <Calendar size={16} />, count: roadmapCount },
    { id: "workflows", label: "Workflows",  icon: <Workflow size={16} />, count: WORKFLOW_PRESETS.length },
    { id: "wiki",      label: "Wiki",       icon: <BookOpen size={16} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Work</div>
          <div style={{ color: T.t2, fontSize: 13, marginTop: 2 }}>{DB.projects.length} projects · {DB.tasks.length} open issues</div>
        </div>
        {workView !== "workflows" && workView !== "wiki" && (
          <Btn T={T} variant="primary" onClick={() => setNewTaskModal(true)}><Plus size={14} /> New issue</Btn>
        )}
      </div>

      <SubNav T={T} tabs={subTabs} active={workView} onChange={setView} />

      <div style={{ paddingTop: 20 }}>
        {workView === "projects" && (
          <Table T={T} variant="card" selectedId={selected?.id} onRow={setSelected} rows={DB.projects} cols={[
              { key: "name", label: "Project", render: (v, r) => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Dot status={r.status} T={T} /><span style={{ color: T.accent, fontWeight: 600 }}>{v}</span></div> },
              { key: "dept", label: "Department", muted: true },
              { key: "owner", label: "Owner", muted: true },
              { key: "status", label: "Status", render: v => <Badge T={T} color={sc[v]}>{v.replace("_", " ")}</Badge> },
              { key: "priority", label: "Priority", render: v => <Badge T={T} color={pc[v]}>{v}</Badge> },
              {
                key: "progress", label: "Progress", render: (v, r) => (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 120 }}>
                    <div style={{ flex: 1 }}><Progress value={v} color={sc[r.status]} T={T} /></div>
                    <span style={{ color: T.t2, fontSize: 12, width: 32, textAlign: "right", fontFamily: F.mono }}>{v}%</span>
                  </div>
                )
              },
              { key: "due", label: "Due", render: v => <span style={{ color: T.t3, fontFamily: F.mono, fontSize: 12 }}>{v}</span>, muted: true },
            ]} />
        )}

        {workView === "tasks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["all", "todo", "in_progress", "review", "done"].map(s => (
                  <Btn key={s} T={T} small variant={statusFilter === s ? "default" : "ghost"} onClick={() => setStatusFilter(s)}>
                    {s === "all" ? "All" : s === "in_progress" ? "In progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </Btn>
                ))}
              </div>
              <Btn T={T} small variant="ghost">+ Filter</Btn>
            </div>

            {statusFilter === "all" ? (
              <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", background: T.surface }}>
                {ISSUE_GROUPS.map((g) => {
                  const rows = groupedIssues[g.status] || [];
                  if (!rows.length) return null;
                  return (
                    <div key={g.status}>
                      <div style={{ padding: "8px 14px", background: T.canvas, borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 700, color: T.t2, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {g.title} <span style={{ color: T.t3, fontWeight: 600 }}>({rows.length})</span>
                      </div>
                      {rows.map((r) => (
                        <IssueTicketRow
                          key={r.id}
                          T={T}
                          r={r}
                          selected={selected?.id === r.id}
                          checked={issuePick.has(r.id)}
                          onToggleCheck={(e) => {
                            e.stopPropagation();
                            setIssuePick((prev) => {
                              const next = new Set(prev);
                              if (next.has(r.id)) next.delete(r.id);
                              else next.add(r.id);
                              return next;
                            });
                          }}
                          onOpen={() => setSelected(r)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", background: T.surface }}>
                {filteredTasks.map((r) => (
                  <IssueTicketRow
                    key={r.id}
                    T={T}
                    r={r}
                    selected={selected?.id === r.id}
                    checked={issuePick.has(r.id)}
                    onToggleCheck={(e) => {
                      e.stopPropagation();
                      setIssuePick((prev) => {
                        const next = new Set(prev);
                        if (next.has(r.id)) next.delete(r.id);
                        else next.add(r.id);
                        return next;
                      });
                    }}
                    onOpen={() => setSelected(r)}
                  />
                ))}
              </div>
            )}

            {issuePick.size > 0 && (
              <div style={{ position: "sticky", bottom: 12, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, boxShadow: T.shadowMd }}>
                  <span style={{ color: T.t1, fontSize: 13, fontWeight: 600 }}>{issuePick.size} selected</span>
                  <button type="button" style={{ background: "none", border: "none", color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F.sans }} onClick={() => setIssuePick(new Set(DB.tasks.map((t) => t.id)))}>Select all</button>
                  <button type="button" style={{ background: "none", border: "none", color: T.t2, fontSize: 12, cursor: "pointer", fontFamily: F.sans }} onClick={() => setIssuePick(new Set())}>Clear</button>
                  <Btn T={T} small variant="primary">Change status</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {workView === "roadmap" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(220px, 300px) minmax(200px, 1fr) minmax(248px, 320px)",
              gap: 12,
              alignItems: "stretch",
            }}
          >
            <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, background: T.surface, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: isMobile ? 280 : 440 }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <span style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>Roadmap</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn T={T} small variant={roadmapTab === "active" ? "default" : "ghost"} onClick={() => setRoadmapTab("active")}>Active</Btn>
                  <Btn T={T} small variant={roadmapTab === "closed" ? "default" : "ghost"} onClick={() => setRoadmapTab("closed")}>Closed</Btn>
                </div>
              </div>
              <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                {ROADMAP_QUARTERS.map((q) => (
                  <div key={q.id}>
                    <div style={{ padding: "8px 14px", background: T.canvas, fontSize: 11, fontWeight: 700, color: T.t2, letterSpacing: "0.04em" }}>{q.label}</div>
                    {q.items.map((it) => (
                      <div key={it.id} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.background = T.canvas; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <span style={{ fontSize: 16 }}>{it.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: T.t1, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</div>
                          <div style={{ color: T.t3, fontSize: 10, marginTop: 2, textTransform: "capitalize" }}>{it.status}</div>
                        </div>
                        <div style={{ display: "flex", marginLeft: -6 }}>
                          {it.avatars.slice(0, 3).map((name, ai) => (
                            <span key={name} style={{ marginLeft: ai > 0 ? -6 : 0, display: "inline-flex" }}>
                              <Avi name={name} size={22} />
                            </span>
                          ))}
                        </div>
                        <ChevronRight size={16} color={T.t3} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, background: T.canvas, padding: 14, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: isMobile ? 260 : 440 }}>
              <div style={{ color: T.t1, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Timeline</div>
              <div style={{ display: "flex", gap: 2, marginBottom: 8, paddingLeft: 56, flexShrink: 0 }}>
                {["Apr", "May", "Jun", "Jul", "Aug"].map((m) => (
                  <div key={m} style={{ flex: 1, textAlign: "center", fontSize: 10, color: T.t3, fontFamily: F.mono }}>{m}</div>
                ))}
              </div>
              <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                {ROADMAP_QUARTERS.flatMap((q) => q.items).map((it, i) => (
                  <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ width: 48, fontSize: 10, color: T.t3, fontFamily: F.mono, textAlign: "right", flexShrink: 0 }}>Q{i % 2 ? "3" : "2"}&apos;26</span>
                    <div style={{ flex: 1, height: 30, borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, position: "relative", minWidth: 0 }}>
                      <div style={{ position: "absolute", left: `${12 + (i * 17) % 55}%`, width: `${28 + (i * 11) % 20}%`, top: 4, bottom: 4, borderRadius: 4, background: "rgba(9, 105, 218, 0.1)", border: `1px solid ${T.accent}`, display: "flex", alignItems: "center", padding: "0 8px", fontSize: 10, color: T.t1, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden" }}>
                        <span style={{ marginRight: 6 }}>{it.icon}</span> {it.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, color: T.t3, fontSize: 11, lineHeight: 1.45, flexShrink: 0 }}>
                Quarters on the left, schedule bars in the center — Linear-style roadmap (demo).
              </div>
            </div>

            <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, background: T.surface, padding: 14, display: "flex", flexDirection: "column", minHeight: isMobile ? 320 : 440, overflow: "hidden" }}>
              <div style={{ color: T.t3, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Current cycle</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: T.t1, fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>{ACTIVE_CYCLE.name}</div>
                  <div style={{ color: T.t3, fontSize: 11, marginTop: 4 }}>{ACTIVE_CYCLE.range}</div>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `conic-gradient(${T.accent} ${ACTIVE_CYCLE.pctDone * 3.6}deg, ${T.border} 0)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.t1 }}>{ACTIVE_CYCLE.pctDone}%</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ padding: 8, borderRadius: 8, background: T.canvas, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 10, color: T.t3 }}>Effort</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{ACTIVE_CYCLE.effortDone} / {ACTIVE_CYCLE.effortTotal}</div>
                </div>
                <div style={{ padding: 8, borderRadius: 8, background: T.canvas, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 10, color: T.t3 }}>Time left</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{ACTIVE_CYCLE.weekdaysLeft} wd</div>
                </div>
              </div>
              <div style={{ height: 88, borderRadius: 8, background: T.canvas, border: `1px solid ${T.border}`, marginBottom: 10, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                <svg width="100%" height="100%" viewBox="0 0 280 100" preserveAspectRatio="none">
                  <path d="M0,85 L40,78 L80,72 L120,60 L160,52 L200,45 L240,38 L280,32" fill="none" stroke={T.accent} strokeWidth="2" />
                  <path d="M0,90 L280,25" fill="none" stroke={T.t3} strokeWidth="1" strokeDasharray="4 3" opacity={0.6} />
                </svg>
                <div style={{ position: "absolute", bottom: 5, left: 8, fontSize: 10, color: T.t3 }}>{ACTIVE_CYCLE.burndownHint}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.t2, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Progress on effort</div>
              <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                {ACTIVE_CYCLE.members.map((m) => (
                  <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderTop: `1px solid ${T.border}` }}>
                    <Avi name={m.name} size={22} />
                    <div style={{ flex: 1, color: T.t1, fontSize: 12, minWidth: 0 }}>{m.name}</div>
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: T.t2 }}>{m.pct}% · {m.of}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.t2, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>In this cycle</div>
                {DB.tasks.filter((t) => t.status !== "done").slice(0, 5).map((t) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                    <Dot status={t.status} T={T} size={7} />
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: T.t3, flexShrink: 0 }}>{t.issueKey || t.id}</span>
                    <span style={{ flex: 1, color: T.t1, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</span>
                    <Avi name={t.assignee} size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {workView === "kanban" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4,1fr)", gap: 10, alignItems: "start" }}>
            {[["todo", "To do", T.t3], ["in_progress", "In progress", T.accent], ["review", "Review", T.amber], ["done", "Done", T.green]].map(([col, label, color]) => (
              <div key={col} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(col)}
                style={{ background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, minHeight: 200 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9, padding: "2px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                    <span style={{ color: T.t1, fontSize: 13, fontWeight: 600 }}>{label}</span>
                  </div>
                  <Badge T={T}>{(board[col] || []).length}</Badge>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {(board[col] || []).map(card => (
                    <div key={card.id} draggable onDragStart={() => setDragCard(card)}
                      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 11px", cursor: "grab", borderLeft: `3px solid ${pc[card.priority]}` }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowMd}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                      <div style={{ color: T.t1, fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{card.title}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: T.t3, fontSize: 11, fontFamily: F.mono }}>#{card.id}</span>
                        <Avi name={card.assignee} size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {workView === "workflows" && <WorkflowVis T={T} />}

        {workView === "wiki" && (
          <Surface T={T} style={{ padding: 40, textAlign: "center" }}>
            <BookOpen size={40} color={T.t3} style={{ margin: "0 auto 12px" }} />
            <div style={{ color: T.t1, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Welcome to the project wiki</div>
            <div style={{ color: T.t2, fontSize: 13, marginBottom: 16 }}>Document your processes, guides, and decisions.</div>
            <Btn T={T} variant="primary"><Plus size={14} /> Create first page</Btn>
          </Surface>
        )}
      </div>

      <SlideOver T={T} open={!!selected} onClose={() => setSelected(null)}
        title={selected?.name || selected?.title}
        subtitle={selected?.issueKey ? `${selected.issueKey} · ${selected.project || selected.dept || ""}` : (selected?.dept || selected?.project)}>
        {selected && (
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {selected.status && <Badge T={T} color={sc[selected.status]}>{selected.status.replace("_", " ")}</Badge>}
              {selected.priority && <Badge T={T} color={pc[selected.priority]}>{selected.priority}</Badge>}
              {selected.labels?.map((lb) => (
                <span key={lb} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4, ...labelPillStyle(lb) }}>{lb}</span>
              ))}
            </div>
            {[["Owner/Assignee", selected.owner || selected.assignee], ["Department", selected.dept], ["Project", selected.project], ["Due Date", selected.due], ["Progress", selected.progress != null ? `${selected.progress}%` : null]].filter(([, v]) => v != null).map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.t3 }}>{l}</span><span style={{ color: T.t1, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            {selected.progress != null && <Progress value={selected.progress} color={sc[selected.status]} T={T} />}
            <div style={{ display: "flex", gap: 8 }}><Btn T={T} small variant="default">Edit</Btn><Btn T={T} small variant="danger">Close issue</Btn></div>
          </div>
        )}
      </SlideOver>

      <Modal T={T} open={newTaskModal} onClose={() => setNewTaskModal(false)} title="New Issue">
        <Field label="Title" T={T}><Input T={T} placeholder="Issue title..." /></Field>
        <Field label="Project" T={T}><Select T={T} style={{ width: "100%" }}>{DB.projects.map(p => <option key={p.id}>{p.name}</option>)}</Select></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Priority" T={T}><Select T={T} style={{ width: "100%" }}><option>high</option><option>medium</option><option>low</option></Select></Field>
          <Field label="Due Date" T={T}><Input T={T} type="date" /></Field>
        </div>
        <Field label="Assignee" T={T}><Select T={T} style={{ width: "100%" }}>{DB.people.map(p => <option key={p.id}>{p.name}</option>)}</Select></Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
          <Btn T={T} variant="default" onClick={() => setNewTaskModal(false)}>Cancel</Btn>
          <Btn T={T} variant="primary" onClick={() => setNewTaskModal(false)}>Submit new issue</Btn>
        </div>
      </Modal>
    </div>
  );
}