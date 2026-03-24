# Form Input Mixin (`+formInput`)

Renders a configurable `<input>` element with an optional label and placeholder. This mixin supports various input types, custom names, values, and reactive bindings.

---

## Parameters

- **type** (String): Input type attribute (e.g., 'text', 'email', 'password'). **Required**.
- **id** (String): Unique identifier for the element, also used for the label's `for` attribute. **Required**.
- **label** (String | null): Visible label text. If `null` or empty, no label is rendered. Default: `null`.
- **placeholder** (String): Text displayed inside the input when empty. Default: `''`.
- **name** (String): Name attribute for form submission. Default: `''`.
- **value** (String): Default value for the input field. Default: `''`.
- **attrs** (Object | null): Additional attributes to spread onto the input (e.g., `{ required: true }`). Default: `{}`.
- **bindings** (Object | null): Reactive bindings from `@razerspine/runtime` (e.g., `model` for two-way binding). Default: `{}`.

---

## Behavior

- Processes reactive directives using the `_mapRuntimeBindings` helper.
- Automatically merges the `.form-control` base class with any classes provided in `attrs`.
- Ensures the label is correctly associated with the input via the `id`.

---

## Examples

```pug
// Basic input with model binding
+formInput('text', 'user-name', 'Username', 'Enter name', 'username', '', {}, { model: 'user.name' })

// Required password input
+formInput('password', 'pass', 'Password', '', 'password', '', { required: true })
```
