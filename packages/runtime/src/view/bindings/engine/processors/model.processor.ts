import {getValue} from '../../../../utils';
import {findMatch} from '../bindings.utils';

/**
 * Synchronizes form element values from the reactive state.
 *
 * This processor implements **state → input.value** binding
 * using the `data-model` attribute.
 *
 * Example:
 * ```html
 * <input data-model="user.name">
 * ```
 *
 * State:
 * ```ts
 * { user: { name: "John" } }
 * ```
 *
 * Result:
 * ```html
 * <input value="John">
 * ```
 *
 * The processor avoids unnecessary DOM writes to preserve:
 * - cursor position
 * - active focus
 *
 * @internal
 *
 * @param container - Root element where bindings are processed.
 * @param state - Current reactive state object.
 */
export function processModel(
    container: HTMLElement,
    state: Record<string, any>
) {
    const modelElements = findMatch(container, '[data-model]');

    modelElements.forEach((el) => {
        const path = el.dataset.model;

        if (!path) return;

        /**
         * Type narrowing for supported form controls.
         */
        const inputEl = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

        const value = getValue(state, path);

        const normalized = value ?? '';

        /**
         * Prevent unnecessary DOM updates.
         */
        if (inputEl.value !== String(normalized)) {
            inputEl.value = String(normalized);
        }
    });
}
