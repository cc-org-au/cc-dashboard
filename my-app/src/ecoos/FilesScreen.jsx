import { useState } from "react";
import { Btn, Badge, Avi, Modal, F, SubNav } from "./primitives";
import { FILE_FOLDERS, FILE_DATA, FILE_ICONS } from "./data";
import { FolderOpen, Clock, Star, Upload, LayoutGrid, List, Plus, ChevronRight } from "../icons";

export default function FilesScreen({ T, isMobile }) {
  const [folder, setFolder] = useState("root");
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [uploadModal, setUploadModal] = useState(false);
  const [subTab, setSubTab] = useState("all");

  const files = FILE_DATA[folder] || FILE_DATA.root;
  const selFile = selectedFile ? [...Object.values(FILE_DATA).flat()].find(f => f.id === selectedFile) : null;

  const subTabs = [
    { id: "all",     label: "All files",  icon: <FolderOpen size={16} />, count: files.length },
    { id: "recent",  label: "Recent",     icon: <Clock size={16} /> },
    { id: "starred", label: "Starred",    icon: <Star size={16} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: T.t1, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Files</div>
          <div style={{ color: T.t2, fontSize: 13, marginTop: 2 }}>{files.length} items in {folder === "root" ? "All Files" : folder}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn T={T} small variant="default" onClick={() => setViewMode(v => v === "list" ? "grid" : "list")}>
            {viewMode === "list" ? <><LayoutGrid size={13} /> Grid</> : <><List size={13} /> List</>}
          </Btn>
          <Btn T={T} small variant="default"><Plus size={13} /> New folder</Btn>
          <Btn T={T} variant="primary" onClick={() => setUploadModal(true)}><Upload size={14} /> Upload</Btn>
        </div>
      </div>

      <SubNav T={T} tabs={subTabs} active={subTab} onChange={setSubTab} />

      <div style={{ paddingTop: 20, display: "flex", gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", background: T.surface, boxShadow: T.shadow, minHeight: 460 }}>
        {!isMobile && <div style={{ width: 192, borderRight: `1px solid ${T.border}`, flexShrink: 0, paddingTop: 8, background: T.raised }}>
          <div style={{ padding: "6px 14px 8px", color: T.t2, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</div>
          {FILE_FOLDERS.map(f => (
            <button key={f.id} onClick={() => { setFolder(f.id); setSelectedFile(null); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "6px 14px", background: folder === f.id ? T.accentBg : "none", border: "none",
                borderLeft: folder === f.id ? `2px solid ${T.accent}` : "2px solid transparent",
                color: folder === f.id ? T.accent : T.t1, fontSize: 13, fontWeight: folder === f.id ? 600 : 400,
                cursor: "pointer", fontFamily: F.sans, textAlign: "left", transition: "all .1s"
              }}
              onMouseEnter={e => folder !== f.id && (e.currentTarget.style.background = T.hover)}
              onMouseLeave={e => folder !== f.id && (e.currentTarget.style.background = "none")}>
              <span>{f.icon}</span>{f.label}
              {FILE_DATA[f.id] && <span style={{ marginLeft: "auto", color: T.t3, fontSize: 11 }}>{FILE_DATA[f.id].length}</span>}
            </button>
          ))}
        </div>}

        <div style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
          <div style={{ padding: "9px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 6, background: T.raised }}>
            <span style={{ color: T.accent, fontSize: 13, fontWeight: 500 }}>Files</span>
            <ChevronRight size={12} color={T.t3} />
            <span style={{ color: T.t1, fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{folder === "root" ? "All" : folder}</span>
          </div>

          {viewMode === "list" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                {["Name", "Size", "Modified", "Owner", "Shared"].map(h => (
                  <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: T.t2, borderBottom: `1px solid ${T.border}`, background: T.raised, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.id} onClick={() => setSelectedFile(f.id === selectedFile ? null : f.id)}
                    style={{ background: selectedFile === f.id ? T.accentBg : "transparent", cursor: "pointer", transition: "background .1s" }}
                    onMouseEnter={e => selectedFile !== f.id && (e.currentTarget.style.background = T.raised)}
                    onMouseLeave={e => selectedFile !== f.id && (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 17 }}>{FILE_ICONS[f.type] || FILE_ICONS.default}</span>
                        <span style={{ color: T.accent, fontSize: 13, fontWeight: 500 }}>{f.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", color: T.t3, fontSize: 12, fontFamily: F.mono, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{f.size}</td>
                    <td style={{ padding: "10px 14px", color: T.t3, fontSize: 12, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{f.modified}</td>
                    <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avi name={f.owner} size={20} /><span style={{ color: T.t2, fontSize: 12 }}>{f.owner.split(" ")[0]}</span></div>
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}` }}>
                      {f.shared > 0 ? <Badge T={T}>{f.shared} people</Badge> : <span style={{ color: T.t4, fontSize: 12 }}>Only you</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 14, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
              {files.map(f => (
                <div key={f.id} onClick={() => setSelectedFile(f.id === selectedFile ? null : f.id)}
                  style={{ padding: "16px 10px", background: selectedFile === f.id ? T.accentBg : T.raised, border: `1px solid ${selectedFile === f.id ? T.accentBorder : T.border}`, borderRadius: 8, cursor: "pointer", textAlign: "center", transition: "all .15s" }}
                  onMouseEnter={e => selectedFile !== f.id && (e.currentTarget.style.background = T.hover)}
                  onMouseLeave={e => selectedFile !== f.id && (e.currentTarget.style.background = T.raised)}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{FILE_ICONS[f.type] || FILE_ICONS.default}</div>
                  <div style={{ color: T.t1, fontSize: 11, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  <div style={{ color: T.t3, fontSize: 10, marginTop: 2 }}>{f.size}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isMobile && <div style={{ width: selFile ? 228 : 0, flexShrink: 0, borderLeft: `1px solid ${T.border}`, overflow: "hidden", transition: "width .2s", background: T.raised }}>
          {selFile && (
            <div style={{ width: 228, padding: "16px" }}>
              <div style={{ textAlign: "center", padding: "20px 0 14px", borderBottom: `1px solid ${T.border}`, marginBottom: 12 }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>{FILE_ICONS[selFile.type] || FILE_ICONS.default}</div>
                <div style={{ color: T.t1, fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{selFile.name}</div>
                <div style={{ color: T.t3, fontSize: 12 }}>{selFile.size}</div>
              </div>
              {[["Type", selFile.type], ["Modified", selFile.modified], ["Owner", selFile.owner], ["Shared", selFile.shared > 0 ? `${selFile.shared} people` : "Only you"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
                  <span style={{ color: T.t3 }}>{k}</span><span style={{ color: T.t1, fontWeight: 500, textAlign: "right", maxWidth: "55%", wordBreak: "break-word" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                <Btn T={T} small variant="primary" full>Download</Btn>
                <Btn T={T} small variant="default" full>Share</Btn>
                <Btn T={T} small variant="default" full>Rename</Btn>
                <Btn T={T} small variant="danger" full>Delete</Btn>
              </div>
            </div>
          )}
        </div>}
      </div>

      <Modal T={T} open={uploadModal} onClose={() => setUploadModal(false)} title="Upload Files">
        <div style={{ border: `2px dashed ${T.border}`, borderRadius: 8, padding: "36px", textAlign: "center", marginBottom: 16, cursor: "pointer", transition: "border-color .15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
          <Upload size={28} color={T.t3} style={{ margin: "0 auto 8px" }} />
          <div style={{ color: T.t1, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Drop files here</div>
          <div style={{ color: T.t3, fontSize: 12 }}>or click to browse</div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn T={T} variant="default" onClick={() => setUploadModal(false)}>Cancel</Btn>
          <Btn T={T} variant="primary" onClick={() => setUploadModal(false)}>Upload</Btn>
        </div>
      </Modal>
    </div>
  );
}