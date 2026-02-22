# FAQ

---

## Is this a replacement for Vite / CRA?

No.

This tool focuses on:

- Pug-based workflows
- webpack control and customization
- CMS integrations
- static and hybrid projects
- architecture-driven SPA / MPA setups

It is not a zero-config frontend framework generator.

---

## What is the difference between SPA and MPA?

### SPA
- Single HTML entry
- Client-side routing
- App bootstrap (`app.ts` / `app.js`)
- Router configuration
- Best for applications and dashboards

### MPA
- Multiple HTML outputs
- Independent pages
- No client-side router
- Best for marketing sites and SEO-driven projects

---

## Why `--app-type` instead of auto-detection?

Explicit architecture selection makes:

- CLI behavior predictable
- CI configuration safer
- Future expansion easier (SSR, hybrid modes, etc.)

Architecture is a first-class dimension.

---

## Can I modify webpack config after creation?

Yes.

Generated projects are fully editable.
No hidden abstractions.
No framework lock-in.

---

## Why Pug?

Pug is widely used in:

- CMS theming
- static site generation
- component-based markup systems
- large layout-driven projects

It allows clean template composition and reusable layout logic.

---

## Can I add React / Vue later?

Yes.

But this starter is optimized for template-driven workflows.
If your primary goal is SPA framework development,
consider Vite or framework CLIs instead.

---

## Are templates linked to the CLI?

No.

Templates are copied into your project.
After generation, your project has no dependency on the CLI.

---

## Where to report issues?

GitHub:
https://github.com/Razerspine/webpack-starter-monorepo/issues
