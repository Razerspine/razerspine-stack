# Release Checklist

Use this checklist before publishing a new version.

---

## 1. Code readiness

- [ ] All changes are committed
- [ ] No work-in-progress code
- [ ] Branch is up to date with `main`

---

## 2. Versioning

- [ ] `package.json` version bumped correctly
- [ ] Version follows semver
- [ ] No existing npm release with this version

---

## 3. Documentation

- [ ] `CHANGELOG.md` updated
- [ ] Release notes are clear and complete
- [ ] README reflects current behavior

---

## 4. Local verification (optional but recommended)

```bash
npm install
npm run build
npm run test:e2e
```

---

## 5. Publish

- [ ] Open GitHub Actions
- [ ] Run **Publish** workflow manually
- [ ] Confirm npm publish in browser (2FA)
- [ ] Verify package on npmjs.com

---

## 6. Post-publish

- [ ] Install package via npx create-webpack-starter
- [ ] Smoke test generated project
- [ ] Celebrate responsibly 🎉
