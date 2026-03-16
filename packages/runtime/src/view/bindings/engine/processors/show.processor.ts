import {findMatch, evaluateCondition} from '../bindings.utils';

/**
 * Controls element visibility using the `data-show` attribute.
 *
 * Example:
 * ```html
 * <div data-show="isVisible"></div>
 * ```
 *
 * State:
 * ```ts
 * { isVisible: false }
 * ```
 *
 * Result:
 * ```html
 * <div style="display:none"></div>
 * ```
 *
 * Supports negation:
 *
 * ```html
 * <div data-show="!isHidden"></div>
 * ```
 *
 * @internal
 *
 * @param container - Root element where bindings are processed.
 * @param state - Current reactive state object.
 */
export function processShow(
    container: HTMLElement,
    state: Record<string, any>
) {
    const showElements = findMatch(container, '[data-show]');

    showElements.forEach((el) => {
        const path = el.dataset.show;

        if (!path) return;

        const isVisible = evaluateCondition(state, path);

        el.style.display = isVisible ? '' : 'none';
    });
}
