import {getValue} from '../../../../utils';
import {findMatch} from '../bindings.utils';

/**
 * Synchronizes form element values from the reactive state.
 *
 * Supports:
 * - text inputs
 * - textarea
 * - select
 * - radio (checked binding)
 * - checkbox (boolean binding)
 */
export function processModel(
    container: HTMLElement,
    state: Record<string, any>
) {
    const modelElements = findMatch(container, '[data-model]');

    modelElements.forEach((el) => {
        const path = el.dataset.model;
        if (!path) return;

        const inputEl = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

        const value = getValue(state, path);
        const normalized = value ?? '';

        /**
         * RADIO
         */
        if (inputEl instanceof HTMLInputElement && inputEl.type === 'radio') {
            const shouldCheck = String(normalized) === inputEl.value;

            if (inputEl.checked !== shouldCheck) {
                inputEl.checked = shouldCheck;
            }

            return;
        }

        /**
         * CHECKBOX
         */
        if (inputEl instanceof HTMLInputElement && inputEl.type === 'checkbox') {
            const shouldCheck = Boolean(normalized);

            if (inputEl.checked !== shouldCheck) {
                inputEl.checked = shouldCheck;
            }

            return;
        }
        /**
         * DEFAULT (text, textarea, select)
         */
        if (inputEl.value !== String(normalized)) {
            inputEl.value = String(normalized);
        }
    });
}
