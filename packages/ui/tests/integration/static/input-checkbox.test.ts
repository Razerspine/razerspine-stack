import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('InputCheckbox: Static Integration', () => {

    it('should render checkbox with label and i18n support', () => {
        const state = {
            id: 'terms',
            label: 'Agree to terms',
            checked: true
        };
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', state);

        const input = container.querySelector('input');
        const textSpan = container.querySelector('.input-text');

        expect(input?.getAttribute('type')).toBe('checkbox');
        expect(input?.hasAttribute('checked')).toBe(true);
        expect(textSpan?.getAttribute('data-i18n')).toBe('Agree to terms');
        cleanup();
    });

    it('should include reactive bindings as data attributes', () => {
        const state = {
            id: 'notif',
            label: 'Notify',
            bindings: {
                model: 'settings.notify',
                show: 'isPro'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', state);
        const input = container.querySelector('input');

        expect(input?.getAttribute('data-model')).toBe('settings.notify');
        expect(input?.getAttribute('data-show')).toBe('isPro');
        cleanup();
    });
});
