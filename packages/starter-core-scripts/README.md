# @razerspine/starter-core-scripts

[![npm version](https://img.shields.io/npm/v/@razerspine/starter-core-scripts.svg)](https://www.npmjs.com/package/@razerspine/starter-core-scripts)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/starter-core-scripts.svg)](./LICENSE)

Core frontend services used by official webpack starter templates.

This package provides production-ready utilities for:

- Theme management
- Internationalization (i18n)
- API requests
- Console logging

Designed for modern frontend bundlers (Webpack, Vite, Rollup).

---

## Installation

```bash
npm install @razerspine/starter-core-scripts
```

---

## Exports

```ts
import {
  ThemeService,
  TranslationService,
  ApiService,
  ApiError,
  ConsoleLogger
} from '@razerspine/starter-core-scripts';
```

---

## ThemeService

Manages light/dark theme state with optional localStorage persistence.

```ts
const theme = new ThemeService();
theme.init();
theme.setTheme('dark');
```

---

## TranslationService

Provides DOM-based i18n support using `data-i18n` attributes.

```ts
const locales = {
  en: { greeting: { hello: 'Hello' } },
  uk: { greeting: { hello: 'Привіт' } }
};

const i18n = new TranslationService(locales);
i18n.init();
```

---

## ApiService

**Lightweight Fetch wrapper with**:

- Query params support
- Timeout via AbortController
- Automatic JSON handling
- Centralized error handling
- Optional Bearer token

```ts
const api = new ApiService('https://api.example.com');
api.setToken('jwt-token');

try {
  const users = await api.get('/users', {
    params: { role: 'admin' },
    timeout: 5000
  });
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.data);
  }
}
```

---

## ConsoleLogger

Styled console logging utility.

```ts
const logger = new ConsoleLogger();
logger.success('Application initialized');
```

---

## Features

- ESM + CJS builds
- Full TypeScript support
- Tree-shakeable
- No runtime side effects
- No global pollution

---

## Requirements

- Modern browser (Fetch API support)
- TypeScript 5+
- Bundler environment recommended

---

## License
This project is licensed under the ISC License.
