# STATE.md

## Current Objective

- **Skills layout:** repeatable procedures use **`.cursor/SKILLS.md`** (registry) plus **`.cursor/skills/<skill-id>/`** (`SKILL.md`, `assets/`, `references/`), mirroring **`.agents/skills/`**. Existing skills: `supabase-linked-migrations`, `vercel-deploy-workflow`.

## Active Items

- None. Resume normal project work; use this file for the next live task.

## Files in Active Use

- `.cursor/AGENTS.md`, `.cursor/USER.md`, `.cursor/STATE.md`, `.cursor/SKILLS.md`, `.cursor/TOOLS.md`, `.cursor/memory/MEMORY.md`
- `.cursor/skills/supabase-linked-migrations/`, `.cursor/skills/vercel-deploy-workflow/` (per-skill `SKILL.md`, `assets/`, `references/`)
- `.cursor/memory/memories/2026-04-17_1200_cursor-workspace-structure.md`, `2026-04-17_1430_skills-tools-canonical.md`, `2026-04-17_1515_cursor-layout-notes.md`, `2026-04-17_1600_supabase-context-handover.md`, `2026-04-17_1700_vercel-context-handover.md`, `2026-04-17_1800_cursor-skills-folder-layout.md`
- `.cursor/memory/runbooks/cursor-workspace.md`, `supabase-cli-macos.md`, `vercel-workflow.md`
- `.agents/SUPABASE_AGENT_HANDOVER.md`, `.agents/VERCEL_AGENT_HANDOVER.md`
- `.cursor/rules/root-canonical.mdc`, `skills-file.mdc`, `tools-file.mdc`, `core-operating-context.mdc`, `memory-governance.mdc`, `blocker-governance.mdc`, `runbook-governance.mdc`, `state-and-compactification.mdc` (always-on rules)

## Open Blockers

- None yet. Reference active blocker file paths here.

## Attempts Performed

- None yet. Record meaningful attempts only.

## Current Working State

- No active state recorded yet.

## Next Actions

- On the next task: set Current Objective and Active Items; add blocker files under `.cursor/memory/blockers/` if needed.

## Last Updated

- 2026-04-17 — Introduced **`.cursor/skills/<skill-id>/`** layout (`SKILL.md`, `assets/`, `references/`) mirroring `.agents/skills/`; root **`.cursor/SKILLS.md`** is the registry only; migrated Supabase + Vercel procedures into `supabase-linked-migrations` and `vercel-deploy-workflow`; updated rules (`skills-file.mdc`, `core-operating-context.mdc`, `root-canonical.mdc`, `state-and-compactification.mdc`), `AGENTS.md`, `MEMORY.md`, `USER.md`, `TOOLS.md`, handovers, runbooks.
- 2026-04-17 — Added **Vercel** handover (Git-connected deploys, `vercel` / `npx vercel` CLI, env pull, dashboard vs MCP) in `.agents/VERCEL_AGENT_HANDOVER.md`, `.cursor/TOOLS.md`, `.cursor/SKILLS.md`, `.cursor/memory/MEMORY.md`, `.cursor/memory/runbooks/vercel-workflow.md`, `.cursor/USER.md`.
- 2026-04-17 — Ingested **Supabase** migration workflow, linked `db push` / `migration list`, macOS **`npx`** CLI workaround (Gatekeeper kills raw binary), and pointers into `.cursor/TOOLS.md`, `.cursor/SKILLS.md`, `.cursor/memory/MEMORY.md`, `.cursor/memory/runbooks/supabase-cli-macos.md`, `.agents/SUPABASE_AGENT_HANDOVER.md`; corrected `.cursor/AGENTS.md` paths from `.agent/` to `.cursor/`.
- 2026-04-17 — Renamed `.agent/` tree to `.cursor/` for Cursor IDE; runbook and memory filenames use `cursor-*` where they denote this config bundle; paths use `.cursor/...`.
- 2026-04-17 — Renamed `.cursor/rules/*.md` to `*.mdc` (project rule file format); updated references in `MEMORY.md`, runbooks, memories, `STATE.md`.
- 2026-04-17 — Migrated canonical config to `.cursor/` (paths, filenames, repo folder, prose); updated `MEMORY.md`, runbooks, session memories.
- 2026-04-17 — Added `.cursor/SKILLS.md`, `.cursor/TOOLS.md`, and rules `root-canonical.mdc`, `skills-file.mdc`, `tools-file.mdc`; updated `AGENTS.md`, `core-operating-context.mdc`, `state-and-compactification.mdc`, `MEMORY.md`.
- 2026-04-17 — Flattened `.cursor/rules/` to top-level `<rule-name>.mdc` files (removed nested folders / `RULE.md`).
- 2026-04-17 — Created `.cursor/` layout, session memory and runbook `cursor-workspace`.

---
