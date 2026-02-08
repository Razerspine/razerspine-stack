# @razerspine/pug-ui-kit

A professional, full-featured UI Kit for Pug (Jade) templates, including flexible mixins and complete styling support (SCSS/LESS).
Designed to work seamlessly with the [Webpack Starter Monorepo](https://github.com/Razerspine/webpack-starter-monorepo)

## 📦 Installation

This package is automatically included in templates generated via the CLI. To install it manually:

```bash
npm install @razerspine/pug-ui-kit
```

## 🛠 Webpack Configuration

### 1. Webpack (Pug Mixins)

To avoid complex relative paths, use the includePaths provided by the package:

```js
const uiKit = require('@razerspine/pug-ui-kit');

module.exports = {
  // ...
  resolve: {
    alias: {
      // Points to the directory containing all .pug mixins
      'pug-ui-kit': uiKit.paths.mixins,
    },
  },
};
```

### 2. Styles (SCSS/LESS)
The package provides full styling for all components.
If you only need specific parts (e.g., just variables and the table), you can import them individually.

Note: Always import settings first, as other components depend on them.

#### For SCSS:

```scss
// In your main.scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

#### For LESS:

```less
// In your main.less
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

## 🚀 Usage

#### Button

```pug
//- Renders a configurable button with optional icon and text. Visual appearance
//- is primarily controlled by the `variant` and `size` parameters and by CSS
//- classes applied via `attrs` or global styles.
//-
//- NOTE: project migrated to an SVG sprite. The mixin references symbols by id
//- using <use href="#icon-{iconName}"> (xlink:href kept for legacy browsers).
//- Ensure your sprite contains <symbol id="icon-{name}"> entries.
//-
//- Parameters:
//-   text        - **String | null** — Visible button text. If `null` or an empty
//-                 string, the text node is omitted (icon-only button).
//-                 Default: null
//-   variant     - **String** — Visual variant modifier appended to `.btn--{variant}`.
//-                 Common values: 'primary', 'secondary', 'outline', 'text-primary',
//-                 'text-secondary', 'icon-primary', 'icon-secondary', 'icon-outline', 'icon'.
//-                 Default: 'primary'
//-   size        - **String** — Size modifier appended to `.btn--{size}` and used
//-                 for icon sizing `.icon--{size}`. Common values: 'small', 'medium', 'large'.
//-                 Default: 'medium'
//-   attrs       - **Object | null** — Attributes to spread onto the `<button>`
//-                 element via `&attributes(attrs)`. Use this to pass `type`,
//-                 `id`, `aria-*`, `data-*`, etc. If `null`, no attributes are spread.
//-                 If `attrs.class` is present it will be merged with the base classes.
//-                 Default: { type: 'button' }
//-   iconName    - **String | null** — Icon name (without prefix). The mixin uses
//-                 `#icon-{iconName}` in <use> to reference the SVG sprite symbol.
//-                 If `null`, no icon is rendered.
//-                 Default: null
//-
//- Accessibility notes:
//-   - If the button has visible text, the SVG is treated as decorative and gets
//-     `aria-hidden="true"` so screen readers ignore it.
//-   - If the button is icon-only (text === null or empty), the mixin will set
//-     `aria-label` on the button if `attrs` does not already provide one. Provide
//-     a meaningful `aria-label` in `attrs` for icon-only buttons.
//-
//- Behavior summary:
//-   - Computes `hasText` to decide whether to render the text node.
//-   - Builds base classes and safely merges any `attrs.class` with them.
//-   - Renders <svg><use href="#icon-{iconName}" xlink:href="#icon-{iconName}"></use></svg>
//-     when `iconName` is provided.
//-   - Sets `aria-hidden` on the SVG when text is present; ensures icon-only buttons
//-     have an accessible label.

include ~pug-ui-kit/btn.pug

+btn('Save', 'primary', 'small', { type: 'submit' })
```

#### Data Table (New in v1.1.0)

```pug
//- Renders a flexible table from an array of objects. Columns are derived
//- from the provided `columns` array or automatically collected from object keys.
//-
//- Parameters:
//-   items       - **Array** — Array of objects to render as rows. Each object
//-                 represents one row.
//-                 Default: []
//-   columns     - **Array | undefined** — Optional ordered list of keys to use
//-                 as columns. If omitted, unique keys are collected from `items`.
//-                 Default: auto-collected from items
//-   options     - **Object | undefined** — Configuration options:
//-                 - emptyText: **String** — Text shown when no rows; Default: 'No data'.
//-                 - showIndex: **Boolean** — Render leading index column; Default: false.
//-                 - formatters: **Object** — Map of column -> function(value) for custom rendering.
//-                   Example: { createdAt: v => new Date(v).toLocaleDateString() }.
//-                 - labels: **Object** — Map of column -> header label string.
//-                   Example: { id: 'ID', user_name: 'Name' }.
//-                 - actions: **Array** — List of action objects to render in the last column.
//-                   Replaces the deprecated block/slot mechanism.
//-                   Structure:
//-                     [
//-                       {
//-                         label: String,              // Text of the link/button
//-                         url: Function(item),        // Callback returning the URL string based on the row item
//-                         class: String (optional)    // CSS classes for the link
//-                       }
//-                     ]
//-                   Default: []
//-
//- Behavior:
//-   - Renders a table with Bootstrap-like classes (`table`).
//-   - If `items` is empty, displays a unified row with `emptyText`.
//-   - Actions are rendered as `<a>` tags in a separate column if `options.actions` is provided.

include ~pug-ui-kit/data-table.pug

- const data = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}];

+dataTable(users, ['id', 'name'], {
  showIndex: true,
  labels: { name: 'Full Name' },
  actions: [
    { 
      label: 'Edit', 
      class: 'btn-edit', 
      url: (item) => `/users/edit/${item.id}` 
    }
  ]
})]
```

#### Form Input

```pug
//- Renders a configurable <input> element with optional label and placeholder.
//- Supports different input types, custom name, value, and placeholder text.
//-
//- Parameters:
//-   type        - **String** — Input type attribute.
//-                 Example: 'text', 'email', 'password', 'number'.
//-                 Default: none (required).
//-   id          - **String** — Unique identifier for the <input> element.
//-                 Also used by the <label> `for` attribute.
//-                 Example: 'username', 'email'.
//-                 Default: none (required).
//-   label       - **String | null** — Visible label text. If `null` or empty,
//-                 no label is rendered.
//-                 Example: 'Name', 'Email address'.
//-                 Default: null.
//-   placeholder - **String** — Placeholder text displayed inside the input
//-                 when empty.
//-                 Example: 'Enter your name', 'example@mail.com'.
//-                 Default: ''.
//-   name        - **String** — Name attribute for form submission.
//-                 Example: 'username', 'email'.
//-                 Default: ''.
//-   value       - **String** — Default value for the input field.
//-                 Example: 'John Doe', 'test@mail.com'.
//-                 Default: ''.
//-
//- Behavior:
//-   - The input always has `.form-control` class for styling.
//-   - The label, if provided, uses `.form-label` class and is linked via `for=id`.
//-   - The placeholder text is shown until the user types content.
//-   - The `name` attribute ensures the input value is submitted with the form.
//-   - The `value` attribute pre-fills the input field if provided.
//-
//- Notes about styling and classes:
//-   - Visual appearance is controlled by `.form-control` and `.form-label`
//-     styles in your SCSS.
//-   - To add custom classes or attributes, extend the mixin or wrap it.
//-   - Ensure `id` is unique to avoid duplicate `for`/`id` collisions.

include ~pug-ui-kit/form-input.pug

+formInput('text', 'name', 'Name', 'Enter your name', 'name')
```

#### Form Textarea

```pug
//- Renders a configurable <textarea> element with optional label and placeholder.
//- Supports custom name attribute for form submission.
//-
//- Parameters:
//-   id          - **String** — Unique identifier for the <textarea> element.
//-                 Also used by the <label> `for` attribute.
//-                 Example: 'message', 'comment'.
//-                 Default: none (required).
//-   label       - **String | null** — Visible label text. If `null` or empty,
//-                 no label is rendered.
//-                 Example: 'Message', 'Comment'.
//-                 Default: null.
//-   placeholder - **String** — Placeholder text displayed inside the textarea
//-                 when empty.
//-                 Example: 'Type your message...', 'Enter comment here'.
//-                 Default: ''.
//-   name        - **String** — Name attribute for form submission.
//-                 Example: 'message', 'feedback'.
//-                 Default: ''.
//-
//- Behavior:
//-   - The textarea always has `.form-textarea` class for styling.
//-   - The label, if provided, uses `.form-label` class and is linked via `for=id`.
//-   - The placeholder text is shown until the user types content.
//-   - The `name` attribute ensures the textarea value is submitted with the form.
//-
//- Notes about styling and classes:
//-   - Visual appearance is controlled by `.form-textarea` and `.form-label`
//-     styles in your SCSS.
//-   - To add custom classes or attributes, extend the mixin or wrap it.
//-   - Ensure `id` is unique to avoid duplicate `for`/`id` collisions.

include ~pug-ui-kit/form-textarea.pug

+formTextarea('message', 'Message', 'Type your message...', 'message')
```

#### Input Checkbox

```pug
//- Renders a configurable checkbox with label and optional attributes.
//-
//- Summary
//-   Renders a checkbox input and its label inside a single inline control.
//-   Uses the project's base input styles so visual appearance is driven by SCSS.
//-
//- Parameters
//-   id        - **String** — Unique id for the <input>. Also used by <label for>.
//-               Required; example: 'agree'.
//-   label     - **String** — Visible label text shown next to the checkbox.
//-               Required; example: 'I agree to terms'.
//-   name      - **String** — Name attribute for form submission/grouping.
//-               Optional; default: ''.
//-   value     - **String** — Value submitted when checked. Optional; default: 'on'.
//-   checked   - **Boolean** — Whether the checkbox is checked by default.
//-               Optional; default: false.
//-
//- Behavior
//-   - Wraps input and label in a single inline control element (uses .check-control-label).
//-   - Input uses base input class (.input-base) so theme styles apply consistently.
//-   - Label text is rendered in a sibling element (.input-text) and is clickable.
//-   - If checked is true, the input is rendered with the checked attribute.
//-   - Any attributes passed via attrs are applied to the <input> (useful for disabled, required, aria-*).
//-
//- Styling and accessibility
//-   - Visual styling is controlled by .input-base, input[type="checkbox"], .check-control-label and .input-text in SCSS.
//-   - Ensure id is unique to keep label association correct for screen readers.
//-   - Prefer passing ARIA attributes via attrs for additional accessibility.

include ~pug-ui-kit/input-checkbox.pug

+inputCheckbox('agree', 'I agree to all terms')
```

#### Input Radio

```pug
//- Renders a configurable radio input with label for use in radio groups.
//-
//- Summary
//-   Renders a single radio control paired with a clickable label.
//-   Intended for groups where multiple radios share the same name.
//-
//- Parameters
//-   id        - **String** — Unique id for the <input>. Also used by <label for>.
//-               Required; example: 'contact-email'.
//-   label     - **String** — Visible label text shown next to the radio.
//-               Required; example: 'Email'.
//-   name      - **String** — Name attribute to group radios. Required; example: 'contact'.
//-   value     - **String** — Value submitted when selected. Required; example: 'email'.
//-   checked   - **Boolean** — Whether this radio is selected by default.
//-               Optional; default: false.
//-
//- Behavior
//-   - Wraps input and label in a single inline control (.check-control-label).
//-   - Input uses .input-base so theme styles apply consistently.
//-   - Radios with the same name are mutually exclusive; only one can be selected.
//-   - If checked is true, the input is rendered with the checked attribute.
//-   - Any attrs are applied to the <input> (useful for disabled, required, aria-*).
//-
//- Styling and accessibility
//-   - Visual styling is controlled by .input-base, input[type="radio"], .check-control-label and .input-text in SCSS.
//-   - Ensure id is unique to keep label association correct for screen readers.

include ~pug-ui-kit/input-radio.pug

.form-group
  .input-group
    span.form-label.w-100 Communication method
    +inputRadio('contact-email', 'Email', 'contact', 'email')
    +inputRadio('contact-phone', 'Phone', 'contact', 'phone')
```

#### Single Select

```pug
//- Renders a configurable <select> element with label, options, and optional placeholder.
//- Supports both arrays of strings and arrays of objects with configurable
//- keys for label and value. Provides ability to set a default selected option.
//-
//- Parameters:
//-   id             - **String** — Unique identifier for the <select> element.
//-                    Also used as the `name` attribute.
//-                    Example: 'topic', 'country'.
//-                    Default: none (required).
//-   label          - **String | null** — Visible label text. If `null` or empty,
//-                    no label is rendered.
//-                    Example: 'Topic', 'Choose country'.
//-                    Default: null.
//-   options        - **Array** — Options to render. Can be:
//-                      - Array of strings: ['Support', 'Feedback', 'Other']
//-                      - Array of objects: [{value:'support', text:'Support'}, …]
//-                      - Array of objects with custom keys (see labelKey/valueKey).
//-                    Default: [].
//-   labelKey       - **String** — Key name in option objects for display text.
//-                    Example: 'text', 'label'.
//-                    Default: 'text'.
//-   valueKey       - **String** — Key name in option objects for option value.
//-                    Example: 'value', 'id'.
//-                    Default: 'value'.
//-   selectedValue  - **String** — Value of the option that should be selected
//-                    by default. If empty, no option is preselected.
//-                    Example: 'feedback', '2'.
//-                    Default: ''.
//-   placeholder    - **String** — Text for a placeholder option. Rendered only
//-                    if `label` is null and `selectedValue` is empty.
//-                    Example: 'Choose an option', 'Select country'.
//-                    Default: 'Choose an option'.
//-
//- Behavior:
//-   - If `options` is an array of strings, each string is used as both
//-     the option value and label.
//-   - If `options` is an array of objects, the keys defined by `labelKey`
//-     and `valueKey` are used.
//-   - The option whose value matches `selectedValue` is rendered with
//-     the `selected` attribute.
//-   - If no label is provided and no selectedValue is set, a placeholder
//-     option is rendered at the top (`disabled selected hidden`).
//-   - The <select> element always has `.single-select` class for styling.
//-   - The label, if provided, uses `.form-label` class.
//-
//- Notes about styling and classes:
//-   - Visual appearance is controlled by `.single-select` and `.form-label`
//-     styles in your SCSS.
//-   - To add custom classes or attributes, extend the mixin or wrap it.
//-   - Ensure `id` is unique to avoid duplicate `for`/`id` collisions.

include ~pug-ui-kit/single-select.pug

+singleSelect('topic', 'Topic', [
  {value:'support', text:'Support'},
  {value:'feedback', text:'Feedback'},
  {value:'other', text:'Other'}
])
```

## 📂 Package Structure

* mixins/ - reusable Pug components. 
* scss/ - complete SCSS kit (Settings, Components, Themes, Layout). 
* less/ - complete LESS version for alternative workflows. 
* index.js - path resolution helper.

## 🧱 Components Included

* btn.pug
* data-table.pug
* form-input.pug
* form-textarea.pug
* input-checkbox.pug
* input-radio.pug
* single-select.pug

## 📄 License
This project is licensed under the ISC License.
