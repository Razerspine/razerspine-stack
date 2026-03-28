# FAQ

---

## Is this a replacement for Vite / CRA?

No.

`@razerspine/create` is not trying to replace tools like Vite or framework CLIs.

It is designed for:

- Pug-based workflows
- full control over webpack via `@razerspine/build`
- architecture-driven SPA / MPA setups
- CMS integrations and static/hybrid projects

This is a **low-level, flexible scaffolding tool**, not a zero-config framework generator.

---

## What is the difference between SPA and MPA?

### SPA (Single Page Application)

- Single HTML entry
- Client-side routing
- App bootstrap (`app.ts` / `app.js`)
- Powered by `@razerspine/runtime`
- Best for:
  - dashboards
  - web applications
  - complex UI flows

---

### MPA (Multi Page Application)

- Multiple HTML outputs
- Independent pages
- No client-side router required
- Lightweight runtime usage (optional)
- Best for:
  - marketing sites
  - landing pages
  - SEO-focused projects

---

## Why `--app-type` instead of auto-detection?

Explicit architecture selection ensures:

- predictable CLI behavior
- safer CI/CD pipelines
- better scalability (SSR, hybrid, future modes)

Architecture is treated as a **first-class concern**, not an implicit guess.

---

## Can I modify webpack config after creation?

Yes.

Projects generated with `@razerspine/create` are:

- fully editable
- not locked to any framework
- built on top of `@razerspine/build`

You have **full control over your build system**.

---

## Why Pug?

Pug is especially useful for:

- CMS-driven projects
- static site generation
- component-based markup systems
- layout-heavy applications

It enables:

- clean template composition
- reusable layout logic
- better readability for complex structures

---

## What is `@razerspine/runtime`?

`@razerspine/runtime` is a lightweight frontend runtime used in SPA templates.

It provides:

- dependency injection (DI)
- router
- reactive state/store
- component lifecycle
- view bindings

It is **not a framework**, but a minimal runtime layer for structured apps.

---

## Can I add React / Vue later?

Yes.

Since the build system is based on `@razerspine/build` (webpack), you can:

- integrate React / Vue / other frameworks
- extend loaders and plugins
- customize the pipeline

However, this starter is optimized for **template-driven architecture**, not framework-first development.

---

## Are templates linked to the CLI?

No.

Templates are:

- copied into your project
- fully independent after generation

There is **no runtime dependency on the CLI**.

---

## What packages are included in generated projects?

Depending on template, you will get:

- `@razerspine/build` — webpack abstraction layer
- `@razerspine/runtime` — SPA runtime (for SPA templates)
- `@razerspine/ui` — Pug UI components

---

## Where to report issues?

GitHub:
https://github.com/Razerspine/webpack-starter-monorepo/issues
