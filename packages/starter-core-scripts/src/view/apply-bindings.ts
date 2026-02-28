import {getValue} from './utils';

/**
 * Evaluates a condition from the state, supporting the negation operator (!).
 * @param state - The source of truth object.
 * @param path - The data path (e.g., "isLoading" or "!isProcessing").
 * @returns boolean - The evaluated result.
 */
function evaluateCondition(state: any, path: string): boolean {
    const isNegated = path.startsWith('!');
    const actualPath = isNegated ? path.substring(1) : path;
    const value = getValue(state, actualPath);

    // Returns the inverted boolean if "!" is present, otherwise returns the truthy value.
    return isNegated ? !value : !!value;
}

/**
 * Synchronizes the DOM with the provided state by processing specific data-attributes.
 * This is the primary engine for reactive DOM updates in the starter templates.
 * * @param container - The root HTML element to scan for bindings.
 * @param container
 * @param state - The current reactive state or store.
 */
export function applyBindings(container: HTMLElement, state: Record<string, any>) {

    // 1. TEXT BINDING (data-bind)
    // Synchronizes the element's textContent with a state property.
    container.querySelectorAll<HTMLElement>('[data-bind]').forEach((el) => {
        const path = el.dataset.bind;
        if (path) {
            const value = getValue(state, path);
            // Ensure we don't render "null" or "undefined" as strings.
            if (value !== undefined && value !== null) {
                el.textContent = String(value);
            }
        }
    });

    // 2. VISIBILITY TOGGLE (data-show)
    // Shows/hides elements by toggling the display property. Supports negation via "!".
    container.querySelectorAll<HTMLElement>('[data-show]').forEach((el) => {
        const path = el.dataset.show;
        if (path) {
            const isVisible = evaluateCondition(state, path);
            el.style.display = isVisible ? '' : 'none';
        }
    });

    // 3. CLASS TOGGLE (data-class)
    // Toggles CSS classes based on conditions using "className:path" syntax.
    // Multiple rules can be separated by commas (e.g., "active:isActive, hidden:!isVisible").
    container.querySelectorAll<HTMLElement>('[data-class]').forEach((el) => {
        const rawRules = el.dataset.class?.split(',') || [];

        rawRules.forEach(rule => {
            const [className, path] = rule.split(':').map(s => s.trim());

            if (className && path) {
                const condition = evaluateCondition(state, path);
                el.classList.toggle(className, condition);
            }
        });
    });
}
