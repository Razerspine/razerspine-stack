import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('Button: Static Integration', () => {

    it('should combine base classes with custom classes from attrs', () => {
        const state = {
            text: 'Save',
            variant: 'primary',
            attrs: {
                class: 'custom-btn'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.className).toContain('custom-btn');
        expect(btn?.className).toContain('btn--primary');
        expect(btn?.className).toContain('btn--medium');
        cleanup();
    });

    it('should render icon and set aria-hidden if text is present', () => {
        const state = {
            text: 'Delete',
            iconName: 'trash'
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const svg = container.querySelector('svg');

        expect(svg).not.toBeNull();
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
        cleanup();
    });

    it('should generate aria-label from iconName for icon-only buttons', () => {
        const state = {
            text: null,
            iconName: 'refresh_icon'
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.getAttribute('aria-label')).toBe('refresh icon');
        cleanup();
    });

    it('should render data-click attribute from bindings', () => {
        const state = {
            text: 'Click',
            bindings: {
                click: 'doSomething()'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.getAttribute('data-click')).toBe('doSomething()');
        cleanup();
    });

    it('should render default type and classes when minimal args provided', () => {
        const state = {};
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.className).toContain('btn--primary');
        expect(btn?.className).toContain('btn--medium');
        expect(btn?.getAttribute('type')).toBe('button');

        cleanup();
    });

    it('should auto-add data-i18n attribute for visible text', () => {
        const state = {
            text: 'Submit'
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.getAttribute('data-i18n')).toBe('Submit');

        cleanup();
    });

    it('should not override existing data-i18n attribute from attrs', () => {
        const state = {
            text: 'Save',
            attrs: {
                'data-i18n': 'custom_save_key'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.getAttribute('data-i18n')).toBe('custom_save_key');

        cleanup();
    });

    it('should set role="img" on svg for icon-only buttons (empty or whitespace text)', () => {
        const state = {
            text: '   ',
            iconName: 'settings'
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const svg = container.querySelector('svg');

        expect(svg?.getAttribute('role')).toBe('img');
        expect(svg?.hasAttribute('aria-hidden')).toBe(false);
        cleanup();
    });

    it('should auto-add data-i18n and data-i18n-attr for generated aria-label in icon-only buttons', () => {
        const state = {
            text: null,
            iconName: 'user-profile'
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.getAttribute('data-i18n')).toBe('user profile');
        expect(btn?.getAttribute('data-i18n-attr')).toBe('aria-label');

        cleanup();
    });

    it('should respect existing aria-label and not generate a new one', () => {
        const state = {
            text: null,
            iconName: 'edit',
            attrs: {
                'aria-label': 'Edit Item'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.getAttribute('aria-label')).toBe('Edit Item');
        expect(btn?.hasAttribute('data-i18n-attr')).toBe(false);

        cleanup();
    });

    it('should spread generic attributes onto the button element', () => {
        const state = {
            text: 'Test',
            attrs: {
                id: 'test-btn',
                disabled: true,
                'data-custom': '123'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/btn.pug', state);
        const btn = container.querySelector('button');

        expect(btn?.id).toBe('test-btn');
        expect(btn?.hasAttribute('disabled')).toBe(true);
        expect(btn?.getAttribute('data-custom')).toBe('123');

        cleanup();
    });
});
