import {setValue} from '../../utils';

/**
 * Implements two-way data binding for form inputs using the [data-model] attribute.
 *
 * This function:
 * - Listens for 'input' events (delegated).
 * - Updates the reactive state via Proxy.
 *
 * IMPORTANT:
 * No manual update() call is required.
 * The Proxy store automatically triggers DOM updates via onChange().
 *
 * @param root - The container element to attach the delegated listener to.
 * @param context - The component instance (not used directly, but kept for API symmetry).
 * @param state - The reactive state object where data should be stored.
 * @returns {() => void} A function to remove the event listener and cleanup.
 */
export function bindForms(root: HTMLElement, context: any, state: Record<string, any>): () => void {

    const inputHandler = (event: Event) => {
        const target =
            event.target as HTMLInputElement |
                HTMLTextAreaElement |
                HTMLSelectElement;

        const path = target.dataset.model;
        if (!path) return;

        /**
         * Update nested property in the reactive store.
         * Proxy will automatically trigger onChange → update().
         */
        setValue(state, path, target.value);
    };

    root.addEventListener('input', inputHandler);

    /**
     * Returns a cleanup function to prevent memory leaks.
     */
    return () => {
        root.removeEventListener('input', inputHandler);
    };
}
