# Data Table Mixin (`+dataTable`)

Renders a flexible and configurable data table from an array of objects. It support automatic column detection, custom
cell formatting, and row-level actions with reactive bindings.

---

## Parameters

| Parameter      | Type                  | Default | Description                                                                                          |
|----------------|-----------------------|---------|------------------------------------------------------------------------------------------------------|
| **`items`**    | `Array`               | `[]`    | Array of objects to render as rows. Each object represents one row.                                  |
| **`columns`**  | `Array \| undefined`  | *auto*  | Optional ordered list of keys to use as columns. If omitted, unique keys are collected from `items`. |
| **`options`**  | `Object \| undefined` | `{}`    | Configuration object for headers, formatting, and actions (see [Options](#options) below).           |
| **`bindings`** | `Object \| null`      | `{}`    | Reactive bindings for the `<table>` element itself (e.g., `show`, `class`).                          |

---

## Options

The `options` object allows fine-grained control over the table behavior:

- **`emptyText`** (`String`): Text displayed in a single row when `items` is empty. Default: `'No data'`.
- **`showIndex`** (`Boolean`): If `true`, renders a leading column with the row index (1, 2, 3...). Default: `false`.
- **`labels`** (`Object`): Map of column keys to header display strings. Example: `{ user_id: 'ID' }`.
- **`formatters`** (`Object`): Map of column keys to functions for custom cell rendering.
  - *Example:* `{ price: v => `$${v.toFixed(2)}` }`.
- **`actions`** (`Array`): List of action objects rendered in the final column.

---

## Automatic Column Detection

When the `columns` parameter is omitted or `undefined`, the mixin automatically determines the table structure:

1. It iterates through all objects in the `items` array.
2. It collects every **unique key** found across all objects.
3. These keys are used as the column identifiers in the order they were first encountered.

> [!NOTE]
> If your data objects have inconsistent keys, automatic detection ensures all data is represented, but it's recommended
> to pass an explicit `columns` array for a predictable UI.

---

## Row Actions

Actions are rendered as `<a>` tags within a separate "Actions" column. Each action object supports:

| Property       | Type             | Description                                                               |
|----------------|------------------|---------------------------------------------------------------------------|
| **`label`**    | `String`         | The visible text of the link/button.                                      |
| **`url`**      | `Function(item)` | Callback returning the URL string based on the current row data.          |
| **`class`**    | `String`         | Optional CSS classes for the action link.                                 |
| **`bindings`** | `Function(item)` | Optional callback returning reactive bindings (e.g., `{ click: '...' }`). |

---

## Behavior & Features

- **Styling:** Automatically applies Bootstrap-like `.table` classes.
- **Empty States:** Renders a unified `colspan` row with `emptyText` if no data is present.
- **Reactive Integration:** Supports `@razerspine/runtime` bindings for both the table container and individual action
  elements via the `_mapRuntimeBindings` helper.

---

## Examples

### 1. Basic Usage

Renders all keys from the objects and controls table visibility reactively.

```pug
- const data = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
+dataTable(data, null, {}, { show: 'isTableVisible' })
```

### 2. Advanced Usage (Formatters & Actions)

Explicit columns, custom labels, and a delete action with a reactive click handler.

```pug
+dataTable(data, ['id', 'name', 'createdAt'], {
  showIndex: true,
  labels: { 
    name: 'Full Name',
    createdAt: 'Joined'
  },
  formatters: {
    createdAt: (val) => new Date(val).toLocaleDateString()
  },
  actions: [
    {
      label: 'Delete',
      class: 'btn btn--text-secondary',
      bindings: (item) => ({ click: `deleteUser(${item.id})` })
    }
  ]
})
```
