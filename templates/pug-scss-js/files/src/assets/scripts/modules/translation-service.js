/**
 * TranslationService
 *
 * - `locales` (map of localeCode -> translations) is required and must be provided by the caller.
 * - No internal logging; errors and missing keys are handled silently or with safe fallbacks.
 * - Caller is responsible for providing locale objects (e.g., import en from './en.json').
 *
 * @example
 * import en from '../../i18n/en.json';
 * import uk from '../../i18n/uk.json';
*  const locales = {en, uk};
 * const translationService = new TranslationService(locales, 'en');
 * translationService.init();
 */
export default class TranslationService {
  static STORAGE_KEY = 'lang';

  /**
   * @param {Object} locales - required map of localeCode -> translations
   * @param {string} [defaultLang='en'] - fallback language code
   */
  constructor(locales, defaultLang = 'en') {
    if (!locales || typeof locales !== 'object') {
      throw new Error('locales object is required. Provide { en, uk } or similar.');
    }

    /** @private {Object} */
    this.locales = locales;

    /** @private {string} */
    this.currentLang = defaultLang;

    /** @private {Object} */
    this.translations = this.locales[defaultLang] || {};
  }

  /**
   * Initialize service: apply saved or default language.
   * Safe to call multiple times.
   * @public
   */
  init() {
    const saved = this._getSavedLang() || this.currentLang;
    this.setLanguage(saved);
  }

  /**
   * Set active language and apply translations to the DOM.
   * If the requested language is not available, falls back to 'en' if present.
   * @param {string} lang
   * @public
   */
  setLanguage(lang) {
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
   * @param {string} path - dot-separated key, e.g. "header.title"
   * @param {string|null} [defaultValue=null] - fallback when key is missing
   * @returns {string|null}
   * @public
   */
  translate(path, defaultValue = null) {
    if (!path) return defaultValue ?? path;

    const value = path.split('.').reduce((obj, key) => {
      return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }, this.translations);

    if (value === undefined || value === null) {
      return defaultValue ?? path;
    }
    return value;
  }

  /**
   * Apply translations to elements with data-i18n attributes.
   * If an element has data-i18n-attr, the translated string is set as that attribute;
   * otherwise the element's textContent is replaced.
   * @public
   */
  applyTranslations() {
    const nodes = document.querySelectorAll('[data-i18n]');
    if (!nodes || nodes.length === 0) return;

    nodes.forEach((el) => {
      const key = el.dataset.i18n;
      const translated = this.translate(key);
      const attr = el.dataset.i18nAttr;
      if (attr) {
        try {
          el.setAttribute(attr, translated);
        } catch {
          // ignore attribute set errors
        }
      } else {
        el.textContent = translated;
      }
    });
  }

  /**
   * Get currently active language code.
   * @returns {string}
   * @public
   */
  getCurrentLang() {
    return this.currentLang;
  }

  /**
   * Read saved language from localStorage with safe fallback.
   * @returns {string|null}
   * @private
   */
  _getSavedLang() {
    try {
      return localStorage.getItem(TranslationService.STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Persist language to localStorage with safe fallback.
   * @param {string} lang
   * @private
   */
  _saveLang(lang) {
    try {
      localStorage.setItem(TranslationService.STORAGE_KEY, lang);
    } catch {
      // ignore storage errors (e.g., privacy mode)
    }
  }
}
