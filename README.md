# tab-pane

Custom element wrapping arbitrary content in a tabbed view.

```bash
npm install @bgoodman/tab-pane

yarn add @bgoodman/tab-pane
```

## Usage

The child elements of `tab-pane` becomes the tabbed views.  Use attribute `data-tab` to set the text label of each respective tab button.

```html
<script type="module" src="./dist/index.js"></script>

    <tab-pane tab-position="top">
        <div data-tab="Some Text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div data-tab="Disabled" disabled>Nothing to see here.</div>
        <div data-tab="An Image">
            <img src="http://lorempixel.com/400/200/" />
        </div>
    </tab-pane>

```

## Attributes

### `tab-position`

Specify if the tabs should be placed at the `"top"` (default), `"left"` or `"right"` of the content.

---

### `background`

Takes a value for the css rule `background`, governs the selected tab button and visible child.

---

### `data-tab` (child)

Provide a string to set as the label for tab's button.

---

### `disabled` (child)

If present or set as `"true"`, disables the click action of the tab button, making its view unreachable.

---
