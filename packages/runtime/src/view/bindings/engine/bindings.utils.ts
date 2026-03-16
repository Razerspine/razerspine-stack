/**
 * Internal helpers for the binding engine.
 * Not part of the public API.
 * @internal
 */

import {getValue} from '../../../utils';

/**
 * Checks if an element should be processed in the current binding scope.
 * Prevents leakage into nested [data-for] loops.
 */
export function isDirectBinding(
    el: HTMLElement,
    container: HTMLElement
): boolean {
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
export function evaluateCondition(
    state: Record<string, unknown>,
    path: string
): boolean {
    const isNegated = path.startsWith('!');
    const actualPath = isNegated ? path.substring(1) : path;
    const value = getValue(state, actualPath);

    return isNegated ? !value : !!value;
}

/**
 * Helper to find elements including the container itself if it matches the selector.
 */
export function findMatch(
    container: HTMLElement,
    selector: string
): HTMLElement[] {
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));

    if (container.matches(selector)) {
        elements.unshift(container);
    }

    return elements.filter(el => isDirectBinding(el, container));
}
