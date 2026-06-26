# UI/UX Pro — Skill

Related repo: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

Purpose
- Capture a repeatable, workspace-scoped workflow for reviewing, debugging, and iterating small UI/UX changes (styling, modals, responsive tweaks, Tailwind tokens).
- Provide a checklist and example prompts the agent or developer can reuse to speed triage and fixes.

Scope
- Workspace-scoped skill saved at the project root as `SKILL.md`.
- Target audience: engineers and design-focused maintainers working on the Beaut_Blooms app.

When to use
- A UI change breaks layout, a modal freezes, Tailwind classes fail to build, or a component UX needs consistent styling.

Workflow (step-by-step)
1. Reproduce & capture
   - Open the app locally (dev server) and reproduce the issue.
   - Capture console/build errors and the failing URL or component path.
2. Locate source
   - Search for related component(s) and style tokens (Tailwind classes, CSS utilities).
   - Inspect `tailwind.config.js`, `src/index.css`, and nearest component files.
3. Hypothesize root cause
   - Check for missing color tokens, broken @apply, transform/position issues, portal usage, or CSS specificity conflicts.
4. Implement minimal fix
   - Prefer small, targeted edits: add missing tokens, move modal to portal, adjust overflow/position, or swap classes.
   - Run dev server and confirm styles compile and errors clear.
5. Validate visually
   - Reload the page, verify behavior across viewport sizes, and test keyboard/escape/overlay interactions for modals.
6. Iterate & cleanup
   - If duplicated styling exists, extract a utility class (e.g., `btn-glass`) into `src/index.css`.
   - Update tests or add a short manual QA checklist.
7. Commit with clear message and summary of the change and why it fixes the root cause.

Decision points & branching
- If the error is a Tailwind build error referencing a missing class: update `tailwind.config.js` color tokens or define the custom utility in `@layer`.
- If a modal is visually frozen: check ancestor transforms and move modal to `document.body` via `createPortal`.
- If multiple components use the same custom inline style: extract into a reusable class and replace occurrences.

Quality criteria / completion checks
- No errors in browser console related to CSS/PostCSS/Tailwind.
- Component behavior restored (modals scroll, buttons clickable, layout stable at small and large breakpoints).
- No duplicated inline styles remain; shared utilities created when appropriate.
- Changes are minimal and targeted; unrelated files not modified.

Example prompts
- "Help me debug a Tailwind build error: `text-charcoal-900` not found — locate uses and add tokens." 
- "Convert modal component to use React portal to avoid transform-scoped positioning issues." 
- "Make `Discover` button match `View Featured` — extract a `btn-glass` class and replace duplicates." 

Files to check (quick list)
- `tailwind.config.js`
- `src/index.css`
- `src/components/ui/Modal.jsx`
- `src/pages/customer/HomePage.jsx`
- `src/components/layout/Navbar.jsx`

Follow-ups & customizations
- Add a `SKILL.tests.md` with quick manual QA steps for common issues (Tailwind tokens, modals, buttons).
- Create a reusable generator snippet to scaffold `btn-glass` and common portal patterns.

Notes
- Keep fixes atomic and run the dev server to validate after each change.
- When adding tokens to `tailwind.config.js`, place them under `theme.extend.colors` and keep naming consistent with existing palette.

---
Generated from recent troubleshooting patterns in this workspace. Adjust wording or steps to match your team's conventions if desired.
