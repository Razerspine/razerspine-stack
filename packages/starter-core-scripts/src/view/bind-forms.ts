import {setValue} from './utils';

/**
 * Implements two-way data binding for form inputs using the [data-model] attribute.
 * Listens for 'input' events and synchronizes the element's value with the state.
 * @param root - The container element to scan for inputs.
 * @param context - The component instance (used to trigger the update() method).
 * @param state - The reactive state object where data should be stored.
 */
export function bindForms(root: HTMLElement, context: any, state: Record<string, any>): void {
    root.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const path = target.dataset.model;

        if (path) {
            // Update the nested property in the state object
            setValue(state, path, target.value);

            // Trigger a manual update if the store doesn't automatically catch the change
            // or if specific logic is needed after form input.
            if (typeof context.update === 'function') {
                context.update();
            }
        }
    });
}
