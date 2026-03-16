import {Locales, Translations} from './translation.types';

/**
 * Service responsible for handling internationalization (i18n).
 * Manages locale state, persistence, string resolution via dot-notation,
 * and automatic DOM translation application.
 */
export class TranslationService {
    /** * The key used to persist the selected language in localStorage.
     * @default 'lang'
     */
    public static readonly STORAGE_KEY = 'lang';

    private readonly locales: Locales;
    private currentLang: string;
    private translations: Translations;

    /**
     * Creates an instance of the TranslationService.
     * @param locales - A required map of locale codes to their translation objects.
     * @param defaultLang - The fallback language code to use if no stored preference is found. Defaults to 'en'.
     * @throws {Error} If the `locales` object is missing or invalid.
     */
    constructor(locales: Locales, defaultLang = 'en') {
        if (!locales || typeof locales !== 'object') {
            throw new Error(
                'locales object is required. Provide { en, uk } or similar.',
            );
        }

        this.locales = locales;
        this.currentLang = defaultLang;
        this.translations = this.locales[defaultLang] || {};
    }

    /**
     * Initializes the service.
     * It waits for the DOM to be fully loaded before applying the saved or default language
     * to ensure all `[data-i18n]` elements are present in the document.
     */
    public init(): void {
        if (typeof document === 'undefined') return;

        const launch = () => {
            const saved = this._getSavedLang() || this.currentLang;
            this.setLanguage(saved);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', launch);
        } else {
            launch();
        }
    }

    /**
     * Sets the active language, updates internal state, persists the choice,
     * and triggers a DOM update to reflect the new translations.
     * Fallbacks to 'en' if the requested language does not exist in the provided locales.
     * * @param lang - The locale code to switch to (e.g., 'en', 'uk').
     */
    public setLanguage(lang: string): void {
        if (!lang) return;

        if (this.locales[lang]) {
            this.translations = this.locales[lang];
            this.currentLang = lang;
        } else {
            this.translations = this.locales.en || {};
            this.currentLang = 'en';
        }

        this._saveLang(this.currentLang);

        try {
            this.applyTranslations();
        } catch {
            // silently ignore DOM application errors
        }
    }

    /**
     * Resolves a translation string using a dot-separated path.
     * @param path - The dot-notation path to the translation key (e.g., 'auth.login.title').
     * @param defaultValue - An optional fallback string if the key is not found.
     * @returns The resolved translation string, the `defaultValue`, or the `path` itself if no default is provided.
     */
    public translate(
        path: string,
        defaultValue: string | null = null,
    ): string | null {
        if (!path) return defaultValue ?? path;

        const parts = path.split('.');
        let value: any = this.translations;

        for (const key of parts) {
            if (value && Object.prototype.hasOwnProperty.call(value, key)) {
                value = value[key];
            } else {
                value = undefined;
                break;
            }
        }

        if (value === undefined || value === null) {
            return defaultValue ?? path;
        }

        // ensure returned value is string (fallback to toString if needed)
        return typeof value === 'string' ? value : String(value);
    }

    /**
     * Scans the DOM for elements with the `data-i18n` attribute and translates them.
     * - If `data-i18n-attr="[attribute]"` is present, the translation is applied to that specific attribute (e.g., placeholder, alt).
     * - Otherwise, the translation replaces the element's `textContent`.
     */
    public applyTranslations(): void {
        if (typeof document === 'undefined') return;

        const nodes = document.querySelectorAll<HTMLElement>('[data-i18n]');
        if (!nodes || nodes.length === 0) return;

        nodes.forEach((el) => {
            const key = el.dataset?.i18n;
            if (!key) return;

            const translated = this.translate(key);
            const attr = el.dataset?.i18nAttr;

            if (attr) {
                try {
                    el.setAttribute(attr, translated ?? '');
                } catch {
                    // ignore attribute set errors (e.g., invalid attribute names)
                }
            } else {
                el.textContent = translated ?? '';
            }
        });
    }

    /**
     * Retrieves the currently active language code.
     * @returns The current locale code string.
     */
    public getCurrentLang(): string {
        return this.currentLang;
    }

    /**
     * Safely reads the saved language preference from localStorage.
     * @returns The stored language code, or null if unavailable or an error occurs.
     */
    private _getSavedLang(): string | null {
        try {
            if (typeof localStorage === 'undefined') return null;
            return localStorage.getItem(TranslationService.STORAGE_KEY);
        } catch {
            // handle cases where localStorage is blocked (e.g., strict privacy settings)
            return null;
        }
    }

    /**
     * Safely persists the language preference to localStorage.
     * @param lang - The language code to save.
     */
    private _saveLang(lang: string): void {
        try {
            if (typeof localStorage === 'undefined') return;
            localStorage.setItem(TranslationService.STORAGE_KEY, lang);
        } catch {
            // ignore storage errors (e.g., privacy mode, QuotaExceededError)
        }
    }
}
