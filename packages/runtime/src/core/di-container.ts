import {ProviderToken} from './di.types';

/**
 * Dependency Injection Container.
 * Manages the registration, instantiation, and resolution of services.
 * Implements a Singleton pattern for the container itself.
 */
export class DIContainer {
    private static instance: DIContainer;

    /** Stores initialized singleton instances */
    private instances = new Map<ProviderToken<any>, any>();

    /** Tracks tokens currently being resolved to detect circular dependencies */
    private resolving = new Set<ProviderToken<any>>();

    private constructor() {
    }

    /**
     * Retrieves the global container instance.
     * @returns The singleton DIContainer instance.
     */
    public static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    /**
     * Registers an already instantiated service or a value.
     * @param token - The class/token of the service.
     * @param instance - The instantiated object or value.
     */
    public register<T>(token: ProviderToken<T>, instance: T): void {
        this.instances.set(token, instance);
    }

    /**
     * Resolves a dependency.
     *
     * In strict mode, a dependency MUST be explicitly registered
     * before it can be resolved. Automatic instantiation is not allowed.
     *
     * @param token - The class to resolve.
     * @returns The singleton instance of the requested class.
     * @throws Error if the service is not registered.
     * @throws Error if a circular dependency is detected.
     */
    public resolve<T>(token: ProviderToken<T>): T {
        if (this.instances.has(token)) {
            return this.instances.get(token);
        }

        if (this.resolving.has(token)) {
            throw new Error(`Circular dependency detected while resolving ${token.name}`);
        }

        // mark token as currently resolving
        this.resolving.add(token);

        try {
            // 🔒 STRICT MODE:
            // Services must be explicitly registered during bootstrap.
            // Automatic instantiation via `new token()` is intentionally disabled
            // to prevent silent misconfiguration and missing constructor dependencies.
            throw new Error(
                `Service "${token.name}" is not registered in the DI container.\n` +
                `Ensure it is provided in bootstrapApplication({ providers: [...] }).`
            );
        } finally {
            // ensure cleanup even if error is thrown
            this.resolving.delete(token);
        }
    }

    /**
     * Clears all registered instances.
     */
    public clear(): void {
        this.instances.clear();
        this.resolving.clear();
    }
}

/**
 * Global inject function.
 * Retrieves an instance of the provided token from the DI container.
 * @param token - The class/token to inject.
 */
export function inject<T>(token: ProviderToken<T>): T {
    return DIContainer.getInstance().resolve(token);
}
