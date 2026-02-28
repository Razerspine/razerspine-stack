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
    private _state: T;

    /**
     * Internal list of cleanup functions to be executed on destruction.
     * This prevents memory leaks by removing event listeners and disconnecting proxies.
     */
    private cleanupCallbacks: Array<() => void> = [];

    /**
     * Accessor for the component's current state.
     * Returns a read-only version of the state to prevent direct mutations.
     * Use {@link setState} to modify the state.
     * * @returns {Readonly<T>} The current state object.
     */
    protected get state(): Readonly<T> {
        return this._state;
    }

    /**
     * @param container - The root HTML element where the component is rendered.
     * @param initialState - The starting data for the component.
     */
    protected constructor(protected container: HTMLElement, initialState: T) {
        /**
         * Initialize the store using a Proxy.
         * The store returns the proxied state and a disconnect function.
         */
        const {state, disconnect} = createStore(initialState, () => this.update());

        this._state = state;

        // Register the store disconnect to the cleanup list
        this.cleanupCallbacks.push(disconnect);
    }

    /**
     * Binds DOM event listeners to the container.
     * Includes click delegation (data-click) and two-way form binding (data-model).
     * Usually called within onInit() or after the initial render.
     */
    protected initEventListeners(): void {
        /**
         * We store the returned cleanup functions to remove listeners
         * when the component is destroyed.
         */
        this.cleanupCallbacks.push(bindClickEvents(this.container, this));
        this.cleanupCallbacks.push(bindForms(this.container, this, this._state));
    }

    /**
     * Refreshes the DOM elements within the container to match the current state.
     * Uses applyBindings to process data-bind, data-show, and data-class attributes.
     */
    protected update(): void {
        applyBindings(this.container, this._state);
    }

    /**
     * Updates the component state cleanly and safely merges new partial data.
     * This method preserves the Proxy store and triggers an update automatically.
     * * @param partialState - An object containing only the state properties to update.
     */
    protected setState(partialState: Partial<T>): void {
        Object.assign(this._state as object, partialState);
    }

    /**
     * Lifecycle hook: Called after the component has been initialized and rendered.
     * Can be overridden in subclasses for API calls or additional setup.
     */
    protected onInit(): void {
    }

    /**
     * Lifecycle hook: Called immediately before the component is destroyed.
     * Useful for clearing intervals, manual subscriptions, or third-party libs.
     */
    protected onDestroy(): void {
    }

    /**
     * Destroys the component instance.
     * - Triggers the onDestroy hook.
     * - Executes all registered cleanup callbacks (event listeners, store disconnect).
     * - Clears the container's inner HTML.
     */
    public destroy(): void {
        this.onDestroy();

        // Execute and clear all cleanup tasks
        this.cleanupCallbacks.forEach((cleanup) => cleanup());
        this.cleanupCallbacks = [];

        // Clear DOM to free up memory
        this.container.innerHTML = '';
    }

    /**
     * Abstract method responsible for the initial HTML injection and setup.
     * Must be implemented by every subclass (e.g., HomePage, AboutPage).
     */
    abstract render(): void;
}
