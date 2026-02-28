import {getValue} from './utils';

/** Cache to store original templates for elements with [data-for] */
const templateCache = new Map<HTMLElement, string>();

/**
 * Checks if an element should be processed in the current binding scope.
 * It prevents "leakage" into nested [data-for] loops.
 * @param el - The element to check.
 * @param container - The current root of the binding process.
 * @returns boolean - True if the element belongs to the current scope.
 */
function isDirectBinding(el: HTMLElement, container: HTMLElement): boolean {
    let parent = el.parentElement;

    // Traverse up the DOM tree from the element to the current container.
    // If we encounter another [data-for] along the way, this element belongs
    // to a nested scope and should be skipped for now.
    while (parent && parent !== container) {
        if (parent.hasAttribute('data-for')) {
            return false;
        }
        parent = parent.parentElement;
    }
    return true;
}

/**
 * Evaluates a condition from the state, supporting the negation operator (!).
 */
function evaluateCondition(state: any, path: string): boolean {
    const isNegated = path.startsWith('!');
    const actualPath = isNegated ? path.substring(1) : path;
    const value = getValue(state, actualPath);
    return isNegated ? !value : !!value;
}

/**
 * Synchronizes the DOM with the provided state by processing data-attributes.
 * Handles loops (data-for), text (data-bind), visibility (data-show), and classes (data-class).
 * @param container - The root HTML element to scan.
 * @param state - The current reactive state object.
 */
export function applyBindings(container: HTMLElement, state: Record<string, any>) {

    // 1. LIST RENDERING (data-for="item:items")
    // We collect elements first to avoid issues with DOM mutation during iteration
    const loopElements = Array.from(container.querySelectorAll<HTMLElement>('[data-for]'))
        .filter(el => isDirectBinding(el, container));

    loopElements.forEach((el) => {
        const expression = el.dataset.for;
        if (!expression) return;

        const [itemName, arrayPath] = expression.split(':').map(s => s.trim());
        const items = getValue(state, arrayPath);

        if (Array.isArray(items)) {
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

                // Recursive call for the item's template
                applyBindings(tempDiv, localState);

                while (tempDiv.firstChild) {
                    el.appendChild(tempDiv.firstChild);
                }
            });
        }
    });

    // 2. TEXT BINDING (data-bind)
    const bindElements = Array.from(container.querySelectorAll<HTMLElement>('[data-bind]'))
        .filter(el => isDirectBinding(el, container));

    bindElements.forEach((el) => {
        const path = el.dataset.bind;
        if (path) {
            const value = getValue(state, path);
            if (value !== undefined && value !== null) el.textContent = String(value);
        }
    });

    // 3. VISIBILITY (data-show)
    const showElements = Array.from(container.querySelectorAll<HTMLElement>('[data-show]'))
        .filter(el => isDirectBinding(el, container));

    showElements.forEach((el) => {
        const path = el.dataset.show;
        if (path) {
            const isVisible = evaluateCondition(state, path);
            el.style.display = isVisible ? '' : 'none';
        }
    });

    // 4. CLASSES (data-class)
    const classElements = Array.from(container.querySelectorAll<HTMLElement>('[data-class]'))
        .filter(el => isDirectBinding(el, container));

    classElements.forEach((el) => {
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
