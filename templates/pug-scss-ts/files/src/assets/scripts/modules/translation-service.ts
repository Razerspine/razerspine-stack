export type Translations = Record<string, any>;
export type Locales = Record<string, Translations>;

export default class TranslationService {
  public static STORAGE_KEY = 'lang';

  private locales: Locales;
  private currentLang: string;
  private translations: Translations;

  /**
   * @param locales - required map of localeCode -> translations
   * @param defaultLang - fallback language code
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
   * Initialize service: apply saved or default language.
   */
  public init(): void {
    const saved = this._getSavedLang() || this.currentLang;
    this.setLanguage(saved);
  }

  /**
   * Set active language and apply translations to the DOM.
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
   * Resolve a translation by dot-separated path.
   * Returns defaultValue if key is missing; otherwise returns the found value.
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
   * Apply translations to elements with data-i18n attributes.
   * If an element has data-i18n-attr, the translated string is set as that attribute;
   * otherwise the element's textContent is replaced.
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
          // ignore attribute set errors
        }
      } else {
        el.textContent = translated ?? '';
      }
    });
  }

  /**
   * Get currently active language code.
   */
  public getCurrentLang(): string {
    return this.currentLang;
  }

  /**
   * Read saved language from localStorage with safe fallback.
   */
  private _getSavedLang(): string | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(TranslationService.STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Persist language to localStorage with safe fallback.
   */
  private _saveLang(lang: string): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(TranslationService.STORAGE_KEY, lang);
    } catch {
      // ignore storage errors (e.g., privacy mode)
    }
  }
}
