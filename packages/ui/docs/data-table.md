# Data Table Mixin (`+dataTable`)

Renders a flexible data table based on an array of objects.

---

## Parameters:

- **items** (Array): Array of objects, where each object represents a row.
- **columns** (Array): List of keys to be used as columns. If omitted, keys are collected automatically.
- **options** (Object): Configuration (empty table text, index visibility, formatters, header labels, actions).
- **bindings** (Object): Reactive bindings for the table element.

---

## Actions:

You can pass a list of action objects to be rendered in the last column as links. Supports reactive click bindings for
each row item.

### Example:

```pug
+dataTable(data, ['id', 'name'], {
  showIndex: true,
  labels: { name: 'Full Name' },
  actions: [{ label: 'Delete', bindings: (item) => ({ click: `deleteUser(${item.id})` }) }]
})
```
