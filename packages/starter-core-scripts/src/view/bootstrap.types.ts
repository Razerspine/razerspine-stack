import {ProviderToken} from '../core';
import {Route} from '../router';

/**
 * Interface defining a provider registration.
 */
export interface Provider {
    /** The class token to be used for injection. */
    provide: ProviderToken<any>;
    /** Optional: providing a ready-made instance. */
    useValue?: any;
    /** Optional: a factory function to create the instance. */
    useFactory?: () => any;
}

/**
 * Configuration object for the application startup.
 */
export interface AppConfig {
    /**
     * Array of route definitions for the Router.
     * Optional if routes are provided via provideRouter() in the providers array.
     */
    routes?: Route[];
    /** The ID of the HTML element where the app will render. Defaults to 'app-root'. */
    rootId?: string;
    /** Global services to be registered in the DI container before the app starts. */
    providers?: Provider[];
    /** Optional: Custom function to handle and render errors during bootstrap. */
    onError?: (error: Error) => void;
}
