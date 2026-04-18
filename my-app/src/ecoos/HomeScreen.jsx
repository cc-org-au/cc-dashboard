import { useState } from "react";
import { Surface, Btn, Badge, Dot, Progress, SlideOver, SectionLabel, F, SubNav } from "./primitives";
import { DB } from "./data";
import { BarChart3, GitPullRequest, CheckCircle2, Activity, Star, TrendingUp, TrendingDown } from "../icons";

export default function HomeScreen({ T, isMobile }) {
  const [detailProject, setDetailProject] = useState(null);
  const [subTab, setSubTab] = useState("overview");
  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const statusColor = { on_track: T.green, at_risk: T.amber, planning: T.t3, done: T.green };
  const priorityColor = { high: T.red, medium: T.amber, low: T.t3 };

  const subTabs = [
    { id: "overview",  label: "Overview",    icon: <BarChart3 size={16} /> },
    { id: "pulse",     label: "Pulse",       icon: <Activity size={16} />, count: 7 },
    { id: "starred",   label: "Starred",     icon: <Star size={16} />,    count: 3 },
    { id: "following", label: "Following",   icon: <CheckCircle2 size={16} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: T.t2, fontSize: 13, marginBottom: 4 }}>{greet} · {now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</div>
        <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Dashboard</div>
      </div>

      <SubNav T={T} tabs={subTabs} active={subTab} onChange={setSubTab} />

      <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
          {DB.stats.map(s => (
            <Surface key={s.id} T={T} style={{ padding: "16px 18px" }}>
              <div style={{ color: T.t2, fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
              <div style={{ color: T.t1, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {s.up ? <TrendingUp size={13} color={T.green} /> : <TrendingDown size={13} color={T.amber} />}
                <span style={{ color: s.up ? T.green : T.amber, fontSize: 12, fontWeight: 500 }}>{s.delta}</span>
                <span style={{ color: T.t3, fontSize: 12 }}>vs last month</span>
              </div>
            </Surface>
          ))}
        </div>

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 16, alignItems: "start" }}>
          {/* Projects */}
          <Surface T={T}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.raised, borderRadius: "6px 6px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GitPullRequest size={15} color={T.t2} />
                <span style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>Active Projects</span>
                <Badge T={T}>{DB.projects.length}</Badge>
              </div>
              <Btn T={T} small variant="ghost">View all →</Btn>
            </div>
            {DB.projects.slice(0, 4).map((p, i) => (
              <div key={p.id} onClick={() => setDetailProject(p)} style={{ padding: "14px 16px", borderBottom: i < 3 ? `1px solid ${T.border}` : "none", cursor: "pointer", transition: "background .12s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.raised}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                    <Dot status={p.status} T={T} />
                    <span style={{ color: T.accent, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{p.name}</span>
                    <Badge T={T} color={priorityColor[p.priority]}>{p.priority}</Badge>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: T.t3, fontSize: 12 }}>{p.dept}</span>
                    <span style={{ color: T.t3, fontSize: 12, fontFamily: F.mono }}>{p.due}</span>
                    <span style={{ color: T.t1, fontSize: 12, fontWeight: 600 }}>{p.progress}%</span>
                  </div>
                </div>
                <Progress value={p.progress} color={statusColor[p.status]} T={T} />
              </div>
            ))}
          </Surface>

          {/* Activity */}
          <Surface T={T}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: T.raised, borderRadius: "6px 6px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={15} color={T.t2} />
              <span style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>Recent activity</span>
            </div>
            {DB.activity.map((a, i) => (
              <div key={a.id} style={{ padding: "10px 16px", borderBottom: i < DB.activity.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, display: "inline-block", flexShrink: 0, marginTop: 6 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.t1, fontSize: 13, lineHeight: 1.4 }}>{a.action}</div>
                  <div style={{ color: T.t3, fontSize: 12, marginTop: 2 }}><span style={{ color: T.accent, fontWeight: 500 }}>{a.user}</span> · {a.time}</div>
                </div>
              </div>
            ))}
          </Surface>
        </div>
      </div>

      {/* Project detail slide-over */}
      <SlideOver T={T} open={!!detailProject} onClose={() => setDetailProject(null)}
        title={detailProject?.name} subtitle={`${detailProject?.dept} · ${detailProject?.owner}`}>
        {detailProject && (
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge T={T} color={statusColor[detailProject.status]}>{detailProject.status.replace("_", " ")}</Badge>
              <Badge T={T} color={priorityColor[detailProject.priority]}>{detailProject.priority} priority</Badge>
              <Badge T={T}>{detailProject.dept}</Badge>
            </div>
            <div>
              <SectionLabel T={T}>Progress</SectionLabel>
              <div style={{ marginBottom: 8 }}><Progress value={detailProject.progress} color={statusColor[detailProject.status]} T={T} /></div>
              <div style={{ color: T.t2, fontSize: 13 }}>{detailProject.progress}% complete · Due {detailProject.due}</div>
            </div>
            <div>
              <SectionLabel T={T}>Details</SectionLabel>
              {[["Owner", detailProject.owner], ["Department", detailProject.dept], ["Due Date", detailProject.due], ["Status", detailProject.status.replace("_", " ")]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                  <span style={{ color: T.t3 }}>{l}</span><span style={{ color: T.t1, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <SectionLabel T={T}>Related Tasks</SectionLabel>
              {DB.tasks.filter(t => t.project === detailProject.name).map(task => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                  <Dot status={task.status} T={T} />
                  <span style={{ color: T.t1, fontSize: 12, flex: 1 }}>{task.title}</span>
                  <span style={{ color: T.t3, fontSize: 11 }}>{task.assignee.split(" ")[0]}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn T={T} variant="default" small>Edit project</Btn>
              <Btn T={T} variant="default" small>View tasks</Btn>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}