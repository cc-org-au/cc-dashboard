import { useState, useEffect } from "react";
import { Surface, Badge, Table, SlideOver, Sparkline, SubNav, F } from "./primitives";
import { DB, spark } from "./data";
import { BarChart3, Activity, Zap, AlertCircle } from "lucide-react";

export default function DataScreen({ T, isMobile }) {
  const [liveData, setLiveData] = useState(DB.stats.map(s => ({ ...s, spark: spark() })));
  useEffect(() => {
    const int = setInterval(() => setLiveData(p => p.map(s => ({ ...s, spark: [...s.spark.slice(1), Math.random() * 60 + 20] }))), 2000);
    return () => clearInterval(int);
  }, []);
  const [selected, setSelected] = useState(null);
  const [subTab, setSubTab] = useState("metrics");

  const subTabs = [
    { id: "metrics",  label: "Metrics",   icon: <BarChart3 size={16} /> },
    { id: "traces",   label: "AI Traces", icon: <Activity size={16} />, count: 6 },
    { id: "events",   label: "Events",    icon: <Zap size={16} /> },
    { id: "alerts",   label: "Alerts",    icon: <AlertCircle size={16} />, count: 1 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Data & Metrics</div>
          <div style={{ color: T.t2, fontSize: 13, marginTop: 2 }}>Live streams · AI traces · Analytics</div>
        </div>
      </div>

      <SubNav T={T} tabs={subTabs} active={subTab} onChange={setSubTab} />

      <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {subTab === "metrics" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
            {liveData.map(s => (
              <Surface key={s.id} T={T} hoverable style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ color: T.t2, fontSize: 12, fontWeight: 500 }}>{s.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
                    <span style={{ color: T.t3, fontSize: 10, fontWeight: 600, letterSpacing: "0.05em" }}>LIVE</span>
                  </div>
                </div>
                <div style={{ color: T.t1, fontSize: 22, fontWeight: 600, fontVariantNumeric: "tabular-nums", marginBottom: 10 }}>{s.value}</div>
                <Sparkline data={s.spark} color={s.color} height={32} width={120} />
              </Surface>
            ))}
          </div>
        )}

        {(subTab === "traces" || subTab === "metrics") && (
          <Surface T={T}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.raised, borderRadius: "6px 6px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={15} color={T.t2} />
                <span style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>AI Run Traces</span>
                <span style={{ color: T.t3, fontSize: 12 }}>Last 24h</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge T={T} color={T.green}>5 success</Badge>
                <Badge T={T} color={T.red}>1 error</Badge>
              </div>
            </div>
            <Table T={T} onRow={setSelected} rows={[
              { id: "tr1", name: "sales_forecast_run",  agent: "DataOracle",    model: "claude-3.5",    tokens: "5,210", cost: "$0.12",  latency: "2.1s", status: "success", time: "10:03" },
              { id: "tr2", name: "deal_summary_batch",  agent: "SalesGPT",      model: "gpt-4o",        tokens: "2,847", cost: "$0.048", latency: "1.2s", status: "success", time: "09:16" },
              { id: "tr3", name: "support_triage_x42",  agent: "SupportBot",    model: "gpt-4o",        tokens: "892",   cost: "$0.008", latency: "0.8s", status: "success", time: "10:45" },
              { id: "tr4", name: "code_review_pr189",   agent: "DevAssist",     model: "gpt-4o-mini",   tokens: "1,240", cost: "$0.009", latency: "1.1s", status: "success", time: "11:02" },
              { id: "tr5", name: "iso_control_map_v2",  agent: "ComplianceAI",  model: "claude-3",      tokens: "8,921", cost: "$0.18",  latency: "4.2s", status: "error",   time: "11:14" },
              { id: "tr6", name: "deal_summary_batch",  agent: "SalesGPT",      model: "gpt-4o",        tokens: "3,102", cost: "$0.052", latency: "1.4s", status: "success", time: "11:30" },
            ]} cols={[
              { key: "name",    label: "Run Name", render: v => <span style={{ fontFamily: F.mono, fontSize: 12, color: T.accent, fontWeight: 600 }}>{v}</span> },
              { key: "agent",   label: "Agent", muted: true },
              { key: "model",   label: "Model", render: v => <Badge T={T} color={T.purple}>{v}</Badge> },
              { key: "tokens",  label: "Tokens", render: v => <span style={{ fontFamily: F.mono, fontSize: 12, color: T.t2 }}>{v}</span>, muted: true },
              { key: "cost",    label: "Cost", render: v => <span style={{ fontFamily: F.mono, fontSize: 12, color: T.t2 }}>{v}</span>, muted: true },
              { key: "latency", label: "Latency", render: v => <span style={{ fontFamily: F.mono, fontSize: 12, color: T.t2 }}>{v}</span>, muted: true },
              { key: "status",  label: "Status", render: v => <Badge T={T} color={v === "success" ? T.green : T.red}>{v}</Badge> },
              { key: "time",    label: "Time", render: v => <span style={{ color: T.t3, fontSize: 12 }}>{v}</span>, muted: true },
            ]} />
          </Surface>
        )}

        {subTab === "events" && (
          <Surface T={T} style={{ padding: 40, textAlign: "center" }}>
            <Zap size={40} color={T.t3} style={{ margin: "0 auto 12px" }} />
            <div style={{ color: T.t1, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Event stream</div>
            <div style={{ color: T.t2, fontSize: 13 }}>Stub: Live event stream will appear here.</div>
          </Surface>
        )}

        {subTab === "alerts" && (
          <Surface T={T} style={{ padding: 40, textAlign: "center" }}>
            <AlertCircle size={40} color={T.amber} style={{ margin: "0 auto 12px" }} />
            <div style={{ color: T.t1, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>1 active alert</div>
            <div style={{ color: T.t2, fontSize: 13 }}>Stub: Alert rules and thresholds.</div>
          </Surface>
        )}
      </div>

      <SlideOver T={T} open={!!selected} onClose={() => setSelected(null)} title="Trace Detail" subtitle={selected?.name}>
        {selected && (
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Badge T={T} color={selected.status === "success" ? T.green : T.red}>{selected.status}</Badge>
            {[["Agent", selected.agent], ["Model", selected.model], ["Tokens", selected.tokens], ["Cost", selected.cost], ["Latency", selected.latency], ["Time", selected.time]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.t3 }}>{l}</span><span style={{ color: T.t1, fontWeight: 600, fontFamily: F.mono }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </SlideOver>
    </div>
  );
}