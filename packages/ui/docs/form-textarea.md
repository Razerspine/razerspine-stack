# Form Textarea Mixin (`+formTextarea`)

Renders a configurable `<textarea>` element with an optional label and placeholder. It supports custom names and
reactive bindings.

---

## Parameters

- **id** (String): Unique identifier, also used for the label's `for` attribute. **Required**.
- **label** (String | null): Visible label text. If `null` or empty, no label is rendered. Default: `null`.
- **placeholder** (String): Placeholder text for the textarea. Default: `''`.
- **name** (String): Name attribute for form submission. Default: `''`.
- **attrs** (Object | null): Additional attributes to spread (e.g., `{ rows: 5 }`). Default: `{}`.
- **bindings** (Object | null): Reactive bindings from `@razerspine/runtime`. Default: `{}`.

---

## Behavior

- Uses `_mapRuntimeBindings` to process reactive directives.
- Automatically applies the `.form-textarea` base class.
- Correctly associates the label with the textarea element.

---

## Examples

```pug
// Textarea with reactive model binding
+formTextarea('comment', 'Comment', 'Enter here...', 'comment', {}, { model: 'post.comment' })

// Textarea with custom rows and visibility binding
+formTextarea('feedback', 'Feedback', '', 'feedback', { rows: 10 }, { show: 'isFeedbackVisible' })
```
