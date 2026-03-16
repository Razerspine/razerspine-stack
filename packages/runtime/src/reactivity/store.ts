/**
 * Creates a reactive store using JavaScript Proxy.
 * Automatically triggers an onChange callback when any property
 * (including nested ones) is modified.
 *
 * This implementation caches nested proxies to:
 * - Prevent re-creating Proxy instances on every property access
 * - Preserve reference stability
 * - Improve performance
 *
 * @param initialState - The initial state object.
 * @param onChange - Callback function to execute on state changes (e.g., to trigger a DOM update).
 * @returns { {state: T, disconnect: () => void} } An object containing the proxied state and a disconnect function.
 */
export function createStore<T extends object>(
    initialState: T,
    onChange: (() => void) | null
): { state: T; disconnect: () => void } {

    /**
     * Local reference to the callback that can be cleared.
     */
    let listener = onChange;

    /**
     * Cache for nested proxies.
     * Ensures that the same object reference always returns the same Proxy.
     */
    const proxyCache = new WeakMap<object, any>();

    const handler: ProxyHandler<any> = {
        get(target: any, prop: string | symbol): any {
            const value = target[prop];

            // Only proxy non-null objects
            if (value !== null && typeof value === 'object') {

                // Return cached proxy if exists
                if (proxyCache.has(value)) {
                    return proxyCache.get(value);
                }

                const proxied = new Proxy(value, handler);
                proxyCache.set(value, proxied);
                return proxied;
            }

            return value;
        },

        set(target: any, prop: string | symbol, value: any, receiver: any): boolean {
            const oldValue = target[prop];
            const result = Reflect.set(target, prop, value, receiver);

            /**
             * Trigger only when actual state object changes.
             * Ignore prototype writes used by data-for scopes.
             */
            if (listener && !Object.is(oldValue, value) && Object.prototype.hasOwnProperty.call(target, prop)) {
                listener();
            }

            return result;
        }
    };

    const rootProxy = new Proxy(initialState, handler);
    proxyCache.set(initialState, rootProxy);

    return {
        state: rootProxy as T,
        disconnect: () => {
            /**
             * Nullify the listener to break the closure and allow
             * garbage collection of the component.
             */
            listener = null;
        }
    };
}
