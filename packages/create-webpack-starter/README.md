# create-webpack-starter

Create a modern webpack project using ready-to-use, production-grade templates.

---

## 🚀 Quick Start

```bash
npx create-webpack-starter my-app
```

This starts the interactive setup where you choose:

- Style preprocessor (SCSS or Less)
- Script language (JavaScript or TypeScript)

---

## ⚙️ Non-interactive Usage (Recommended for CI)

```bash
npx create-webpack-starter my-app \
  --style scss \
  --script ts \
  --no-install
```

Both `--style` and `--script` must be provided together.

---

## 🧩 Options

| Option                   | Description                                                |
|--------------------------|------------------------------------------------------------|
| `--style <scss \| less>` | Select CSS preprocessor (required with `--script`)         |
| `--script <js \| ts>`    | Select script language (required with `--style`)           |
| `--no-install`           | Skip dependency installation                               |
| `--dry-run`              | Show what would be done without writing files              |

---

## 📦 Template System

Templates are resolved automatically based on selected features:

| Style | Script | Template Key    |
|-------|--------|-----------------|
| Less  | JS     | `pug-less-js`   |
| Less  | TS     | `pug-less-ts`   |
| SCSS  | JS     | `pug-scss-js`   |
| SCSS  | TS     | `pug-scss-ts`   |

Users do not select template names directly.  
The CLI resolves the correct template internally.

---

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [Getting Started](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/getting-started.md)
- [Templates](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/templates.md)
- [webpack-core](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/webpack-core.md)
- [FAQ](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/faq.md)
- [Testing](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/testing.md)

The documentation explains:

- how the CLI works internally
- how templates are structured
- design principles behind `@razerspine/webpack-core`
- common customization patterns

---

## 📋 Requirements

- Node.js >= 18
- npm / pnpm / yarn

---

## 🛠 How It Works

1. CLI resolves the template based on selected features
2. Template files are copied into the target directory
3. Dependencies are installed (unless disabled)
4. The project is ready to use

---

## 🎁 What You Get

- Preconfigured webpack setup
- Pug templates
- SCSS or Less support
- JavaScript or TypeScript support
- Production-ready build configuration
- Clean, fully standalone project

---

## 🧪 Testing

This project uses end-to-end (E2E) tests to verify real CLI behavior:

- project creation
- feature-based resolution
- dry-run behavior
- invalid flags handling
- unknown option handling

Tests simulate real `npx` usage and verify filesystem side effects.

---

## 📄 License

This project is licensed under the ISC License.
