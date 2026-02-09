# Getting Started

`create-webpack-starter` is a CLI tool to quickly scaffold a modern
webpack-based project using Pug templates and popular style/script stacks.

---

## Requirements

- Node.js >= 18
- npm (or pnpm / yarn)

---

## Create a project

```bash
npx create-webpack-starter my-app
cd my-app
npm run dev
```
#### This will:

* Ask you to choose a template 
* Copy the template files 
* Merge dependencies 
* Install packages 
* Prepare a ready-to-run project

---

## Available scripts

```bash
npm run dev      # start webpack-dev-server
npm run build    # production build
npm run preview  # serve dist folder locally
```

---

## Project structure (example)
```md
my-app/
├── src
│   ├── assets
│   │   ├── fonts
│   │   ├── i18n
│   │   ├── icons
│   │   ├── images
│   │   │   ├── favicons
│   │   ├── scripts
│   │   │   ├── modules
│   │   │   └── utils
│   │   └── styles
│   └── views
│       ├── layout
│       ├── mixins
│       └── pages
│           ├── 404
│           └── home
├── package.json
└── webpack.config.js
```

---

## Next steps

* Customize webpack.config.js
* Adjust aliases and paths
* Start building pages in src/views/pages
