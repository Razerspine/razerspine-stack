/**
 * Type representing a class/constructor function that can be injected.
 * Uses `abstract new` to allow abstract classes to serve as injection tokens.
 */
export type ProviderToken<T> = (abstract new (...args: any[]) => T) | (new (...args: any[]) => T);
