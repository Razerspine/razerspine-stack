import {describe, it, expect, beforeEach, vi} from 'vitest';
import {ThemeService} from '../../../src';

function createStorageMock() {
    const store: Record<string, string> = {};

    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
    }
}

describe('ThemeService', () => {

    beforeEach(() => {
        document.documentElement.removeAttribute('data-theme');
    });

    it('initializes with fallback theme', () => {
        const service = new ThemeService({
            storage: null,
            fallback: 'dark'
        });

        service.init();

        expect(service.getTheme()).toBe('dark');
    });

    it('reads theme from storage on init', () => {
        const storage = createStorageMock();

        storage.getItem.mockReturnValue('dark');

        const service = new ThemeService({storage});

        service.init();

        expect(service.getTheme()).toBe('dark');
    });

    it('detects system theme when no storage value exists', () => {
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
            matches: true
        }));

        const service = new ThemeService({
            storage: null
        });

        service.init();

        expect(service.getTheme()).toBe('dark');
    });

    it('applies theme to DOM when autoApply enabled', () => {
        const service = new ThemeService();

        service.init();

        const attr = document.documentElement.getAttribute('data-theme');

        expect(attr === 'dark' || attr === 'light').toBe(true);
    });

    it('does not apply DOM attribute when autoApply disabled', () => {
        const service = new ThemeService({
            autoApply: false
        });

        service.init();

        expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('sets theme programmatically', () => {
        const service = new ThemeService();

        service.init();

        service.setTheme('dark');

        expect(service.getTheme()).toBe('dark');
    });

    it('persists theme when setTheme is called', () => {
        const storage = createStorageMock();

        const service = new ThemeService({storage});

        service.init();

        service.setTheme('dark');

        expect(storage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('notifies listeners on theme change', () => {
        const service = new ThemeService();

        service.init();

        const listener = vi.fn();

        service.onChange(listener);

        service.setTheme('dark');

        expect(listener).toHaveBeenCalledWith('dark');
    });

    it('unsubscribe listener correctly', () => {
        const service = new ThemeService();

        service.init();

        const listener = vi.fn();

        const unsubscribe = service.onChange(listener);

        unsubscribe();

        service.setTheme('dark');

        expect(listener).not.toHaveBeenCalled();
    });

    it('destroy clears listeners and resets state', () => {
        const service = new ThemeService();

        service.init();

        const listener = vi.fn();

        service.onChange(listener);

        service.destroy();

        expect(service.getTheme()).toBe(null);
    });
});
