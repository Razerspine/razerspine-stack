import {processFor} from './processors/for.processor';
import {processBind} from './processors/bind.processor';
import {processModel} from './processors/model.processor';
import {processShow} from './processors/show.processor';
import {processClass} from './processors/class.processor';

/**
 * Binding engine entry point.
 *
 * Scans a DOM container and synchronizes it with the provided
 * reactive state object by processing `data-*` directives.
 *
 * The engine delegates directive handling to specialized
 * processors to keep the runtime modular and maintainable.
 *
 * Supported directives:
 *
 * - `data-for`   → list rendering
 * - `data-bind`  → text interpolation
 * - `data-model` → state → form value binding
 * - `data-show`  → conditional visibility
 * - `data-class` → conditional class toggling
 *
 * Processing order matters:
 *
 * 1. `data-for` (DOM structure changes)
 * 2. `data-bind`
 * 3. `data-model`
 * 4. `data-show`
 * 5. `data-class`
 *
 * @param container - Root element to scan for bindings.
 * @param state - Reactive state object used to resolve bindings.
 */
export function applyBindings(
    container: HTMLElement,
    state: Record<string, any>
): void {
    processFor(container, state);
    processBind(container, state);
    processModel(container, state);
    processShow(container, state);
    processClass(container, state);
}
