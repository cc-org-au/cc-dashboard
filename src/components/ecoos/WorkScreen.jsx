import { useState } from "react";
import { Surface, Btn, Badge, Dot, Avi, Progress, Table, SlideOver, Modal, Field, Input, Select, SubNav, F } from "./primitives";
import { DB } from "./data";
import WorkflowVis from "./WorkflowVis";
import { Briefcase, CircleDot, LayoutGrid, Workflow, Plus, BookOpen } from "./icons";

export default function WorkScreen({ T, isMobile }) {
  const [view, setView] = useState("projects");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [dragCard, setDragCard] = useState(null);

  const sc = { on_track: T.green, at_risk: T.amber, planning: T.t3, done: T.green, todo: T.t3, in_progress: T.accent, review: T.amber };
  const pc = { high: T.red, medium: T.amber, low: T.t3 };

  const filteredTasks = statusFilter === "all" ? DB.tasks : DB.tasks.filter(t => t.status === statusFilter);

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

  const subTabs = [
    { id: "projects",  label: "Projects",   icon: <Briefcase size={16} />, count: DB.projects.length },
    { id: "tasks",     label: "Issues",     icon: <CircleDot size={16} />, count: DB.tasks.length },
    { id: "kanban",    label: "Board",      icon: <LayoutGrid size={16} /> },
    { id: "workflows", label: "Workflows",  icon: <Workflow size={16} />, count: 3 },
    { id: "wiki",      label: "Wiki",       icon: <BookOpen size={16} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Work</div>
          <div style={{ color: T.t2, fontSize: 13, marginTop: 2 }}>{DB.projects.length} projects · {DB.tasks.length} open issues</div>
        </div>
        {view !== "workflows" && view !== "wiki" && (
          <Btn T={T} variant="primary" onClick={() => setNewTaskModal(true)}><Plus size={14} /> New issue</Btn>
        )}
      </div>

      <SubNav T={T} tabs={subTabs} active={view} onChange={setView} />

      <div style={{ paddingTop: 20 }}>
        {view === "projects" && (
          <Surface T={T}>
            <Table T={T} onRow={setSelected} rows={DB.projects} cols={[
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
          </Surface>
        )}

        {view === "tasks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "todo", "in_progress", "review", "done"].map(s => (
                <Btn key={s} T={T} small variant={statusFilter === s ? "default" : "ghost"} onClick={() => setStatusFilter(s)}>
                  {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                </Btn>
              ))}
            </div>
            <Surface T={T}>
              <Table T={T} onRow={setSelected} rows={filteredTasks} cols={[
                { key: "title", label: "Title", render: (v, r) => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Dot status={r.status} T={T} /><span style={{ color: T.accent, fontWeight: 500 }}>{v}</span></div> },
                { key: "project", label: "Project", muted: true },
                { key: "assignee", label: "Assignee", render: v => <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avi name={v} size={20} /><span style={{ color: T.t2, fontSize: 12 }}>{v.split(" ")[0]}</span></div> },
                { key: "priority", label: "Priority", render: v => <Badge T={T} color={pc[v]}>{v}</Badge> },
                { key: "status", label: "Status", render: v => <Badge T={T} color={sc[v]}>{v.replace("_", " ")}</Badge> },
                { key: "due", label: "Due", render: v => <span style={{ color: T.t3, fontFamily: F.mono, fontSize: 12 }}>{v}</span>, muted: true },
              ]} />
            </Surface>
          </div>
        )}

        {view === "kanban" && (
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

        {view === "workflows" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[["Sensor Alert Pipeline", "active", "6 nodes"], ["Weekly Report Digest", "inactive", "4 nodes"], ["New User Onboarding", "active", "8 nodes"]].map(([name, status, nodes]) => (
                <div key={name} style={{ background: T.surface, border: `1px solid ${status === "active" ? T.accentBorder : T.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all .15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowMd}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <Workflow size={16} color={T.t2} />
                  <div>
                    <div style={{ color: T.t1, fontSize: 13, fontWeight: 600 }}>{name}</div>
                    <div style={{ color: T.t3, fontSize: 11 }}>{nodes}</div>
                  </div>
                  <Badge T={T} color={status === "active" ? T.green : T.t3}>{status}</Badge>
                </div>
              ))}
              <Btn T={T} small variant="default"><Plus size={13} /> New workflow</Btn>
            </div>
            <WorkflowVis T={T} />
          </div>
        )}

        {view === "wiki" && (
          <Surface T={T} style={{ padding: 40, textAlign: "center" }}>
            <BookOpen size={40} color={T.t3} style={{ margin: "0 auto 12px" }} />
            <div style={{ color: T.t1, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Welcome to the project wiki</div>
            <div style={{ color: T.t2, fontSize: 13, marginBottom: 16 }}>Document your processes, guides, and decisions.</div>
            <Btn T={T} variant="primary"><Plus size={14} /> Create first page</Btn>
          </Surface>
        )}
      </div>

      <SlideOver T={T} open={!!selected} onClose={() => setSelected(null)}
        title={selected?.name || selected?.title} subtitle={selected?.dept || selected?.project}>
        {selected && (
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {selected.status && <Badge T={T} color={sc[selected.status]}>{selected.status.replace("_", " ")}</Badge>}
              {selected.priority && <Badge T={T} color={pc[selected.priority]}>{selected.priority}</Badge>}
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