import { useState, useEffect, useRef, useCallback } from "react";
import { Btn } from "./primitives";
import { F } from "./primitives";

const WF_NODES_INIT = [
  { id: "n1", x: 30,  y: 100, type: "trigger", label: "Sensor Alert",    sub: "IoT threshold breach", color: "#0891b2" },
  { id: "n2", x: 210, y: 40,  type: "filter",  label: "Severity Check",  sub: "Critical only",         color: "#9a6700" },
  { id: "n3", x: 210, y: 170, type: "action",  label: "Log Event",       sub: "Write to database",     color: "#6e7781" },
  { id: "n4", x: 390, y: 40,  type: "ai",      label: "EcoScan AI",      sub: "Species analysis",      color: "#8250df" },
  { id: "n5", x: 390, y: 170, type: "action",  label: "Create Task",     sub: "Assign to team",        color: "#0969da" },
  { id: "n6", x: 570, y: 40,  type: "action",  label: "Slack Notify",    sub: "#alerts channel",       color: "#1a7f37" },
  { id: "n7", x: 570, y: 170, type: "action",  label: "Email Report",    sub: "Weekly digest",         color: "#1a7f37" },
  { id: "n8", x: 740, y: 105, type: "end",     label: "Complete",        sub: "Workflow done",         color: "#374151" },
];
const WF_EDGES = [
  { f: "n1", t: "n2" }, { f: "n1", t: "n3" },
  { f: "n2", t: "n4" }, { f: "n2", t: "n5" },
  { f: "n4", t: "n6" }, { f: "n5", t: "n7" },
  { f: "n6", t: "n8" }, { f: "n7", t: "n8" },
];
const WF_ICON = { trigger: "⚡", filter: "⚙", ai: "◈", action: "→", end: "●" };
const NW = 144, NH = 52;

export default function WorkflowVis({ T }) {
  const [nodes, setNodes] = useState(WF_NODES_INIT);
  const [selNode, setSelNode] = useState(null);
  const [drag, setDrag] = useState(null);
  const [dragOff, setDragOff] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const onMouseDown = (e, id) => {
    e.stopPropagation();
    const r = svgRef.current.getBoundingClientRect();
    const n = nodes.find(x => x.id === id);
    setDrag(id); setSelNode(id);
    setDragOff({ x: e.clientX - r.left - n.x, y: e.clientY - r.top - n.y });
  };
  const onMouseMove = useCallback(e => {
    if (!drag) return;
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    setNodes(p => p.map(n => n.id === drag ? { ...n, x: Math.max(0, e.clientX - r.left - dragOff.x), y: Math.max(0, e.clientY - r.top - dragOff.y) } : n));
  }, [drag, dragOff]);
  const onMouseUp = useCallback(() => setDrag(null), []);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  const sel = nodes.find(n => n.id === selNode);

  return (
    <div style={{ display: "flex", gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", background: T.raised, boxShadow: T.shadow }}>
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 8, background: T.surface, alignItems: "center" }}>
          <span style={{ color: T.t1, fontSize: 13, fontWeight: 600, flex: 1 }}>Sensor Alert Pipeline</span>
          <Btn T={T} small variant="default">+ Node</Btn>
          <Btn T={T} small variant="primary">▶ Run</Btn>
          <Btn T={T} small variant="default">Save</Btn>
        </div>
        <svg ref={svgRef} width="920" height="280" style={{ display: "block", userSelect: "none", cursor: drag ? "grabbing" : "default" }}
          onClick={e => { if (e.target === e.currentTarget || e.target.tagName === "svg") setSelNode(null); }}>
          <defs>
            <pattern id="wfdots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="11" cy="11" r=".7" fill={T.border} />
            </pattern>
          </defs>
          <rect width="920" height="280" fill="url(#wfdots)" />

          {WF_EDGES.map((e, i) => {
            const f = nodes.find(n => n.id === e.f), t = nodes.find(n => n.id === e.t);
            if (!f || !t) return null;
            const x1 = f.x + NW, y1 = f.y + NH / 2, x2 = t.x, y2 = t.y + NH / 2, mx = (x1 + x2) / 2;
            const active = selNode === e.f || selNode === e.t;
            return (
              <g key={i}>
                <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none"
                  stroke={active ? T.accent : T.border} strokeWidth={active ? 2 : 1.5} strokeDasharray={active ? "none" : "4,3"} />
                <polygon points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`} fill={active ? T.accent : T.border} />
              </g>
            );
          })}

          {nodes.map(node => {
            const isSel = selNode === node.id;
            return (
              <g key={node.id} onMouseDown={e => onMouseDown(e, node.id)} style={{ cursor: "grab" }}>
                <rect x={node.x + 2} y={node.y + 2} width={NW} height={NH} rx={6} fill="rgba(0,0,0,0.06)" />
                <rect x={node.x} y={node.y} width={NW} height={NH} rx={6}
                  fill={isSel ? `${node.color}18` : T.surface}
                  stroke={isSel ? node.color : T.border} strokeWidth={isSel ? 2 : 1} />
                <rect x={node.x} y={node.y + 8} width={3} height={NH - 16} rx={2} fill={node.color} />
                <text x={node.x + 16} y={node.y + NH / 2 - 6} fontSize="12" fontWeight="600" fill={isSel ? node.color : T.t1} fontFamily={F.sans}>{node.label}</text>
                <text x={node.x + 16} y={node.y + NH / 2 + 9} fontSize="10" fill={T.t3} fontFamily={F.sans}>{node.sub}</text>
                <circle cx={node.x + NW} cy={node.y + NH / 2} r={4} fill={T.surface} stroke={T.border} strokeWidth={1.5} />
                <circle cx={node.x} cy={node.y + NH / 2} r={4} fill={T.surface} stroke={T.border} strokeWidth={1.5} />
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ width: sel ? 210 : 0, flexShrink: 0, borderLeft: `1px solid ${T.border}`, overflow: "hidden", transition: "width .2s", background: T.surface }}>
        {sel && (
          <div style={{ width: 210, padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: `${sel.color}18`, border: `1px solid ${sel.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: sel.color }}>{WF_ICON[sel.type] || "◇"}</div>
              <div><div style={{ color: T.t1, fontSize: 13, fontWeight: 600 }}>{sel.label}</div><div style={{ color: T.t3, fontSize: 11 }}>{sel.type}</div></div>
            </div>
            {[["Description", sel.sub], ["ID", sel.id], ["Connections", WF_EDGES.filter(e => e.f === sel.id || e.t === sel.id).length + " edges"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
                <span style={{ color: T.t3 }}>{k}</span><span style={{ color: T.t1, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              <Btn T={T} small variant="default" full>Edit Node</Btn>
              <Btn T={T} small variant="danger" full>Remove</Btn>
            </div>
          </div>
        )}
        {!sel && <div style={{ width: 210, display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 16, textAlign: "center", color: T.t4 }}><div><div style={{ fontSize: 20, marginBottom: 6 }}>◇</div><div style={{ fontSize: 11 }}>Click a node</div></div></div>}
      </div>
    </div>
  );
}