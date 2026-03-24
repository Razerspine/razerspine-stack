# Button Mixin (`+btn`)

Renders a configurable button with an optional icon and text. The visual appearance is primarily controlled by the
`variant` and `size` parameters and by CSS classes applied via `attrs` or global styles.

---

## Parameters

| Parameter      | Type             | Default              | Description                                                                                                                           |
|:---------------|:-----------------|:---------------------|:--------------------------------------------------------------------------------------------------------------------------------------|
| **`text`**     | `String \| null` | `null`               | Visible button text. If `null` or an empty string, the text node is omitted (icon-only button).                                       |
| **`variant`**  | `String`         | `'primary'`          | Visual variant modifier appended to `.btn--{variant}`. Common values: `primary`, `secondary`, `outline`, `text-primary`, `icon`, etc. |
| **`size`**     | `String`         | `'medium'`           | Size modifier appended to `.btn--{size}` and used for icon sizing `.icon--{size}`. Common: `small`, `medium`, `large`.                |
| **`attrs`**    | `Object \| null` | `{ type: 'button' }` | Attributes spread onto the `<button>` element via `&attributes(attrs)`. `attrs.class` is merged with base classes.                    |
| **`iconName`** | `String \| null` | `null`               | Icon name (without prefix). The mixin references `#icon-{iconName}` in the SVG sprite.                                                |
| **`bindings`** | `Object \| null` | `{}`                 | Reactive bindings for `@razerspine/runtime`. Maps keys to `data-*` attributes.                                                        |

---

## Behavior & Features

### Reactive Bindings

The mixin uses an internal `_mapRuntimeBindings` helper to process the `bindings` object into data attributes:

- `click` ➔ `data-click`
- `model` ➔ `data-model`
- `bind` ➔ `data-bind`
- `show` ➔ `data-show`
- `class` ➔ `data-class`
- `for` ➔ `data-for`

### SVG Sprite System

The project has migrated to an SVG sprite.

- The mixin references symbols by ID: `<use href="#icon-{iconName}">`.
- `xlink:href` is kept for legacy browser compatibility.
- **Note:** Ensure your sprite contains `<symbol id="icon-{name}">` entries.

---

## Accessibility (A11y)

- **Decorative Icons:** If the button has visible text, the SVG is treated as decorative and gets `aria-hidden="true"`
  so screen readers ignore it.
- **Icon-only Buttons:** If the button is icon-only (`text` is `null` or empty), the mixin will set an `aria-label` on
  the button if `attrs` does not already provide one.

> [!TIP]
> Always provide a meaningful `aria-label` in `attrs` for icon-only buttons for better accessibility.

---

## Examples

### Button with reactive click and visibility

```pug
+btn('Save', 'primary', 'medium', { type: 'submit' }, null, { click: 'save', show: 'isDirty' })
```

### Icon-only button with binding

```pug
+btn(null, 'icon-primary', 'small', {}, 'refresh', { click: 'reload' })
```
