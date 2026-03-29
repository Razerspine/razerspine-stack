# Razerspine MPA Template

![Webpack](https://img.shields.io/badge/Webpack-5-blue?logo=webpack)
![Script](https://img.shields.io/badge/Script-JavaScript%20%7C%20TypeScript-3178C6)
![Styles](https://img.shields.io/badge/Styles-SCSS%20%7C%20LESS-CC6699)
![Pug](https://img.shields.io/badge/Template-Pug-A86454?logo=pug)
![Architecture](https://img.shields.io/badge/Architecture-MPA-111827)
![License](https://img.shields.io/badge/license-ISC-green)

Production-ready **Multi Page Application** powered by **Webpack 5**.

This template provides a clean **page-driven architecture** using:

* **Pug** for templating
* **SCSS or LESS** for styling
* **JavaScript or TypeScript** for scripting
* **Webpack 5** build pipeline
* **@razerspine/ui** UI system

---

# 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 📦 Project Structure

```
src/
  assets/
    i18n/
    icons/
    images/

  scripts/
    app.ts | app.js

  styles/
    main.scss | main.less

  views/
    layout/
    mixins/
    pages/
```

---

# 🧭 Page Architecture

Pages are located in:

```
src/views/pages/
```

Each page is a self-contained module.

Example:

```
views/pages/
  home/
    home.pug
    home.ts | home.js
    style.scss | style.less
```

Webpack automatically generates:

```
home.html
home.js
home.css
```

Each page can include:

* template
* page script
* page styles

---

# 🧱 Layout System

Layouts are located in:

```
src/views/layout/
```

Example structure:

```
layout/
  _base.pug
  _header.pug
  _footer.pug
  simple.pug
  index.pug
```

Pages extend layouts using Pug inheritance:

```pug
extends @views/layout/simple.pug
```

Architecture flow:

```
_base layout
   ↓
layout variant
   ↓
page template
```

---

# 🎨 UI System 

This template integrates:

```
@razerspine/ui
```

Features:

* design tokens
* light / dark themes
* layout utilities
* UI components
* utility classes
* Pug mixins

Main style entry:

```
src/styles/main.scss
```

Example import:

```scss
@use "@razerspine/ui/scss/ui" as *;
```

Optional bundled fonts:

```scss
@use "@razerspine/ui/scss/fonts";
@use "@razerspine/ui/scss/ui" as *;
```

---

# 🧩 Using Pug Components

Webpack alias is configured automatically.

Example usage:

```pug
include ~pug-mixins/btn.pug

+btn('Save', 'primary')
```

---

# ⚙ Runtime Services

This template includes lightweight runtime utilities from:

```
@razerspine/runtime
```

Available services:

* ConsoleLogger
* ThemeService
* TranslationService
* ApiService

Example:

```ts
import {ConsoleLogger} from '@razerspine/runtime';

const logger = new ConsoleLogger();
logger.success('Application started');
```

---

# 🌍 Internationalization

Translation files are located in:

```
src/assets/i18n/
```

Example usage in markup:

```html
<h1 data-i18n="hero.title"></h1>
```

---

# 🔗 Path Aliases

Preconfigured aliases:

```
@views
@styles
@scripts
@images
@icons
```

Example:

```ts
import {HomePage} from '@views/pages/home/home';
```

---

# 🏗 Architecture Principles

This application follows several key principles.

### Framework-agnostic

No framework lock-in.

### Page-driven MPA structure

Each page is an isolated entry.

### Minimal runtime

The CLI only generates projects.
Generated apps have **no runtime dependency on the CLI**.

### Modular UI system

Powered by:

```
@razerspine/ui
```

---

# 📄 License

ISC

---

Generated with **create**
