# Data Table Mixin (`+dataTable`)

Renders a flexible and configurable data table from an array of objects. It supports automatic column detection, smart
data formatting, and row-level actions with reactive bindings.

---

## Parameters

| Parameter      | Type                  | Default | Description                                                                       |
|:---------------|:----------------------|:--------|:----------------------------------------------------------------------------------|
| **`items`**    | `Array`               | `[]`    | Array of objects to render as rows.                                               |
| **`columns`**  | `Array \| undefined`  | *auto*  | List of keys for columns. If omitted, unique keys are extracted from all `items`. |
| **`options`**  | `Object \| undefined` | `{}`    | Configuration object (see [Options](#options)).                                   |
| **`bindings`** | `Object \| null`      | `{}`    | Reactive bindings for the `<table>` element.                                      |

---

## Options

The `options` object provides the following controls:

- **`emptyText`** (`String`): Text shown when `items` is empty. Default: `'No data'`.
- **`showIndex`** (`Boolean`): Renders a `#` column with row indices. Default: `false`.
- **`labels`** (`Object`): Map of column keys to custom header text.
- **`formatters`** (`Object`): Functions to transform cell values. Example: `{ date: v => new Date(v).getFullYear() }`.
- **`actions`** (`Array`): List of action objects for the final column.

---

## Behavior & Features

### Smart Header Generation

If a label for a column is not provided in `options.labels`, the mixin "humanizes" the key:

- Replaces underscores with spaces.
- Capitalizes the first letter (e.g., `user_role` ➔ `User role`).

### Automatic Value Formatting

The mixin handles different data types inside cells automatically:

- **Arrays:** Joined into a string with commas (`, `).
- **Objects:** Rendered as a JSON string.
- **Empty values:** `null`, `undefined`, or `''` result in an empty cell.
- **HTML:** Values from formatters are rendered using `!=`, allowing custom HTML inside cells.

### Automatic Column Detection

If `columns` is not provided, the mixin reduces the entire `items` array to find every **unique key** present in any
object, ensuring no data is hidden even if objects have inconsistent structures.

---

## Row Actions

Actions are rendered as `<a>` tags. Each action supports:

| Property       | Type                       | Description                                                                         |
|----------------|----------------------------|-------------------------------------------------------------------------------------|
| **`label`**    | `String`                   | Visible text of the action.                                                         |
| **`url`**      | `Function(item)`           | Function that returns the `href` string. Default: `#`.                              |
| **`class`**    | `String`                   | CSS classes for the link.                                                           |
| **`bindings`** | `Function(item) \| Object` | Reactive bindings. Can be a static object or a function receiving the row's `item`. |

---

## Examples

### 1. Basic Usage (Auto-formatting)

The table will automatically join the `tags` array and humanize the `is_active` header.

```pug
- const data = [{ id: 1, tags: ['web', 'ui'], is_active: true }];
+dataTable(data)
```

### 2. Advanced Usage (Formatters & Actions)

```pug
+dataTable(data, ['id', 'name'], {
  showIndex: true,
  labels: { name: 'Full Name' },
  formatters: {
    name: (val) => `<strong>${val.toUpperCase()}</strong>`
  },
  actions: [
    {
      label: 'Delete',
      class: 'btn btn--danger',
      bindings: (item) => ({ click: `deleteUser(${item.id})` })
    }
  ]
})
```
