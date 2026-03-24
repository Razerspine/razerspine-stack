# Single Select Mixin (`+singleSelect`)

Renders a configurable `<select>` dropdown.

---

## Parameters:

- **options** (Array): Array of strings or objects.
- **labelKey / valueKey**: Keys used for displaying text and values (defaults to 'text' and 'value').
- **placeholder**: Text for the initial hidden placeholder option.

---

## Example:

```pug
+singleSelect('role', 'User Role', ['Admin', 'User'], 'text', 'value', '', '', {}, { model: 'user.role' })
```
