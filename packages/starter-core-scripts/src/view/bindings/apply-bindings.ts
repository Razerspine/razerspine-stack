import {getValue} from '../../utils';

/** Cache to store original templates for elements with [data-for] */
const templateCache = new WeakMap<HTMLElement, string>();

/**
 * Checks if an element should be processed in the current binding scope.
 * Prevents leakage into nested [data-for] loops.
 */
function isDirectBinding(el: HTMLElement, container: HTMLElement): boolean {
    if (el === container) return true;

    let parent = el.parentElement;

    while (parent && parent !== container) {
        if (parent.hasAttribute('data-for')) {
            return false;
        }
        parent = parent.parentElement;
    }

    return true;
}

/**
 * Evaluates a boolean condition from the state.
 * Supports negation operator (!).
 */
function evaluateCondition(state: any, path: string): boolean {
    const isNegated = path.startsWith('!');
    const actualPath = isNegated ? path.substring(1) : path;
    const value = getValue(state, actualPath);
    return isNegated ? !value : !!value;
}

/**
 * Helper to find elements including the container itself if it matches the selector.
 */
function findMatch(container: HTMLElement, selector: string): HTMLElement[] {
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (container.matches(selector)) {
        elements.unshift(container);
    }
    return elements.filter(el => isDirectBinding(el, container));
}

/**
 * Synchronizes the DOM with the provided state by processing data-attributes.
 * * Optimized for `data-for`: uses a lightweight diffing strategy to reuse
 * existing DOM nodes instead of full re-rendering.
 *
 * Supported attributes:
 * - data-for
 * - data-bind
 * - data-model (reverse binding)
 * - data-show
 * - data-class
 *
 * @param container - The root HTML element to scan.
 * @param state - The current reactive state object.
 */
export function applyBindings(
    container: HTMLElement,
    state: Record<string, any>
): void {

    // ---------------------------------------------------------------------
    // 1. LIST RENDERING (data-for="item:items")
    // ---------------------------------------------------------------------

    const loopElements = findMatch(container, '[data-for]');

    loopElements.forEach((el) => {
        const expression = el.dataset.for;
        if (!expression) return;

        const [itemName, arrayPath] = expression.split(':').map(s => s.trim());
        const items = getValue(state, arrayPath);

        if (!Array.isArray(items)) return;

        // Ensure we have the original template cached
        if (!templateCache.has(el)) {
            // FIX: .trim() removes leading/trailing whitespace that causes DOM cluttering
            const rawTemplate = el.innerHTML || '';
            templateCache.set(el, rawTemplate.trim());
        }

        const template = templateCache.get(el)!;

        /**
         * SMART PATCHING LOGIC:
         * 1. Differential Deletion: Remove excess DOM nodes from the end if the
         * new array is smaller, including interleaved text nodes (whitespace).
         * 2. Node Reuse (Non-keyed): Iteratively update existing DOM elements
         * by re-applying bindings with the new local state.
         * 3. Lazy Append: Create and append new nodes only when the array
         * grows beyond the current DOM child count.
         */

        // Step 1: Remove excess children
        // Remove excess elements FROM THE END to preserve the order of existing ones.
        // We use el.lastChild to ensure we also clean up text nodes (whitespace, line breaks).
        while (el.children.length > items.length) {
            // Remove all text nodes that come AFTER the last HTML element
            while (el.lastChild && el.lastChild !== el.lastElementChild) {
                el.lastChild.remove();
            }
            // Remove the excess HTML element itself
            el.lastElementChild?.remove();
        }

        // Clear any residual text content if the array is empty
        if (items.length === 0) {
            el.innerHTML = '';
        }

        // Step 2 & 3: Update existing or Create new
        items.forEach((item, index) => {
            const localState = {
                ...state,
                [itemName]: item,
                [`${itemName}_index`]: index
            };

            const existingChild = el.children[index] as HTMLElement;

            if (existingChild) {
                // REUSE: Update the existing node.
                applyBindings(existingChild, localState);
            } else {
                // CREATE: Create a new node
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

    // ---------------------------------------------------------------------
    // 2. TEXT BINDING (data-bind)
    // ---------------------------------------------------------------------

    const bindElements = findMatch(container, '[data-bind]');

    bindElements.forEach((el) => {
        const path = el.dataset.bind;
        if (!path) return;

        const value = getValue(state, path);
        if (value !== undefined && value !== null) {
            el.textContent = String(value);
        }
    });

    // ---------------------------------------------------------------------
    // 3. MODEL REVERSE BINDING (state → input.value)
    // ---------------------------------------------------------------------

    const modelElements = findMatch(container, '[data-model]');

    modelElements.forEach((el) => {
        const path = el.dataset.model;
        if (!path) return;

        // Type safety: identify as form-capable element
        const inputEl = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const value = getValue(state, path);

        /**
         * Prevent unnecessary DOM writes.
         * Only update if value differs to maintain cursor position/focus.
         */
        const normalized = value ?? '';
        if (inputEl.value !== String(normalized)) {
            inputEl.value = String(normalized);
        }
    });

    // ---------------------------------------------------------------------
    // 4. VISIBILITY (data-show)
    // ---------------------------------------------------------------------

    const showElements = findMatch(container, '[data-show]');

    showElements.forEach((el) => {
        const path = el.dataset.show;
        if (!path) return;

        const isVisible = evaluateCondition(state, path);
        el.style.display = isVisible ? '' : 'none';
    });

    // ---------------------------------------------------------------------
    // 5. CLASSES (data-class)
    // ---------------------------------------------------------------------

    const classElements = findMatch(container, '[data-class]');

    classElements.forEach((el) => {
        const rawRules = el.dataset.class?.split(',') || [];

        rawRules.forEach(rule => {
            const [className, path] = rule.split(':').map(s => s.trim());
            if (!className || !path) return;

            const condition = evaluateCondition(state, path);
            el.classList.toggle(className, condition);
        });
    });
}
