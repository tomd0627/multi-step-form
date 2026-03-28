# Multi-Step Form

A production-quality multi-step onboarding wizard built as a portfolio piece demonstrating the intersection of React, accessibility, and UX patterns that enterprise applications require daily.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + Vite 5 | Concurrent features, fast HMR |
| Language | TypeScript 5.5 (strict) | Full type safety, no `any` |
| Forms | React Hook Form v7 | Uncontrolled inputs, minimal re-renders |
| Validation | Zod v3 + @hookform/resolvers | Per-step schema slices, type inference |
| Animation | Framer Motion v11 | `AnimatePresence`, `layout`, reduced-motion support |
| Icons | Lucide React | MIT, tree-shakeable, consistent stroke weight |
| Styling | CSS Modules | Scoped styles, raw CSS skill, no framework dependency |
| Linting | ESLint 9 + jsx-a11y + typescript-eslint | Accessibility and type errors caught at lint time |

---

## Features

### UX
- 4-step wizard: Account Setup → Your Role → Preferences → Review & Confirm
- Bi-directional slide transitions (forward and backward) via Framer Motion `AnimatePresence`
- Card height animates dynamically to fit each step's content — no fixed container, no internal scrolling
- Completed steps are clickable in the progress bar for direct navigation
- Review step with inline "Edit" links that return directly to the edited step
- "Save & Return to Review" shortcut — editing from the review step skips re-navigating through subsequent steps
- Password strength meter with live feedback
- Animated success state on submission
- Light and dark mode with a toggle; preference persisted to `localStorage`

### Accessibility
- `aria-live="polite"` region announcing every step change and completion
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-valuetext`
- Completed step buttons carry `aria-label="Go back to step N: Label"` — not generic "clickable" labels
- `aria-current="step"` on the active step indicator
- `aria-invalid` + `aria-describedby` wired on every input via the `FormField` component
- `role="alert"` on field-level error messages (announced immediately on injection)
- `<fieldset>` + `<legend>` on all radio and checkbox groups (WCAG 1.3.1)
- Programmatic focus moves to the step `<h2>` on every transition (WCAG 2.4.3)
- Descriptive `aria-label` on all "Edit" buttons (`"Edit Account"`, not just `"Edit"`)
- `aria-pressed` on the theme toggle reflecting current state
- Password masked as `••••••••` in the review summary — never shown in plaintext
- `font-size: max(1rem, 16px)` on all inputs — prevents iOS Safari auto-zoom
- All contrast ratios meet WCAG AA (light mode: primary text ~10:1, accent ~7:1; dark mode: primary ~14:1, accent ~8:1)

### Performance & Animation
- `mode: 'onBlur'` validation — no aggressive on-keystroke errors
- `AnimatePresence mode="popLayout"` — exiting step removed from flow immediately, no empty-gap pause between transitions
- Framer Motion `layout="size"` on the card — height animates smoothly between steps and as validation errors appear/disappear
- `prefers-reduced-motion` via Framer Motion's `useReducedMotion` — all transitions become instant
- CSS custom properties for all design tokens — no runtime style computation
- Theme switching via `data-theme` attribute on `<html>` with CSS transitions — no JS style injection

---

## Setup

```bash
npm install
npm run dev
```

### Other scripts

```bash
npm run build        # Production build (TypeScript check + Vite)
npm run type-check   # TypeScript check only
npm run lint         # ESLint with jsx-a11y rules
npm run preview      # Serve the production build locally
```

---

## Project Structure

```
src/
├── components/
│   ├── MultiStepForm/
│   │   ├── index.tsx           — Orchestrator: AnimatePresence, layout animation, focus management
│   │   ├── variants.ts         — Framer Motion slide variants (defined outside component)
│   │   └── MultiStepForm.module.css
│   ├── steps/
│   │   ├── AccountSetup.tsx    — Step 1: name, email, password + strength meter
│   │   ├── YourRole.tsx        — Step 2: job title, department, company size
│   │   ├── Preferences.tsx     — Step 3: notifications, theme, timezone
│   │   ├── ReviewConfirm.tsx   — Step 4: summary with edit links
│   │   ├── SuccessState.tsx    — Animated completion screen
│   │   └── Step.module.css     — Shared step styles
│   └── ui/
│       ├── Button.tsx          — Primary and ghost variants
│       ├── FormField.tsx       — Input/select with aria wiring
│       ├── PasswordStrength.tsx — Derived strength indicator, no state
│       ├── ProgressBar.tsx     — Accessible role="progressbar" with clickable completed steps
│       └── ThemeToggle.tsx     — Light/dark toggle with aria-pressed
├── hooks/
│   ├── useFormStep.ts          — Step state machine: index, direction, data accumulator, returnToReview
│   └── useTheme.ts             — Theme toggle with localStorage persistence
├── schemas/
│   └── formSchema.ts           — Per-step Zod schemas + merged full schema
├── styles/
│   ├── tokens.css              — CSS custom properties for light and dark modes
│   └── global.css              — Reset, body, focus ring, .sr-only
└── types/
    └── form.types.ts           — Types inferred from Zod schemas (no duplication)
```

---

## Design

**Light mode by default** with a toggle to dark. Preference is saved to `localStorage`.

The palette uses warm amber on cream (light) and warm amber on deep charcoal (dark) — deliberately distinct from the teal/blue palette used across other projects in this portfolio. Typography pairs **DM Serif Display** (step headings) with **Inter** (UI text).
