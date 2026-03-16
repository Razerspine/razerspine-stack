/**
 * Represents a dictionary of translation keys and their corresponding values.
 * Can be a flat object or deeply nested to support dot-notation paths.
 * * @example
 * { greeting: "Hello", errors: { notFound: "Page not found" } }
 */
export type Translations = Record<string, any>;

/**
 * A mapping of locale codes (e.g., 'en', 'uk', 'fr') to their respective translation dictionaries.
 * * @example
 * {
 * en: { greeting: "Hello" },
 * uk: { greeting: "Привіт" }
 * }
 */
export type Locales = Record<string, Translations>;
