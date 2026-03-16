import {findMatch, evaluateCondition} from '../bindings.utils';

/**
 * Processes conditional class bindings using `data-class`.
 *
 * Syntax:
 * ```html
 * <div data-class="active:isActive, hidden:!visible"></div>
 * ```
 *
 * State example:
 * ```ts
 * { isActive: true, visible: false }
 * ```
 *
 * Result:
 * ```html
 * <div class="active hidden"></div>
 * ```
 *
 * Multiple rules can be defined using comma separation.
 *
 * @internal
 *
 * @param container - Root element where bindings are processed.
 * @param state - Current reactive state object.
 */
export function processClass(
    container: HTMLElement,
    state: Record<string, any>
) {
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
