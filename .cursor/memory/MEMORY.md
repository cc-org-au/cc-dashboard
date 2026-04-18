# MEMORY.md

This file is a concise long-term memory index only.

- **Agent execution:** Run commands, start servers, apply migrations, and perform any other actions the agent can execute in this environment **without** asking the user to do them. Only ask when blocked by missing secrets, interactive auth, or another hard dependency on user action.

Rules:

- prepend new items to the top
- store only durable user instructions, preferences, standing directives, pivot decisions, architecture notes, and references to important dependent files
- do not store verbose project logs here
- do not store blocker narratives here
- do not store runbook-level solution detail here
- for project-specific history use `memory/memories/`
- for unresolved issue tracking use `memory/blockers/`
- for exact solution/process documentation use `memory/runbooks/`
- when referencing dependent detail, include the exact file path

- **Vercel (this repo):** Git push → deployments when the repo is connected; CLI `vercel link` / `vercel` / `vercel --prod`; env pull; operating from terminal vs MCP — `.agents/VERCEL_AGENT_HANDOVER.md`. Skill — `.cursor/skills/vercel-deploy-workflow/SKILL.md`; registry — `.cursor/SKILLS.md`. Tools — `.cursor/TOOLS.md`. Runbook — `.cursor/memory/runbooks/vercel-workflow.md`.

- **Supabase (this repo):** Full workflow, CLI on macOS (Gatekeeper / `npx`), migrations, linking, sync commands, and caveats — `.agents/SUPABASE_AGENT_HANDOVER.md`. Skill — `.cursor/skills/supabase-linked-migrations/SKILL.md`; registry — `.cursor/SKILLS.md`. Tools — `.cursor/TOOLS.md`. macOS CLI — `.cursor/memory/runbooks/supabase-cli-macos.md`. Upstream product patterns — `.agents/skills/supabase/SKILL.md`.

- Canonical workspace includes `.cursor/SKILLS.md` (skill **registry**), `.cursor/skills/<skill-id>/` (full procedures, `assets/`, `references/`), and `.cursor/TOOLS.md` (tool/capability registry); see `.cursor/AGENTS.md` and `.cursor/rules/root-canonical.mdc`.

- Canonical workspace operating layout lives under `.cursor/` (see `.cursor/AGENTS.md`, `.cursor/memory/runbooks/cursor-workspace.md`). Always-on rules include `root-canonical.mdc`, `core-operating-context.mdc`, `skills-file.mdc`, `tools-file.mdc`, `memory-governance.mdc`, `blocker-governance.mdc`, `runbook-governance.mdc`, `state-and-compactification.mdc`.

Initial retained directives:

- Use `.cursor/AGENTS.md`, `.cursor/USER.md`, `.cursor/STATE.md`, `.cursor/SKILLS.md`, `.cursor/TOOLS.md`, and `.cursor/memory/MEMORY.md` as canonical persistent operating context.
- Read active blocker files before each turn.
- Keep unresolved issue domains isolated in dedicated blocker files.
- Move blockers to `blockers-fixed/` only when the user verifies resolution.
- Preserve exact paths, files touched, changes made, and successful procedures in domain runbooks.
- Compact context proactively before automatic compactification would risk losing active state.

---
