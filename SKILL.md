# Beauty Blooms — UI/UX Iteration Skill

Workspace-scoped workflow for reviewing, debugging, and iterating on the Beauty Blooms
admin and customer surfaces. Built on top of two external skills:

- **taste-skill** — `https://github.com/Leonxlnx/taste-skill`
  Brief inference, redesign protocol, and the §14 pre-flight checklist used for
  every customer-facing page.
- **ui-ux-pro-max** — `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
  Design-system architecture, component specs, accessibility rules, used for the
  admin dashboard, tables, and forms.

## Design System: Modern Flora

**Aesthetic direction**: warm premium e-commerce, calm but trustworthy. Single accent
(bloom pink), supporting tones (gold + sage), opaque surfaces with subtle borders,
glass only on the cart drawer and sticky nav.

**Source of truth**: `tailwind.config.js` + `src/index.css :root`. The original
`stitch_theme.json` has been archived to `docs/archive/`.

### When making UI changes

1. **Read the room first** (taste-skill §0). Infer page kind, audience, and vibe before
   touching code. If ambiguous, ask **one** clarifying question.
2. **Use the token system, not raw hex**. Reference semantic Tailwind colors
   (`text-primary-700`, `bg-surface`, `border-border`) — never hardcode hex values
   in components. If a new color is needed, add it as a primitive in `:root` then
   map a semantic alias in `tailwind.config.js`.
3. **Prefer primitives**. Use `Button`, `Input`, `Tabs`, `Modal`, `Skeleton`,
   `EmptyState`, `Badge` from `src/components/ui/` instead of inlining custom
   buttons/inputs/etc.
4. **Run the §14 pre-flight** before merging customer-facing changes. The full
   checklist is in the taste-skill SKILL.md — key items:
   - Zero em-dashes on visible UI strings
   - Single accent color used consistently
   - Single radius system applied consistently
   - Hero: headline ≤ 2 lines, subtext ≤ 20 words, CTA visible without scroll
   - Eyebrow count ≤ ceil(sectionCount / 3) per page
   - Marquee max-one-per-page
   - Real images only (no div-based fake screenshots)
   - Every animation justifiable in one sentence

### When debugging UI issues

1. **Reproduce & capture** — open the dev server (`npm run dev`), reproduce, capture
   console errors and the failing URL.
2. **Locate source** — `tailwind.config.js`, `src/index.css`, and the nearest component.
3. **Hypothesize root cause** — common culprits:
   - Missing color token → check `tailwind.config.js` and `:root` in `src/index.css`
   - Modal freezes → check ancestor transforms; Modal already uses `createPortal` to `document.body`
   - Tailwind class silently dropped → v3 ignores unknown classes; check for typos or missing aliases
   - Glass effect on wrong surface → glass should only be on CartDrawer and sticky Navbar
4. **Implement minimal fix** — small, targeted edits. Prefer Edit tool over Write for
   single-line changes. Re-run `npm run dev` after each change.
5. **Validate visually** — reload, test across breakpoints, test keyboard nav and
   escape behavior for modals/drawers.
6. **Iterate & cleanup** — if duplicated inline styling exists, extract into a
   component class in `src/index.css @layer components`.
7. **Commit with clear message** explaining the change and root cause.

## Decision Points

| Symptom | Fix |
|---|---|
| Tailwind class silently has no effect | Check `tailwind.config.js` — is the token defined? Use a back-compat alias if migrating from old names |
| Modal visually frozen | Modal already uses `createPortal` — check if an ancestor has `transform` / `filter` / `perspective` |
| Component styling looks wrong after token change | Grep for legacy class names (`bg-primary-container`, `text-on-surface`, etc.) and migrate to new semantic names |
| Glass effect appearing unexpectedly | Glass classes (`glass-panel`, `glass-strong`) are reserved for CartDrawer and sticky Navbar — replace with `.card` elsewhere |
| Animation feels unmotivated | taste-skill §14: every animation must be justifiable in one sentence (hierarchy / storytelling / feedback / state transition) |

## Quality Criteria

- No console errors related to CSS, PostCSS, or Tailwind
- `npm run build` passes (no warnings about missing modules)
- `npm run lint` passes (0 errors, 0 warnings)
- All interactive elements have `:focus-visible` rings
- All form inputs have accessible labels (use `Input` primitive)
- All loading states use skeletons, not just spinners
- All error states use `role="alert"` and include an icon (never color alone)

## Files to Check First

- `tailwind.config.js` — token definitions
- `src/index.css` — primitive tokens, base styles, utilities, component classes
- `src/components/ui/` — primitives (Button, Input, Tabs, Modal, Skeleton, etc.)
- `src/components/layout/Navbar.jsx` — global chrome
- `src/pages/customer/HomePage.jsx` — primary landing surface
- `src/pages/admin/AdminDashboard.jsx` — primary admin surface

## Manual QA Checklist

Before pushing UI changes, verify:

- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Dev server starts: `npm run dev` → HTTP 200 on `/`, `/catalog`, `/admin/login`
- [ ] Mobile viewport (375px): nav collapses, no horizontal scroll, buttons tappable
- [ ] Tablet viewport (768px): nav inline, grid layouts adjust
- [ ] Desktop viewport (1280px): max-width container centers, no overflow
- [ ] Keyboard nav: tab through all interactive elements, escape closes Modal + CartDrawer
- [ ] Color contrast: primary text on background ≥ 4.5:1, button text on its bg ≥ 4.5:1
- [ ] Reduced motion: `prefers-reduced-motion` cuts all animations to 0.01ms
- [ ] No em-dashes in visible UI strings (em-dashes only allowed in code comments)

## Notes

- Keep fixes atomic — one logical change per commit.
- When adding tokens, place primitives in `src/index.css :root`, semantic aliases
  in `tailwind.config.js theme.extend.colors`, and component overrides in
  `src/index.css @layer components`. Never reference primitives directly in JSX.
- The legacy back-compat color aliases (`on-primary`, `surface-container-*`, etc.)
  in `tailwind.config.js` exist to keep Phase-0 components rendering during the
  migration. They can be removed once all components use the new semantic names.
