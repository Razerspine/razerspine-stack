import {applyBindings} from './apply-bindings';
import {bindClickEvents} from './bind-click-events';
import {bindForms} from './bind-forms';
import {createStore} from './store';

/**
 * Base abstract class for UI components and pages.
 * Provides reactive state management and automatic DOM synchronization.
 * * @template T - An object interface defining the component's state structure.
 */
export abstract class BaseComponent<T extends object> {
    /** * The reactive state object.
     * Any modifications to this object will automatically trigger the update() method.
     */
    protected state: T;

    /**
     * @param container - The root HTML element where the component is rendered.
     * @param initialState - The starting data for the component.
     */
    protected constructor(protected container: HTMLElement, initialState: T) {
        /**
         * Initialize the store using a Proxy.
         * The second argument is a callback that runs whenever a property is changed.
         */
        this.state = createStore(initialState, () => this.update());
    }

    /**
     * Binds DOM event listeners to the container.
     * Includes click delegation (data-click) and two-way form binding (data-model).
     * Usually called within onInit() or after the initial render.
     */
    protected initEventListeners(): void {
        bindClickEvents(this.container, this);
        bindForms(this.container, this, this.state);
    }

    /**
     * Refreshes the DOM elements within the container to match the current state.
     * Uses applyBindings to process data-bind, data-show, and data-class attributes.
     */
    protected update(): void {
        applyBindings(this.container, this.state);
    }

    /**
     * Updates the component state cleanly and safely merges new partial data.
     * This method preserves the Proxy store and triggers an update automatically.
     * * @param partialState - An object containing only the state properties to update.
     */
    protected setState(partialState: Partial<T>): void {
        Object.assign(this.state, partialState);
    }

    /**
     * Abstract method responsible for the initial HTML injection and setup.
     * Must be implemented by every subclass (e.g., HomePage, AboutPage).
     */
    abstract render(): void;
}
