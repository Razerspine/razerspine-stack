import {getValue} from '../../../../utils';
import {findMatch} from '../bindings.utils';

/**
 * Processes text bindings using the `data-bind` attribute.
 *
 * This processor updates the `textContent` of elements based on
 * values from the reactive state object.
 *
 * Example:
 * ```html
 * <span data-bind="user.name"></span>
 * ```
 *
 * State:
 * ```ts
 * { user: { name: "John" } }
 * ```
 *
 * Result:
 * ```html
 * <span>John</span>
 * ```
 *
 * @internal
 *
 * @param container - Root element where bindings are processed.
 * @param state - Current reactive state object.
 */
export function processBind(
    container: HTMLElement,
    state: Record<string, any>
) {
    const bindElements = findMatch(container, '[data-bind]');

    bindElements.forEach((el) => {
        const path = el.dataset.bind;

        if (!path) return;

        const value = getValue(state, path);

        /**
         * Only update DOM when value is defined.
         * Prevents rendering "undefined" or "null".
         */
        if (value !== undefined && value !== null) {
            el.textContent = String(value);
        }
    });
}
