# create-webpack-starter

Create a modern webpack project using ready-to-use templates.

---

## Usage

```bash
npx create-webpack-starter my-app
```

With options:

```bash
npx create-webpack-starter my-app \
--template pug-scss-ts \
--no-install
```

---

## Options

| Option              | Description                     |
| ------------------- | ------------------------------- |
| `--template <name>` | Skip prompt and select template |
| `--no-install`      | Skip dependency installation    |
| `--dry-run`         | Show what would be done         |

---

## Available templates
* pug-less-js
* pug-less-ts
* pug-scss-js
* pug-scss-ts

---

## Documentation

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

## Requirement
* Node.js >= 18
* npm/ pnpm/ yarn

---

## How it works
1. CLI copies the selected template
2. Template files are written to the target directory
3. Dependencies are installed (unless disabled)
4. Project is ready to use

---

## What you get
- Preconfigured webpack setup
- Pug templates
- SCSS / Less
- JavaScript or TypeScript
- Production-ready build

---

## 📄 License
This project is licensed under the ISC License.
