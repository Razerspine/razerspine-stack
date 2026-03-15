import {describe, it, expect, beforeEach} from 'vitest';
import {TranslationService} from '../../../src';

const locales = {
    en: {
        auth: {
            login: {
                title: 'Login'
            }
        },
        button: {
            save: 'Save'
        }
    },
    uk: {
        auth: {
            login: {
                title: 'Вхід'
            }
        },
        button: {
            save: 'Зберегти'
        }
    }
};

describe('TranslationService', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
    });

    it('throws if locales object is missing', () => {
        expect(() => new TranslationService(null as any)).toThrow();
    });

    it('initializes with default language', () => {
        const service = new TranslationService(locales);

        expect(service.getCurrentLang()).toBe('en');
    });

    it('sets language correctly', () => {
        const service = new TranslationService(locales);

        service.setLanguage('uk');

        expect(service.getCurrentLang()).toBe('uk');
    });

    it('falls back to en when language does not exist', () => {
        const service = new TranslationService(locales);

        service.setLanguage('fr');

        expect(service.getCurrentLang()).toBe('en');
    });

    it('persists language to localStorage', () => {
        const service = new TranslationService(locales);

        service.setLanguage('uk');

        expect(localStorage.getItem('lang')).toBe('uk');
    });

    it('reads saved language on init', () => {
        localStorage.setItem('lang', 'uk');

        const service = new TranslationService(locales);

        service.init();

        expect(service.getCurrentLang()).toBe('uk');
    });

    it('resolves translation via dot notation', () => {
        const service = new TranslationService(locales);

        const result = service.translate('auth.login.title');

        expect(result).toBe('Login');
    });

    it('returns default value if translation missing', () => {
        const service = new TranslationService(locales);

        const result = service.translate('missing.key', 'fallback');

        expect(result).toBe('fallback');
    });

    it('returns path if translation missing and no default provided', () => {
        const service = new TranslationService(locales);

        const result = service.translate('missing.key');

        expect(result).toBe('missing.key');
    });

    it('applies translation to textContent', () => {
        document.body.innerHTML = `
            <span data-i18n="button.save"></span>
        `;

        const service = new TranslationService(locales);

        service.applyTranslations();

        const el = document.querySelector('[data-i18n]');

        expect(el?.textContent).toBe('Save');
    });

    it('applies translation to attribute when data-i18n-attr is present', () => {
        document.body.innerHTML = `
            <input data-i18n="button.save" data-i18n-attr="placeholder" />
        `;

        const service = new TranslationService(locales);

        service.applyTranslations();

        const el = document.querySelector('input');

        expect(el?.getAttribute('placeholder')).toBe('Save');
    });

    it('updates DOM when language changes', () => {
        document.body.innerHTML = `
            <span data-i18n="button.save"></span>
        `;

        const service = new TranslationService(locales);

        service.setLanguage('uk');

        const el = document.querySelector('[data-i18n]');

        expect(el?.textContent).toBe('Зберегти');
    });
});
