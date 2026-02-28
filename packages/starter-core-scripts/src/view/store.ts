/**
 * Creates a reactive store using JavaScript Proxy.
 * Automatically triggers an onChange callback when any property (including nested ones) is modified.
 * @param initialState - The initial state object.
 * @param onChange - Callback function to execute on state changes (e.g., to trigger a DOM update).
 * @returns A proxied version of the state object.
 */
export function createStore<T extends object>(initialState: T, onChange: () => void): T {
    const handler: ProxyHandler<T> = {
        get(target: any, prop: string | symbol): any {
            const value = target[prop];
            // Recursively proxy nested objects to ensure deep reactivity
            if (value !== null && typeof value === 'object') {
                return new Proxy(value, handler);
            }
            return value;
        },
        set(target: any, prop: string | symbol, value: any) {
            target[prop] = value;
            // Notify the system that the state has changed
            onChange();
            return true;
        }
    };

    return new Proxy(initialState, handler);
}
