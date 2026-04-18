import { useState, useEffect, useRef } from "react";
import { Btn, Badge, F, SubNav } from "./primitives";
import { DB } from "./data";
import { Inbox, AtSign, Star, Archive, Search, Edit2, Paperclip, Smile, Code2, Bot } from "lucide-react";

export default function InboxScreen({ T, isMobile }) {
  const [activeAgent, setActiveAgent] = useState("ag1");
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState(DB.chats);
  const [filter, setFilter] = useState("all");
  const [reactions, setReactions] = useState({});
  const [showReactions, setShowReactions] = useState(null);
  const [subTab, setSubTab] = useState("all");
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [activeAgent, chats]);

  const send = () => {
    if (!msg.trim()) return;
    const t = new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
    const ag = DB.agents.find(a => a.id === activeAgent);
    setChats(p => ({
      ...p, [activeAgent]: [...(p[activeAgent] || []),
      { role: "user", name: "You", content: msg, time: t },
      { role: "assistant", name: ag?.name, content: "[Connect your OpenAI key in Settings → AI & Agents to enable live responses]", time: t },
      ]
    }));
    setMsg("");
  };

  const agent = DB.agents.find(a => a.id === activeAgent);
  const msgs = chats[activeAgent] || [];
  const sc = { online: T.green, idle: T.amber, paused: T.t3 };

  const filteredAgents = DB.agents.filter(ag => {
    if (filter === "online") return ag.status === "online";
    if (filter === "unread") return (chats[ag.id] || []).some(m => m.role === "assistant");
    return true;
  });

  const addReaction = (agId, idx, emoji) => {
    const key = `${agId}-${idx}`;
    setReactions(p => { const curr = p[key] || []; return { ...p, [key]: curr.includes(emoji) ? curr.filter(e => e !== emoji) : [...curr, emoji] }; });
    setShowReactions(null);
  };

  const grouped = [{ date: "Today", messages: msgs }];

  const inboxSubTabs = [
    { id: "all",       label: "All",        icon: <Inbox size={16} />,  count: DB.agents.length },
    { id: "mentions",  label: "Mentions",   icon: <AtSign size={16} />, count: 2 },
    { id: "starred",   label: "Starred",    icon: <Star size={16} /> },
    { id: "archived",  label: "Archived",   icon: <Archive size={16} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Inbox</div>
          <div style={{ color: T.t2, fontSize: 13, marginTop: 2 }}>AI agents and conversations</div>
        </div>
        <Btn T={T} variant="primary"><Edit2 size={14} /> New message</Btn>
      </div>

      <SubNav T={T} tabs={inboxSubTabs} active={subTab} onChange={setSubTab} />

      <div style={{ paddingTop: 20, display: "flex", height: "calc(100vh - 240px)", minHeight: 460, gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", background: T.surface, boxShadow: T.shadow }}>

        {!isMobile && <div style={{ width: 268, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, background: T.raised }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: T.t3, display: "flex", pointerEvents: "none" }}><Search size={14} /></span>
              <input placeholder="Filter agents..." style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.t1, padding: "6px 10px 6px 30px", fontSize: 13, outline: "none", fontFamily: F.sans }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 4, padding: "8px 14px", borderBottom: `1px solid ${T.border}` }}>
            {[["all", "All"], ["online", "Online"], ["unread", "Unread"]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ padding: "3px 10px", borderRadius: 6, background: filter === v ? T.accentBg : "transparent", color: filter === v ? T.accent : T.t2, border: `1px solid ${filter === v ? T.accentBorder : T.border}`, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: F.sans, transition: "all .12s" }}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: "auto", background: T.surface }}>
            {filteredAgents.length === 0 && <div style={{ padding: 20, textAlign: "center", color: T.t3, fontSize: 12 }}>No agents match filter</div>}
            {filteredAgents.map(ag => {
              const active = activeAgent === ag.id;
              const lastMsg = (chats[ag.id] || []).slice(-1)[0];
              const unreadCount = (chats[ag.id] || []).filter(m => m.role === "assistant").length;
              return (
                <div key={ag.id} onClick={() => setActiveAgent(ag.id)}
                  style={{ padding: "11px 14px", borderBottom: `1px solid ${T.border}`, cursor: "pointer", background: active ? T.accentBg : "transparent", borderLeft: active ? `2px solid ${T.accent}` : "2px solid transparent", transition: "all .12s" }}
                  onMouseEnter={e => !active && (e.currentTarget.style.background = T.hover)}
                  onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.t2 }}><Bot size={17} /></div>
                      <span style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: sc[ag.status], border: `2px solid ${T.surface}` }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: T.t1, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ag.name}</span>
                        {lastMsg && <span style={{ color: T.t4, fontSize: 10, flexShrink: 0, marginLeft: 4 }}>{lastMsg.time}</span>}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                        <span style={{ color: T.t3, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{lastMsg?.content?.slice(0, 34) || ag.role}...</span>
                        {unreadCount > 0 && !active && <span style={{ background: T.accent, color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 600, padding: "1px 6px", flexShrink: 0, marginLeft: 4, minWidth: 16, textAlign: "center" }}>{unreadCount}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {agent && (
            <div style={{ padding: "11px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0, background: T.surface }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.t2 }}><Bot size={17} /></div>
                <span style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: sc[agent.status], border: `2px solid ${T.surface}` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isMobile ? (
                  <select value={activeAgent} onChange={e => setActiveAgent(e.target.value)}
                    style={{ width: "100%", background: T.raised, border: `1px solid ${T.border}`, borderRadius: 6, color: T.t1, padding: "4px 8px", fontSize: 13, fontWeight: 600, outline: "none", fontFamily: F.sans }}>
                    {DB.agents.map(a => <option key={a.id} value={a.id}>{a.name} · {a.status}</option>)}
                  </select>
                ) : (<>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: T.t1, fontSize: 14, fontWeight: 600 }}>{agent.name}</span>
                    <Badge T={T} color={sc[agent.status]}>{agent.status}</Badge>
                  </div>
                  <div style={{ color: T.t3, fontSize: 12 }}>{agent.role} · {agent.model}</div>
                </>)}
              </div>
              {!isMobile && <div style={{ display: "flex", gap: 5 }}>
                <Btn T={T} small variant="default">Traces</Btn>
                <Btn T={T} small variant="default">Configure</Btn>
              </div>}
            </div>
          )}

          <div style={{ flex: 1, overflow: "auto", padding: "16px 18px", background: T.canvas }} onClick={() => setShowReactions(null)}>
            {grouped.map(group => (
              <div key={group.date}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 14px" }}>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                  <span style={{ color: T.t3, fontSize: 11, fontWeight: 500, flexShrink: 0 }}>{group.date}</span>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                </div>
                {group.messages.map((m, i) => {
                  const isUser = m.role === "user";
                  const key = `${activeAgent}-${i}`;
                  const rxns = reactions[key] || [];
                  const prevRole = i > 0 ? group.messages[i - 1].role : null;
                  const sameAuthor = prevRole === m.role;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: sameAuthor ? 2 : 10, position: "relative" }}>
                      {!isUser && !sameAuthor && (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.t2, flexShrink: 0, alignSelf: "flex-end", marginRight: 8 }}><Bot size={14} /></div>
                      )}
                      {!isUser && sameAuthor && <div style={{ width: 36, flexShrink: 0 }} />}
                      <div style={{ maxWidth: "68%" }}>
                        {!sameAuthor && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, justifyContent: isUser ? "flex-end" : "flex-start" }}>
                            <span style={{ color: T.t1, fontSize: 12, fontWeight: 600 }}>{m.name}</span>
                            <span style={{ color: T.t3, fontSize: 11 }}>{m.time}</span>
                          </div>
                        )}
                        <div style={{ background: isUser ? T.accent : T.surface, color: isUser ? "#fff" : T.t1, border: isUser ? "none" : `1px solid ${T.border}`, borderRadius: 8, padding: "9px 13px", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                          {m.content}
                        </div>
                        {rxns.length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: isUser ? "flex-end" : "flex-start" }}>
                            {rxns.map(r => (
                              <span key={r} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 99, padding: "2px 7px", fontSize: 12, cursor: "pointer" }}
                                onClick={() => addReaction(activeAgent, i, r)}>{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div style={{ padding: "10px 16px", borderTop: `1px solid ${T.border}`, flexShrink: 0, background: T.surface }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
              {[[<Paperclip size={14} />, "Attach"], [<Smile size={14} />, "Emoji"], [<AtSign size={14} />, "Mention"], [<Code2 size={14} />, "Code"]].map(([icon, tip]) => (
                <button key={tip} title={tip} style={{ padding: "5px 8px", borderRadius: 6, background: "none", border: "none", cursor: "pointer", color: T.t3, display: "flex", transition: "all .12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.hover}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  {icon}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ color: T.t4, fontSize: 11, alignSelf: "center", fontFamily: F.mono }}>Enter ↵ to send</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                placeholder={`Message ${agent?.name || ""}...`}
                style={{ flex: 1, background: T.raised, border: `1px solid ${T.border}`, borderRadius: 6, color: T.t1, padding: "7px 13px", fontSize: 13, outline: "none", fontFamily: F.sans }} />
              <Btn T={T} variant="primary" onClick={send} disabled={!msg.trim()}>Send</Btn>
            </div>
          </div>
        </div>

        {!isMobile && <div style={{ width: 210, borderLeft: `1px solid ${T.border}`, padding: "14px", overflow: "auto", flexShrink: 0, background: T.raised }}>
          <div style={{ color: T.t1, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>About</div>
          {agent && (<>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.t2, margin: "0 auto 8px" }}><Bot size={24} /></div>
              <div style={{ color: T.t1, fontSize: 13, fontWeight: 600 }}>{agent.name}</div>
              <div style={{ color: T.t3, fontSize: 12, marginTop: 2 }}>{agent.role}</div>
              <div style={{ marginTop: 6 }}><Badge T={T} color={sc[agent.status]}>{agent.status}</Badge></div>
            </div>
            {[["Model", agent.model], ["Calls", agent.calls.toLocaleString()]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <div style={{ color: T.t3, fontSize: 11, marginBottom: 2 }}>{k}</div>
                <div style={{ color: T.t1, fontSize: 12, fontWeight: 500, fontFamily: F.mono }}>{v}</div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, marginTop: 4 }}>
              <div style={{ color: T.t1, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Quick actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <Btn T={T} small variant="default" full>View Traces</Btn>
                <Btn T={T} small variant="default" full>Configure</Btn>
                <Btn T={T} small variant="default" full>Pause</Btn>
              </div>
            </div>
          </>)}
        </div>}
      </div>
    </div>
  );
}