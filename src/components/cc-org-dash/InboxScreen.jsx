import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Btn, Badge, F, SubNav, SlideOver, Avi } from "./primitives";
import { DB, INBOX_THREADS, INBOX_WORKSPACES } from "./data";
import {
  Inbox,
  AtSign,
  Star,
  Archive,
  Search,
  Edit2,
  Paperclip,
  Smile,
  Code2,
  Bot,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Mail,
  Users,
  ChevronDown,
} from "./icons";

const RAIL = {
  nav: { open: 236, closed: 50 },
  list: { open: 308, closed: 50 },
  detail: { open: 292, closed: 50 },
};
const SW = 1.5;
const LS_NAV = "ccod_inbox_rail_nav";
const LS_LIST = "ccod_inbox_rail_list";
const LS_DETAIL = "ccod_inbox_rail_detail";

function loadRail(key, def = true) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return def;
    return v !== "0";
  } catch {
    return def;
  }
}

function statusColor(T, status) {
  if (status === "open") return T.accent;
  if (status === "pending") return T.amber;
  if (status === "on_hold") return T.t3;
  if (status === "solved") return T.green;
  return T.t3;
}

function priorityLabel(p) {
  if (p === "urgent") return "Urgent";
  if (p === "high") return "High";
  if (p === "normal") return "Normal";
  return "Low";
}

const INTERNAL_NOTES = {
  thag1: [{ author: "Sarah Mitchell", time: "Mon 10:12", text: "Legal signed off on DPA 2.1 — proceed with pricing." }],
  thag2: [{ author: "Priya Sharma", time: "Tue 14:02", text: "Waiting on Finance for Q1 actuals before we tighten the band." }],
  thag3: [{ author: "James Kowalski", time: "Wed 09:41", text: "Heap dump attached in Jira — pool leak in idle connections." }],
  thag4: [{ author: "Marco Reyes", time: "Today", text: "APAC queue spike — temp macro deployed." }],
  thag5: [{ author: "Admin", time: "Apr 17", text: "Auditor asked for evidence pack v3 — uploaded to shared drive." }],
};

function noteKey(threadId) {
  return threadId.replace(/-/g, "");
}

export default function InboxScreen({ T, isMobile }) {
  const [navOpen, setNavOpen] = useState(() => loadRail(LS_NAV, true));
  const [listOpen, setListOpen] = useState(() => loadRail(LS_LIST, true));
  const [detailOpen, setDetailOpen] = useState(() => loadRail(LS_DETAIL, true));
  const [workspaceId, setWorkspaceId] = useState("all");
  const [inboxView, setInboxView] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("newest");
  const [activeThreadId, setActiveThreadId] = useState(INBOX_THREADS[0]?.id ?? "");
  const [composeKind, setComposeKind] = useState("public");
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState(DB.chats);
  const [reactions, setReactions] = useState({});
  const [subTab, setSubTab] = useState("all");
  const [mobilePane, setMobilePane] = useState("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const endRef = useRef(null);

  const persistNav = useCallback((v) => {
    setNavOpen(v);
    try {
      localStorage.setItem(LS_NAV, v ? "1" : "0");
    } catch { /* ignore */ }
  }, []);
  const persistList = useCallback((v) => {
    setListOpen(v);
    try {
      localStorage.setItem(LS_LIST, v ? "1" : "0");
    } catch { /* ignore */ }
  }, []);
  const persistDetail = useCallback((v) => {
    setDetailOpen(v);
    try {
      localStorage.setItem(LS_DETAIL, v ? "1" : "0");
    } catch { /* ignore */ }
  }, []);

  const filteredThreads = useMemo(() => {
    let rows = [...INBOX_THREADS];
    if (workspaceId !== "all") rows = rows.filter((t) => t.projectId === workspaceId);
    if (inboxView === "mine") rows = rows.filter((t) => t.assignee === "Sarah Mitchell");
    if (inboxView === "unassigned") rows = rows.filter((t) => t.assignee === "Unassigned");
    if (statusFilter !== "all") rows = rows.filter((t) => t.status === statusFilter);
    if (channelFilter !== "all") rows = rows.filter((t) => t.channel === channelFilter);
    if (assigneeFilter !== "all") rows = rows.filter((t) => t.assignee === assigneeFilter);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.ticketId.toLowerCase().includes(q) ||
          t.requester.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q)
      );
    }
    if (sortKey === "oldest") rows.reverse();
    return rows;
  }, [workspaceId, inboxView, statusFilter, channelFilter, assigneeFilter, searchQuery, sortKey]);

  const assigneeList = useMemo(() => {
    const s = new Set(INBOX_THREADS.map((t) => t.assignee));
    return ["all", ...Array.from(s)];
  }, []);

  const filterPills = useMemo(() => {
    const pills = [];
    if (statusFilter !== "all") pills.push({ key: "st", label: `Status: ${statusFilter}`, clear: () => setStatusFilter("all") });
    if (channelFilter !== "all") pills.push({ key: "ch", label: `Channel: ${channelFilter}`, clear: () => setChannelFilter("all") });
    if (assigneeFilter !== "all") pills.push({ key: "as", label: `Assignee: ${assigneeFilter}`, clear: () => setAssigneeFilter("all") });
    if (inboxView !== "all") pills.push({ key: "iv", label: inboxView === "mine" ? "Assigned to me" : "Unassigned", clear: () => setInboxView("all") });
    pills.push({
      key: "sort",
      label: sortKey === "newest" ? "Newest" : "Oldest",
      clear: () => setSortKey(sortKey === "newest" ? "oldest" : "newest"),
    });
    return pills;
  }, [statusFilter, channelFilter, assigneeFilter, inboxView, sortKey]);

  useEffect(() => {
    if (!filteredThreads.some((t) => t.id === activeThreadId)) {
      setActiveThreadId(filteredThreads[0]?.id ?? "");
    }
  }, [filteredThreads, activeThreadId]);

  const thread = INBOX_THREADS.find((t) => t.id === activeThreadId);
  const activeAgent = thread?.agentId;
  const agent = activeAgent ? DB.agents.find((a) => a.id === activeAgent) : undefined;
  const msgs = activeAgent ? chats[activeAgent] || [] : [];
  const sc = { online: T.green, idle: T.amber, paused: T.t3 };

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [activeAgent, chats, activeThreadId]);

  useEffect(() => {
    if (isMobile && !thread && (mobilePane === "thread" || mobilePane === "detail")) {
      setMobilePane("list");
    }
  }, [isMobile, thread, mobilePane]);

  const send = () => {
    if (!msg.trim() || !activeAgent) return;
    const t = new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
    const ag = DB.agents.find((a) => a.id === activeAgent);
    const role = composeKind === "internal" ? "internal" : "user";
    const name = composeKind === "internal" ? "Internal note" : "You";
    setChats((p) => ({
      ...p,
      [activeAgent]: [
        ...(p[activeAgent] || []),
        { role, name, content: msg, time: t },
        ...(composeKind === "public"
          ? [{ role: "assistant", name: ag?.name, content: "[Connect your OpenAI key in Settings → AI & Agents to enable live responses]", time: t }]
          : []),
      ],
    }));
    setMsg("");
  };

  const addReaction = (agId, idx, emoji) => {
    const key = `${agId}-${idx}`;
    setReactions((p) => {
      const curr = p[key] || [];
      return { ...p, [key]: curr.includes(emoji) ? curr.filter((e) => e !== emoji) : [...curr, emoji] };
    });
  };

  const grouped = [{ date: "Today", messages: msgs }];

  const inboxSubTabs = [
    { id: "all", label: "All", icon: <Inbox size={16} />, count: INBOX_THREADS.length },
    { id: "mentions", label: "Mentions", icon: <AtSign size={16} />, count: 2 },
    { id: "starred", label: "Starred", icon: <Star size={16} /> },
    { id: "archived", label: "Archived", icon: <Archive size={16} /> },
  ];

  const notes = INTERNAL_NOTES[noteKey(activeThreadId)] || [];

  const EmptyMain = (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 24,
        background: T.canvas,
        color: T.t3,
        textAlign: "center",
        overflow: "auto",
      }}
    >
      <Inbox size={36} color={T.t4} />
      <div style={{ fontSize: 15, fontWeight: 600, color: T.t2 }}>No ticket in view</div>
      <div style={{ fontSize: 13, maxWidth: 280 }}>Adjust filters or select a ticket from the list.</div>
    </div>
  );

  const navW = navOpen ? RAIL.nav.open : RAIL.nav.closed;
  const listW = listOpen ? RAIL.list.open : RAIL.list.closed;
  const detailW = detailOpen ? RAIL.detail.open : RAIL.detail.closed;

  const NavSections = (
    <>
      {navOpen && (
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.t4, marginBottom: 8, paddingLeft: 2 }}>WORKSPACE</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: navOpen ? 14 : 6 }}>
        {INBOX_WORKSPACES.map((w) => {
          const on = workspaceId === w.id;
          return (
            <button
              key={w.id}
              type="button"
              title={w.label}
              onClick={() => setWorkspaceId(w.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: navOpen ? "7px 10px" : "8px 6px",
                justifyContent: navOpen ? "flex-start" : "center",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontFamily: F.sans,
                fontSize: 13,
                fontWeight: on ? 600 : 500,
                color: on ? T.accent : T.t2,
                background: on ? T.accentBg : "transparent",
                transition: "background .12s, color .12s",
              }}
            >
              <span style={{ fontSize: 14, opacity: 0.9 }}>◇</span>
              {navOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.label}</span>}
            </button>
          );
        })}
      </div>

      {navOpen && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.t4, marginBottom: 8, paddingLeft: 2 }}>INBOX</div>}
      {[
        ["all", "All", INBOX_THREADS.length],
        ["mine", "Assigned to me", INBOX_THREADS.filter((t) => t.assignee === "Sarah Mitchell").length],
        ["unassigned", "Unassigned", INBOX_THREADS.filter((t) => t.assignee === "Unassigned").length],
      ].map(([id, label, count]) => {
        const on = inboxView === id;
        return (
          <button
            key={id}
            type="button"
            title={label}
            onClick={() => setInboxView(id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: navOpen ? "space-between" : "center",
              padding: navOpen ? "7px 10px" : "8px 6px",
              marginBottom: 2,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: F.sans,
              fontSize: 13,
              fontWeight: on ? 600 : 500,
              color: on ? T.t1 : T.t2,
              background: on ? T.surface : "transparent",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {navOpen ? (
              <>
                <span>{label}</span>
                <span style={{ fontSize: 12, color: T.t4, fontVariantNumeric: "tabular-nums" }}>{count}</span>
              </>
            ) : (
              <Inbox size={16} color={on ? T.accent : T.t3} />
            )}
          </button>
        );
      })}

      {navOpen && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.t4, margin: "14px 0 8px", paddingLeft: 2 }}>STATUS</div>}
      {["all", "open", "pending", "on_hold"].map((st) => {
        const on = statusFilter === st;
        const lab = st === "all" ? "All" : st.replace("_", " ");
        return (
          <button
            key={st}
            type="button"
            title={lab}
            onClick={() => setStatusFilter(st)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: navOpen ? "6px 10px" : "8px 6px",
              marginBottom: 2,
              justifyContent: navOpen ? "flex-start" : "center",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: F.sans,
              fontSize: 12,
              fontWeight: on ? 600 : 500,
              color: on ? T.t1 : T.t3,
              background: "transparent",
              width: "100%",
            }}
          >
            {st !== "all" && <span style={{ width: 8, height: 8, borderRadius: 2, background: statusColor(T, st), flexShrink: 0 }} />}
            {navOpen && <span style={{ textTransform: "capitalize" }}>{lab}</span>}
          </button>
        );
      })}

      {navOpen && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.t4, margin: "14px 0 8px", paddingLeft: 2 }}>CHANNEL</div>}
      {[
        ["all", "All"],
        ["email", "Email"],
        ["slack", "Slack"],
        ["web", "Web"],
      ].map(([id, lab]) => {
        const on = channelFilter === id;
        return (
          <button
            key={id}
            type="button"
            title={lab}
            onClick={() => setChannelFilter(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: navOpen ? "6px 10px" : "7px 6px",
              marginBottom: 2,
              justifyContent: navOpen ? "flex-start" : "center",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: F.sans,
              fontSize: 12,
              color: on ? T.accent : T.t3,
              fontWeight: on ? 600 : 500,
              background: on ? T.accentBg : "transparent",
              width: "100%",
            }}
          >
            {id === "email" && <Mail size={14} color={on ? T.accent : T.t3} />}
            {id === "slack" && <span style={{ fontSize: 12 }}>#</span>}
            {id === "web" && <span style={{ fontSize: 12 }}>⌁</span>}
            {id === "all" && navOpen && <span>All</span>}
            {id !== "all" && navOpen && <span>{lab}</span>}
          </button>
        );
      })}

      {navOpen && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.t4, margin: "14px 0 8px", paddingLeft: 2 }}>TEAM</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {assigneeList.slice(1, 6).map((name) => {
          const on = assigneeFilter === name;
          const person = DB.people.find((p) => p.name === name);
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => setAssigneeFilter(on ? "all" : name)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: navOpen ? "4px 6px" : "6px 4px",
                justifyContent: navOpen ? "flex-start" : "center",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: on ? T.accentBg : "transparent",
                width: "100%",
              }}
            >
              <Avi name={name} size={navOpen ? 26 : 22} />
              {navOpen && (
                <span style={{ fontSize: 12, color: on ? T.accent : T.t2, fontWeight: on ? 600 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {person?.name ?? name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );

  const ThreadList = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, flexShrink: 0, background: T.surface }}>
        {listOpen && (
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.t3, display: "flex", pointerEvents: "none" }}>
              <Search size={14} />
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets & requesters…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: T.raised,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                color: T.t1,
                padding: "8px 10px 8px 32px",
                fontSize: 13,
                outline: "none",
                fontFamily: F.sans,
              }}
            />
          </div>
        )}
      </div>
      {listOpen && (
        <div style={{ padding: "8px 12px 10px", borderBottom: `1px solid ${T.border}`, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", background: T.canvas }}>
          {filterPills.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={p.clear}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 99,
                border: `1px solid ${T.border}`,
                background: T.surface,
                color: T.t2,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: F.sans,
              }}
            >
              {p.label}
              <span style={{ color: T.t4, fontSize: 12 }}>×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSortKey((k) => (k === "newest" ? "oldest" : "newest"))}
            style={{
              marginLeft: "auto",
              padding: "4px 8px",
              borderRadius: 6,
              border: `1px solid ${T.borderMuted ?? T.border}`,
              background: "transparent",
              color: T.t3,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: F.sans,
            }}
          >
            Sort · {sortKey}
          </button>
        </div>
      )}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowX: "hidden",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: T.surface,
        }}
      >
        {filteredThreads.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: T.t3, fontSize: 13 }}>No tickets match filters</div>
        )}
        {filteredThreads.map((th) => {
          const ag = DB.agents.find((a) => a.id === th.agentId);
          const active = activeThreadId === th.id;
          const lastMsg = (chats[th.agentId] || []).slice(-1)[0];
          return (
            <div
              key={th.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveThreadId(th.id);
                if (isMobile) setMobilePane("thread");
              }}
              onKeyDown={(e) => e.key === "Enter" && setActiveThreadId(th.id)}
              style={{
                padding: "11px 12px",
                borderBottom: `1px solid ${T.border}`,
                cursor: "pointer",
                background: active ? T.accentBg : "transparent",
                borderLeft: active ? `3px solid ${T.accent}` : "3px solid transparent",
                transition: "background .12s",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: T.raised,
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.t2,
                    }}
                  >
                    <Bot size={17} />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: -1,
                      right: -1,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: sc[ag?.status] ?? T.t3,
                      border: `2px solid ${T.surface}`,
                    }}
                  />
                </div>
                {listOpen && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.t2, fontFamily: F.mono }}>{th.ticketId}</span>
                      <span style={{ fontSize: 10, color: T.t4, flexShrink: 0 }}>{th.updated}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{th.subject}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                      <Badge T={T} color={statusColor(T, th.status)}>{th.status.replace("_", " ")}</Badge>
                      <span style={{ fontSize: 11, color: T.t3 }}>{th.channel}</span>
                      <span style={{ fontSize: 11, color: T.t4 }}>· {th.requester}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: T.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lastMsg?.content?.slice(0, 52) || ag?.role}…
                      </span>
                      {th.unread > 0 && !active && (
                        <span
                          style={{
                            background: T.accent,
                            color: "#fff",
                            borderRadius: 99,
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "1px 7px",
                            flexShrink: 0,
                            minWidth: 18,
                            textAlign: "center",
                          }}
                        >
                          {th.unread}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const DetailPanel = thread && (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        padding: "12px 14px",
        boxSizing: "border-box",
      }}
    >
      {detailOpen && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.t1 }}>Requester</div>
            <Btn T={T} small variant="default">
              <Edit2 size={12} /> Edit
            </Btn>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <Avi name={thread.requester} size={40} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: T.t1, fontSize: 14 }}>{thread.requester}</div>
              <div style={{ fontSize: 12, color: T.t3 }}>Via {thread.channel} · {thread.updated}</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {[
              ["Ticket", thread.ticketId],
              ["Channel", thread.channel],
              ["Project", thread.project],
              ["Assignee", thread.assignee],
              ["Priority", priorityLabel(thread.priority)],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, color: T.t4, marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 13, color: T.t1, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.t4, marginBottom: 8 }}>TAGS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {["enterprise", thread.status, thread.channel].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: T.raised,
                  border: `1px solid ${T.border}`,
                  color: T.t2,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.t1, marginBottom: 8 }}>Internal notes</div>
            {notes.map((n, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < notes.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Avi name={n.author} size={22} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.t1 }}>{n.author}</div>
                    <div style={{ fontSize: 10, color: T.t4 }}>{n.time}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T.t2, lineHeight: 1.5 }}>{n.text}</div>
              </div>
            ))}
            <input
              placeholder="Write a note…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.raised,
                color: T.t1,
                fontSize: 12,
                fontFamily: F.sans,
                outline: "none",
              }}
            />
          </div>
        </>
      )}
    </div>
  );

  const ChatHeader = agent && thread && (
    <div
      style={{
        padding: "10px 14px",
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
        background: T.surface,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {isMobile && mobilePane === "thread" && (
        <button
          type="button"
          onClick={() => setMobilePane("list")}
          style={{
            border: "none",
            background: T.raised,
            borderRadius: 8,
            padding: "6px 8px",
            cursor: "pointer",
            color: T.t2,
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Back to list"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 700, color: T.accent }}>{thread.ticketId}</span>
          <Badge T={T} color={statusColor(T, thread.status)}>{thread.status.replace("_", " ")}</Badge>
          <span style={{ fontSize: 11, color: T.t4 }}>{priorityLabel(thread.priority)}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.t1, letterSpacing: "-0.02em" }}>{thread.subject}</div>
        <div style={{ fontSize: 12, color: T.t3, marginTop: 4 }}>
          {agent.name} · {agent.model} · Assigned to {thread.assignee}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
        <Btn T={T} small variant="default">
          Pause
        </Btn>
        <Btn T={T} small variant="default">
          Close <ChevronDown size={12} />
        </Btn>
        {!isMobile && (
          <Btn T={T} small variant="default">
            <Users size={14} />
          </Btn>
        )}
        {isMobile && (
          <Btn T={T} small variant="primary" onClick={() => setMobilePane("detail")}>
            Details
          </Btn>
        )}
      </div>
    </div>
  );

  const MessageArea = (
    <div style={{ flex: 1, minHeight: 0, overflow: "auto", WebkitOverflowScrolling: "touch", padding: "14px 16px", background: T.canvas }}>
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          color: T.t4,
          marginBottom: 12,
          padding: "6px 12px",
          background: T.surface,
          borderRadius: 8,
          border: `1px dashed ${T.border}`,
          maxWidth: 420,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Ticket thread · messages sync with {agent?.name}. Treat each conversation as a ticketed item.
      </div>
      {grouped.map((group) => (
        <div key={group.date}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 14px" }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ color: T.t3, fontSize: 11, fontWeight: 500, flexShrink: 0 }}>{group.date}</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>
          {group.messages.map((m, i) => {
            const isUser = m.role === "user";
            const isInternal = m.role === "internal";
            const key = `${activeAgent}-${i}`;
            const rxns = reactions[key] || [];
            const prevRole = i > 0 ? group.messages[i - 1].role : null;
            const sameAuthor = prevRole === m.role;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isUser || isInternal ? "flex-end" : "flex-start",
                  marginBottom: sameAuthor ? 2 : 10,
                  position: "relative",
                }}
              >
                {!isUser && !isInternal && !sameAuthor && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.t2,
                      flexShrink: 0,
                      alignSelf: "flex-end",
                      marginRight: 8,
                    }}
                  >
                    <Bot size={14} />
                  </div>
                )}
                {!isUser && !isInternal && sameAuthor && <div style={{ width: 36, flexShrink: 0 }} />}
                <div style={{ maxWidth: "72%" }}>
                  {!sameAuthor && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                        justifyContent: isUser || isInternal ? "flex-end" : "flex-start",
                      }}
                    >
                      <span style={{ color: T.t1, fontSize: 12, fontWeight: 600 }}>{m.name}</span>
                      <span style={{ color: T.t3, fontSize: 11 }}>{m.time}</span>
                    </div>
                  )}
                  <div
                    style={{
                      background: isInternal ? T.amber + "22" : isUser ? T.accent : T.surface,
                      color: isUser ? "#fff" : T.t1,
                      border: isInternal ? `1px solid ${T.amber}55` : isUser ? "none" : `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: "9px 13px",
                      fontSize: 13,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.content}
                  </div>
                  {rxns.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: isUser ? "flex-end" : "flex-start" }}>
                      {rxns.map((r) => (
                        <span
                          key={r}
                          style={{
                            background: T.surface,
                            border: `1px solid ${T.border}`,
                            borderRadius: 99,
                            padding: "2px 7px",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                          onClick={() => addReaction(activeAgent, i, r)}
                        >
                          {r}
                        </span>
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
  );

  const Composer = (
    <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, flexShrink: 0, background: T.surface, minWidth: 0 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setComposeKind("public")}
          style={{
            padding: "5px 12px",
            borderRadius: 8,
            border: `1px solid ${composeKind === "public" ? T.accent : T.border}`,
            background: composeKind === "public" ? T.accentBg : "transparent",
            color: composeKind === "public" ? T.accent : T.t3,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: F.sans,
          }}
        >
          Public reply
        </button>
        <button
          type="button"
          onClick={() => setComposeKind("internal")}
          style={{
            padding: "5px 12px",
            borderRadius: 8,
            border: `1px solid ${composeKind === "internal" ? T.amber : T.border}`,
            background: composeKind === "internal" ? T.amber + "18" : "transparent",
            color: composeKind === "internal" ? T.amber : T.t3,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: F.sans,
          }}
        >
          Internal note
        </button>
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
        {[
          [<Paperclip size={14} />, "Attach"],
          [<Smile size={14} />, "Emoji"],
          [<AtSign size={14} />, "Mention"],
          [<Code2 size={14} />, "Code"],
        ].map(([icon, tip]) => (
          <button
            key={tip}
            title={tip}
            type="button"
            style={{ padding: "5px 8px", borderRadius: 6, background: "none", border: "none", cursor: "pointer", color: T.t3, display: "flex", transition: "all .12s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            {icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ color: T.t4, fontSize: 11, alignSelf: "center", fontFamily: F.mono }}>Enter ↵ to send</span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={composeKind === "internal" ? "Add an internal note (not sent to requester)…" : "Type '/' to use a macro or template…"}
          rows={2}
          style={{
            flex: 1,
            resize: "vertical",
            minHeight: 44,
            maxHeight: 120,
            background: T.raised,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            color: T.t1,
            padding: "9px 12px",
            fontSize: 13,
            outline: "none",
            fontFamily: F.sans,
            lineHeight: 1.5,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "flex-end" }}>
          <Btn T={T} variant="default" small>
            Macro
          </Btn>
          <Btn T={T} variant="primary" onClick={send} disabled={!msg.trim()}>
            {composeKind === "internal" ? "Add note" : "Send"}
          </Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
        overflow: "hidden",
        gap: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8, flexShrink: 0 }}>
        <div>
          <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Inbox</div>
          <div style={{ color: T.t2, fontSize: 13, marginTop: 2 }}>Ticketed conversations across workspaces</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isMobile && (
            <Btn T={T} variant="default" onClick={() => setFiltersOpen(true)}>
              <PanelLeft size={14} /> Views
            </Btn>
          )}
          <Btn T={T} variant="primary">
            <Edit2 size={14} /> New ticket
          </Btn>
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <SubNav T={T} tabs={inboxSubTabs} active={subTab} onChange={setSubTab} />
      </div>

      <div
        style={{
          marginTop: 20,
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: 0,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          overflow: "hidden",
          background: T.surface,
          boxShadow: T.shadow,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Left nav rail */}
        {!isMobile && (
          <aside
            style={{
              flex: "0 0 auto",
              width: navW,
              minWidth: 0,
              maxWidth: navW,
              minHeight: 0,
              transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRight: `1px solid ${T.borderMuted ?? T.border}`,
              background: T.raised,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: navOpen ? "space-between" : "center",
                padding: navOpen ? "10px 10px 10px 12px" : "12px 8px",
                borderBottom: navOpen ? `1px solid ${T.borderMuted ?? T.border}` : "none",
                flexShrink: 0,
              }}
            >
              {navOpen && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <PanelLeft size={17} strokeWidth={SW} color={T.t2} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>Views</span>
                </div>
              )}
              <button
                type="button"
                title={navOpen ? "Collapse views" : "Expand views"}
                onClick={() => persistNav(!navOpen)}
                style={{
                  border: "none",
                  background: T.surface,
                  borderRadius: 8,
                  padding: 6,
                  cursor: "pointer",
                  color: T.t2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {navOpen ? <ChevronLeft size={18} strokeWidth={SW} /> : <ChevronRight size={18} strokeWidth={SW} />}
              </button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: navOpen ? "12px 10px 16px" : "10px 6px 16px" }}>{NavSections}</div>
          </aside>
        )}

        {/* Thread list rail */}
        {(!isMobile || mobilePane === "list") && (
          <aside
            style={{
              ...(isMobile
                ? { flex: "1 1 0%", width: "100%", minWidth: 0 }
                : {
                    flex: "0 0 auto",
                    width: listW,
                    maxWidth: listW,
                    minWidth: 0,
                  }),
              flexShrink: isMobile ? 1 : undefined,
              minHeight: 0,
              transition: isMobile ? undefined : "width 0.22s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRight: isMobile ? "none" : `1px solid ${T.borderMuted ?? T.border}`,
              background: T.surface,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: listOpen ? "space-between" : "center",
                padding: listOpen ? "10px 12px" : "12px 8px",
                borderBottom: listOpen ? `1px solid ${T.borderMuted ?? T.border}` : "none",
                flexShrink: 0,
                background: T.raised,
              }}
            >
              {listOpen && <span style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>Tickets</span>}
              {!isMobile && (
                <button
                  type="button"
                  title={listOpen ? "Collapse list" : "Expand list"}
                  onClick={() => persistList(!listOpen)}
                  style={{
                    border: "none",
                    background: T.surface,
                    borderRadius: 8,
                    padding: 6,
                    cursor: "pointer",
                    color: T.t2,
                    display: "flex",
                  }}
                >
                  {listOpen ? <ChevronLeft size={18} strokeWidth={SW} /> : <ChevronRight size={18} strokeWidth={SW} />}
                </button>
              )}
            </div>
            {ThreadList}
          </aside>
        )}

        {/* Main chat */}
        {(!isMobile || mobilePane === "thread" || mobilePane === "detail") && (
          <div
            style={{
              flex: "1 1 0%",
              minWidth: 0,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: T.surface,
              position: "relative",
              zIndex: 1,
              boxSizing: "border-box",
            }}
          >
            {(!isMobile || mobilePane === "thread") &&
              (thread && agent ? (
                <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {ChatHeader}
                  {MessageArea}
                  {Composer}
                </div>
              ) : (
                EmptyMain
              ))}
            {isMobile && mobilePane === "detail" && (
              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: T.raised, overflow: "hidden" }}>
                <div style={{ padding: 12, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setMobilePane("thread")}
                    style={{ border: "none", background: T.surface, borderRadius: 8, padding: 6, cursor: "pointer", color: T.t2 }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span style={{ fontWeight: 600, color: T.t1 }}>Ticket details</span>
                </div>
                <div style={{ flex: 1, overflow: "auto" }}>{DetailPanel}</div>
              </div>
            )}
          </div>
        )}

        {/* Right details rail */}
        {!isMobile && (
          <aside
            style={{
              flex: "0 0 auto",
              width: detailW,
              minWidth: 0,
              maxWidth: detailW,
              minHeight: 0,
              transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
              borderLeft: `1px solid ${T.borderMuted ?? T.border}`,
              background: T.raised,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: detailOpen ? "space-between" : "center",
                padding: detailOpen ? "10px 12px" : "12px 8px",
                borderBottom: detailOpen ? `1px solid ${T.borderMuted ?? T.border}` : "none",
                flexShrink: 0,
              }}
            >
              {!isMobile && (
                <button
                  type="button"
                  title={detailOpen ? "Collapse details" : "Expand details"}
                  onClick={() => persistDetail(!detailOpen)}
                  style={{
                    border: "none",
                    background: T.surface,
                    borderRadius: 8,
                    padding: 6,
                    cursor: "pointer",
                    color: T.t2,
                    display: "flex",
                    order: detailOpen ? 0 : 1,
                  }}
                >
                  {detailOpen ? <ChevronRight size={18} strokeWidth={SW} /> : <ChevronLeft size={18} strokeWidth={SW} />}
                </button>
              )}
              {detailOpen && <span style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>Details</span>}
              {detailOpen && <div style={{ width: 28 }} />}
            </div>
            {DetailPanel}
          </aside>
        )}
      </div>

      <SlideOver T={T} open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Views & filters" subtitle="Workspace, inbox, status, channels">
        <div style={{ padding: "4px 0 24px" }}>{NavSections}</div>
      </SlideOver>
    </div>
  );
}
