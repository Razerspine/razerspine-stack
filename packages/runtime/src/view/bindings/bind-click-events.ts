import {parseExpression} from './bind-click-events.utils';

/**
 * Sets up global click event delegation for elements with the [data-click] attribute.
 *
 * Supports both simple method references and method expressions with arguments:
 *
 * Examples:
 * ```html
 * <button data-click="save"></button>
 * <button data-click="save()"></button>
 * <button data-click="deleteUser(1)"></button>
 * <button data-click="toggle(true)"></button>
 * ```
 *
 * Expression parsing rules:
 * - Method name must exist on the provided context object
 * - Arguments support:
 *   - numbers (e.g. 1, 42)
 *   - booleans (true / false)
 *   - strings ('text' / "text")
 * - Fallback values are passed as raw strings
 *
 * Execution behavior:
 * - Method is called with parsed arguments
 * - Additionally receives (event, element) as the last parameters
 *
 * Example:
 * ```ts
 * deleteUser(id: number, event: MouseEvent, el: HTMLElement) {}
 * ```
 *
 * @param root - The container element to attach the delegated listener to.
 * @param context - The object (usually a class instance) containing the methods to be invoked.
 * @returns {() => void} Cleanup function to remove the event listener.
 */
export function bindClickEvents(root: HTMLElement, context: any): () => void {

    const clickHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        /**
         * Find the nearest ancestor with [data-click]
         * to support event delegation.
         */
        const el = target.closest<HTMLElement>('[data-click]');
        if (!el) return;

        const expression = el.dataset.click;
        if (!expression) return;

        /**
         * Parse expression into method name + arguments.
         * Example:
         * "deleteUser(1)" → { name: "deleteUser", args: [1] }
         */
        const {name, args} = parseExpression(expression);

        const method = context[name];

        /**
         * Execute method if it exists on context.
         */
        if (typeof method === 'function') {
            /**
             * Call signature:
             * method(...args, event, element)
             */
            method.call(context, ...args, event, el);
        } else {
            console.warn(
                `[ViewCore] Method "${name}" not found on the provided context.`,
                context
            );
        }
    };

    root.addEventListener('click', clickHandler as EventListener);

    /**
     * Cleanup function to prevent memory leaks.
     */
    return () => {
        root.removeEventListener('click', clickHandler as EventListener);
    };
}
