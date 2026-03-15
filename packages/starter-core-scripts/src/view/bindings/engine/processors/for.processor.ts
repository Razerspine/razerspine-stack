import {getValue} from '../../../../utils';
import {findMatch} from '../bindings.utils';
import {applyBindings} from '../apply-bindings';

/**
 * Cache storing the original template for each `[data-for]` container.
 *
 * Prevents re-reading innerHTML during subsequent updates.
 */
const templateCache = new WeakMap<HTMLElement, string>();

/**
 * Processes list rendering using the `data-for` directive.
 *
 * Syntax:
 *
 * ```html
 * <ul data-for="item:items">
 *   <li data-bind="item"></li>
 * </ul>
 * ```
 *
 * State:
 *
 * ```ts
 * { items: ["A", "B", "C"] }
 * ```
 *
 * Result:
 *
 * ```html
 * <ul>
 *   <li>A</li>
 *   <li>B</li>
 *   <li>C</li>
 * </ul>
 * ```
 *
 * Rendering strategy:
 *
 * 1. **Template caching**
 *    Stores the original template to avoid repeated DOM parsing.
 *
 * 2. **Differential deletion**
 *    Removes excess DOM nodes if the new array is smaller.
 *
 * 3. **Node reuse**
 *    Existing DOM elements are updated instead of recreated.
 *
 * 4. **Lazy append**
 *    New DOM nodes are created only when the array grows.
 *
 * This approach avoids full re-rendering and significantly
 * reduces DOM churn.
 *
 * @internal
 *
 * @param container - Root element where bindings are processed.
 * @param state - Current reactive state object.
 */
export function processFor(
    container: HTMLElement,
    state: Record<string, any>
) {
    const loopElements = findMatch(container, '[data-for]');

    loopElements.forEach((el) => {
        const expression = el.dataset.for;

        if (!expression) return;

        const [itemName, arrayPath] = expression.split(':').map(s => s.trim());

        const items = getValue(state, arrayPath);

        if (!Array.isArray(items)) return;

        /**
         * Cache template on first run.
         */
        if (!templateCache.has(el)) {
            const rawTemplate = el.innerHTML || '';
            templateCache.set(el, rawTemplate.trim());
        }

        const template = templateCache.get(el)!;

        /**
         * Step 1 — remove excess nodes.
         */
        while (el.children.length > items.length) {
            while (el.lastChild && el.lastChild !== el.lastElementChild) {
                el.lastChild.remove();
            }

            el.lastElementChild?.remove();
        }

        /**
         * Clear container if array becomes empty.
         */
        if (items.length === 0) {
            el.innerHTML = '';
        }

        /**
         * Step 2 & 3 — update existing nodes or create new ones.
         */
        items.forEach((item, index) => {
            const localState = {
                ...state,
                [itemName]: item,
                [`${itemName}_index`]: index
            };
            const existingChild = el.children[index] as HTMLElement;

            if (existingChild) {
                applyBindings(existingChild, localState);
            } else {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = template;

                const fragment = document.createDocumentFragment();

                while (tempDiv.firstChild) {
                    const node = tempDiv.firstChild;

                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyBindings(node as HTMLElement, localState);
                    }

                    fragment.appendChild(node);
                }

                el.appendChild(fragment);
            }
        });
    });
}
