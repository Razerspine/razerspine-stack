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

### Automatic i18n Support

The mixin automatically handles translation attributes:
- **With text:** Adds `data-i18n="{text}"` to the button.
- **Icon-only:** Generates a label from `iconName` (e.g., `arrow-left` ➔ `arrow left`), sets it as `aria-label`, and adds `data-i18n-attr="aria-label"`.

### Reactive Bindings

Mapped via `_mapRuntimeBindings` into `data-*` attributes:
- `click`, `model`, `bind`, `show`, `class`, `for`.

### SVG Sprite System

- References symbols via `<use href="#icon-{iconName}">`.
- Includes `xlink:href` for legacy support.
- Icons receive the `.button-icon` class and size-specific class.

---

## Accessibility (A11y)

- **Decorative:** If text is present, SVG is hidden via `aria-hidden="true"`.
- **Informative:** If icon-only, SVG gets `role="img"` and the button gets an `aria-label`.
- **Smart Fallback:** If no `aria-label` is provided for an icon-only button, it is automatically generated from the `iconName`.

> [!IMPORTANT]
> The mixin checks for `aria-label`, `ariaLabel`, or `aria-labelledby` in `attrs` before generating a fallback.

---

## Examples

### Button with i18n and Binding

```pug
//- Automatically gets data-i18n="Save"
+btn('Save', 'primary', 'medium', { type: 'submit' }, null, { click: 'save' })
```

### Icon-only Button with Generated Label

```pug
//- Gets aria-label="refresh", role="img" for SVG, and i18n attributes
+btn(null, 'icon-primary', 'small', {}, 'refresh', { click: 'reload' })
```

### Custom Accessibility Label

```pug
+btn(null, 'icon', 'medium', { 'aria-label': 'Close Sidebar' }, 'close')
```
