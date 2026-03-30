# Release Checklist

Use this checklist before publishing a new version.

---

## 1. Code Readiness

- [ ] All changes are committed
- [ ] No work-in-progress code
- [ ] Branch is up to date with `main`
- [ ] No debug logs or temporary code left

---

## 2. Versioning

- [ ] `package.json` version bumped correctly
- [ ] Version follows semver
- [ ] Version does not already exist on npm
- [ ] All dependent packages updated (if required)

---

## 3. Documentation

- [ ] `CHANGELOG.md` updated
- [ ] Release notes are clear and complete
- [ ] README reflects current behavior
- [ ] `docs/` updated (if architecture or API changed)

---

## 4. CI Verification (Required)

- [ ] GitHub Actions CI is **green**
- [ ] All packages pass:
  - [ ] build
  - [ ] unit tests
  - [ ] integration tests
  - [ ] E2E tests

---

## 5. Local Verification (Recommended)

```bash
npm install
npm run build
npm run test
```

For CLI specifically:

```bash
npm run test:cli
```

Optional manual smoke test:

```bash
npm run create -- my-test-app --app-type spa --style scss --script ts
cd my-test-app
npm run dev
```

---

## 6. Release Order (Monorepo)

If multiple packages are updated, publish in this order:

1. `@razerspine/runtime`
2. `@razerspine/build`
3. `@razerspine/ui`
4. Update template dependency versions
5. `@razerspine/create-app`

---

## 7. Publish

### Step 1: Navigate to package

```bash
cd packages/<package-name>
```

Examples:

```bash
cd packages/runtime
cd packages/build
cd packages/ui
cd packages/create
```

### Step 2: Publish

```bash
npm publish --access public
```

- Confirm publish in browser (OIDC / 2FA)
- Ensure correct npm account is used

---

## 8. Post-Publish Verification

- [ ] Package is visible on npm
- [ ] Version is correct
- [ ] Install test works:
  ```bash
  npx @razerspine/create-app my-app
  ```
- [ ] Generated project runs:
  ```bash
  cd my-app
  npm install
  npm run dev
  ```

---

## 9. CLI-Specific Checks

If releasing `@razerspine/create-app`:

- [ ] Templates use correct package versions:
  - `@razerspine/runtime`
  - `@razerspine/build`
  - `@razerspine/ui`
- [ ] `--pm` flag works (`npm`, `pnpm`, `yarn`, `bun`)
- [ ] `--dry-run` works correctly
- [ ] `--no-install` works correctly
- [ ] E2E tests pass

---

## 10. Cleanup & Final Checks

- [ ] No temporary files left
- [ ] No local-only changes
- [ ] Git state is clean

---

## Done ✅

- [ ] Release verified
- [ ] Everything works as expected

Now you can celebrate (optionally with coffee ☕ instead of breaking production 😄)
