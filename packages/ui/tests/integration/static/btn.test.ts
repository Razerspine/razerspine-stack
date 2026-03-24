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
});
