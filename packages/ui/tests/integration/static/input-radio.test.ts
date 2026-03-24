import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('InputRadio: Static Integration', () => {

    it('should render radio input with correct attributes and label', () => {
        const state = {
            id: 'gender-m',
            label: 'Male',
            name: 'gender',
            value: 'male'
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', state);

        const input = container.querySelector('input');
        const label = container.querySelector('label');
        const textSpan = container.querySelector('.input-text');

        expect(input?.getAttribute('type')).toBe('radio');
        expect(input?.id).toBe('gender-m');
        expect(input?.name).toBe('gender');
        expect(input?.value).toBe('male');

        expect(label?.getAttribute('for')).toBe('gender-m');
        expect(textSpan?.getAttribute('data-i18n')).toBe('Male');
        expect(textSpan?.textContent).toBe('Male');

        cleanup();
    });

    it('should apply base class and merge custom classes', () => {
        const state = {
            id: 'opt1',
            label: 'Option 1',
            name: 'group',
            value: '1',
            attrs: {class: 'custom-radio-style'}
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', state);
        const input = container.querySelector('input');

        expect(input?.className).toContain('input-base');
        expect(input?.className).toContain('custom-radio-style');
        cleanup();
    });

    it('should respect the checked state', () => {
        const state = {
            id: 'opt-checked',
            label: 'Selected',
            name: 'group',
            value: 'val',
            checked: true
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', state);
        const input = container.querySelector('input');

        expect(input?.hasAttribute('checked')).toBe(true);
        cleanup();
    });

    it('should render reactive bindings as data-attributes', () => {
        const state = {
            id: 'r1',
            label: 'Radio',
            name: 'g1',
            value: 'v1',
            bindings: {
                model: 'profile.gender',
                click: 'onRadioClick'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', state);
        const input = container.querySelector('input');

        expect(input?.getAttribute('data-model')).toBe('profile.gender');
        expect(input?.getAttribute('data-click')).toBe('onRadioClick');
        cleanup();
    });
});
