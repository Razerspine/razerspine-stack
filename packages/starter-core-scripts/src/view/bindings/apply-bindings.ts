import {getValue} from '../../utils';

/** Cache to store original templates for elements with [data-for] */
const templateCache = new WeakMap<HTMLElement, string>();

/**
 * Checks if an element should be processed in the current binding scope.
 * Prevents leakage into nested [data-for] loops.
 */
function isDirectBinding(el: HTMLElement, container: HTMLElement): boolean {
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
 * Synchronizes the DOM with the provided state by processing data-attributes.
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

    const loopElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-for]')
    ).filter(el => isDirectBinding(el, container));

    loopElements.forEach((el) => {
        const expression = el.dataset.for;
        if (!expression) return;

        const [itemName, arrayPath] = expression.split(':').map(s => s.trim());
        const items = getValue(state, arrayPath);

        if (!Array.isArray(items)) return;

        if (!templateCache.has(el)) {
            templateCache.set(el, el.innerHTML);
        }

        const template = templateCache.get(el)!;
        el.innerHTML = '';

        items.forEach((item, index) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = template;

            const localState = {
                ...state,
                [itemName]: item,
                [`${itemName}_index`]: index
            };

            applyBindings(tempDiv, localState);

            while (tempDiv.firstChild) {
                el.appendChild(tempDiv.firstChild);
            }
        });
    });

    // ---------------------------------------------------------------------
    // 2. TEXT BINDING (data-bind)
    // ---------------------------------------------------------------------

    const bindElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-bind]')
    ).filter(el => isDirectBinding(el, container));

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

    const modelElements = Array.from(
        container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-model]')
    ).filter(el => isDirectBinding(el as HTMLElement, container));

    modelElements.forEach((el) => {
        const path = el.dataset.model;
        if (!path) return;

        const value = getValue(state, path);

        /**
         * Prevent unnecessary DOM writes.
         * Only update if value differs.
         */
        const normalized = value ?? '';
        if (el.value !== String(normalized)) {
            el.value = String(normalized);
        }
    });

    // ---------------------------------------------------------------------
    // 4. VISIBILITY (data-show)
    // ---------------------------------------------------------------------

    const showElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-show]')
    ).filter(el => isDirectBinding(el, container));

    showElements.forEach((el) => {
        const path = el.dataset.show;
        if (!path) return;

        const isVisible = evaluateCondition(state, path);
        el.style.display = isVisible ? '' : 'none';
    });

    // ---------------------------------------------------------------------
    // 5. CLASSES (data-class)
    // ---------------------------------------------------------------------

    const classElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-class]')
    ).filter(el => isDirectBinding(el, container));

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
