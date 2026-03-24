ї# Single Select Mixin (`+singleSelect`)

Renders a configurable `<select>` dropdown element with an optional label. This mixin supports both simple arrays of
strings and complex arrays of objects, providing flexible mapping for display text and values.

---

## Parameters

| Parameter           | Type             | Default       | Description                                                                                       |
|---------------------|------------------|---------------|---------------------------------------------------------------------------------------------------|
| **`id`**            | `String`         | *required*    | Unique identifier for the select element. Used for `id`, `name`, and the label's `for` attribute. |
| **`label`**         | `String \| null` | `null`        | Visible label text. If `null` or empty, the `<label>` element is omitted.                         |
| **`options`**       | `Array`          | `[]`          | Data source for dropdown options. Can be an array of strings or objects.                          |
| **`labelKey`**      | `String`         | `'text'`      | The key name in option objects used for the visible text.                                         |
| **`valueKey`**      | `String`         | `'value'`     | The key name in option objects used for the `value` attribute.                                    |
| **`selectedValue`** | `String`         | `''`          | The value of the option that should be marked as `selected` by default.                           |
| **`placeholder`**   | `String`         | `'Choose...'` | Text for the initial placeholder option.                                                          |
| **`attrs`**         | `Object`         | `{}`          | Additional HTML attributes (e.g., `{ required: true }`).                                          |
| **`bindings`**      | `Object`         | `{}`          | Reactive bindings for `@razerspine/runtime`.                                                      |

---

## Behavior & Features

### Data Mapping

The mixin is designed to be highly adaptive to your data structure:

- **Array of Strings:** If `options` is an array of strings, each string is used for both the label and the value.
- **Array of Objects:** The mixin looks for `labelKey` and `valueKey` within each object to populate the `<option>`
  tags.

### Placeholder Logic

If no `selectedValue` is provided and a `placeholder` string is present, the mixin prepends a special `<option>`:

- It is typically disabled or hidden to encourage the user to make a valid selection.
- Default text is "Choose an option" if not specified.

### Styling & Integration

- **Base Class:** Automatically applies the `.single-select` CSS class.
- **Class Merging:** Custom classes in the `attrs` object are merged with the base `.single-select` class.
- **Reactive Bindings:** Uses `_mapRuntimeBindings` to handle directives like `model` (for two-way data binding),
  `show`, and `change`.

---

## Accessibility (A11y)

- **Labeling:** The mixin strictly associates the `<label>` with the `<select>` via the `id`.
- **Placeholder:** The placeholder option is handled in a way that doesn't interfere with required field validation in
  most modern browsers.

---

## Examples

### 1. Basic Select with Strings

A simple dropdown linked to a reactive user role model.

```pug
+singleSelect(
  'role', 
  'User Role', 
  ['Admin', 'Editor', 'Viewer'], 
  'text', 
  'value', 
  '', 
  'Select a role', 
  {}, 
  { model: 'user.role' }
)
```

### 2. Using Objects with Custom Keys

Mapping a list of countries where the data uses `id` and `name` fields.

```pug
- const countries = [{ id: 'ua', name: 'Ukraine' }, { id: 'us', name: 'USA' }];
+singleSelect(
  'country', 
  'Country', 
  countries, 
  'name', 
  'id', 
  'ua'
)
```

### 3. Required Select with Reactive Visibility

```pug
+singleSelect(
  'category', 
  'Category', 
  categories, 
  'title', 
  'slug', 
  '', 
  'Pick one...', 
  { required: true }, 
  { show: 'hasDepartmentSelected' }
)
```
