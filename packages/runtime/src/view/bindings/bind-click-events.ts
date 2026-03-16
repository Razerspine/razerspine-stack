/**
 * Sets up global click event delegation for elements with the [data-click] attribute.
 * @param root - The container element to attach the listener to.
 * @param context - The object (usually a class instance) containing the methods to be called.
 * @returns {() => void} A function to remove the event listener and cleanup.
 */
export function bindClickEvents(root: HTMLElement, context: any): () => void {
    const clickHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // Find the nearest ancestor that has a data-click attribute
        const el = target.closest<HTMLElement>('[data-click]');
        if (!el) return;

        const method = el.dataset.click;
        if (!method) return;

        // Execute the method if it exists on the provided context
        if (typeof context[method] === 'function') {
            // Pass the original event and the target element to the handler
            context[method].call(context, event, el);
        } else {
            console.warn(`[ViewCore] Method "${method}" not found on the provided context.`, context);
        }
    };

    root.addEventListener('click', clickHandler as EventListener);

    /**
     * Returns a cleanup function to prevent memory leaks
     * when the component is destroyed.
     */
    return () => {
        root.removeEventListener('click', clickHandler as EventListener);
    };
}
