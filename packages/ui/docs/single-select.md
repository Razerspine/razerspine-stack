# Single Select Mixin (`+singleSelect`)

Renders a configurable `<select>` dropdown element. This mixin intelligently handles both simple and complex data
structures, automates internationalization for all options, and integrates with the reactive system.

---

## Parameters

| Parameter           | Type             | Default       | Description                                                              |
|:--------------------|:-----------------|:--------------|:-------------------------------------------------------------------------|
| **`id`**            | `String`         | *required*    | Unique identifier. Also used for the `name` attribute and label linking. |
| **`label`**         | `String \| null` | `null`        | Visible label text. Automatically assigned to `data-i18n`.               |
| **`options`**       | `Array`          | `[]`          | Array of strings or objects to populate the dropdown.                    |
| **`labelKey`**      | `String`         | `'text'`      | Key name in option objects for the visible text.                         |
| **`valueKey`**      | `String`         | `'value'`     | Key name in option objects for the `value` attribute.                    |
| **`selectedValue`** | `String`         | `''`          | The value that should be selected by default.                            |
| **`placeholder`**   | `String`         | `'Choose...'` | Text for the fallback option (when no selection is made).                |
| **`attrs`**         | `Object`         | `{}`          | Additional HTML attributes.                                              |
| **`bindings`**      | `Object`         | `{}`          | Reactive bindings for `@razerspine/runtime`.                             |

---

## Behavior & Features

### Default Validation

Unlike other inputs, the `singleSelect` has `required: true` set in its **base attributes**. This means the field is
mandatory unless explicitly overridden in the `attrs` parameter.

### Deep i18n Support

This mixin provides comprehensive translation support:

- **Label:** The `<label>` receives `data-i18n`.
- **Placeholder:** The default empty option receives `data-i18n`.
- **Options:** Every `<option>` generated from the `options` array receives a `data-i18n` attribute, ensuring the entire
  dropdown is translatable.

### Placeholder Logic

The "Choose an option" placeholder is rendered only if **both** `label` and `selectedValue` are absent. This option is:

- `disabled` and `hidden` (cannot be re-selected by the user).
- `selected` by default to trigger HTML5 validation if the field is required.

### Technical Attributes

For better integration with scripts and reactive models, each option also receives a `data-opt-value` attribute,
mirroring the standard `value`.

---

## Accessibility (A11y)

- **Strict Linking:** The `id` is used to perfectly sync the label and the select element.
- **Validation:** The use of a disabled/hidden empty value as the first option is a standard pattern for accessible "
  required" selects.

---

## Examples

### 1. Simple String Array

Each string is used as value, text, and i18n key.

```pug
+singleSelect('theme', 'Select Theme', ['Light', 'Dark'])
```

### 2. Complex Objects with i18n

Using custom keys for data mapping. Each option will get `data-i18n` from the `name` field.

```pug
- const roles = [{ id: 'adm', name: 'Administrator' }, { id: 'usr', name: 'Regular User' }];
+singleSelect('user-role', 'Role', roles, 'name', 'id', 'adm')
```

### 3. Reactive Binding and Custom Attributes

```pug
+singleSelect(
  'status', 
  null, 
  ['Active', 'Pending'], 
  'text', 
  'value', 
  '', 
  'Set Status', 
  { required: false, class: 'select--custom' }, 
  { model: 'item.status' }
)
```
