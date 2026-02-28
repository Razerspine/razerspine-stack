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
 * @returns A proxied version of the state object.
 */
export function createStore<T extends object>(
    initialState: T,
    onChange: () => void
): T {

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

        set(target: any, prop: string | symbol, value: any): boolean {
            target[prop] = value;

            // Notify the system that the state has changed
            onChange();

            return true;
        }
    };

    const rootProxy = new Proxy(initialState, handler);
    proxyCache.set(initialState, rootProxy);

    return rootProxy;
}
