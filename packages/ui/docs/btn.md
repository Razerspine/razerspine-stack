# Button Mixin (`+btn`)

Renders a configurable button with an optional icon and text. The visual appearance is controlled by the variant and size parameters.

---

## Parameters:

- **text** (String | null): Visible button text. If `null`, the text is omitted (icon-only button).
- **variant** (String): Class modifier `.btn--{variant}` (e.g., 'primary', 'outline').
- **size** (String): Size modifier for the button and icon.
- **attrs** (Object | null): Attributes for the `<button>` element (`type`, `id`, `aria-*`, etc.).
- **iconName** (String | null): Icon name from the SVG sprite.
- **bindings** (Object | null): Reactive bindings for `@razerspine/runtime` (e.g., `click`, `show`).

---

## Features:

- Uses SVG sprite via `<use href="#icon-{name}">`.
- Automatically adds `aria-hidden="true"` to icons if text is present.
- For icon-only buttons, it automatically generates an `aria-label` from the icon name if not manually provided.

---

## Example:

```pug
+btn('Save', 'primary', 'medium', {type: 'submit'}, null, { click: 'save', show: 'isDirty' })
```
