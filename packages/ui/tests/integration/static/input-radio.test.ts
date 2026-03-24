import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('InputRadio: Static Integration', () => {

    it('should render radio input with correct attributes and label structure', () => {
        const state = {
            name: 'gender',
            radioItems: [
                {id: 'gender-m', label: 'Male', value: 'male'}
            ]
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', state);

        const input = container.querySelector('input');
        const label = container.querySelector('label');
        const textSpan = container.querySelector('.input-text');

        expect(input?.getAttribute('type')).toBe('radio');
        expect(input?.id).toBe('gender-m');
        expect(input?.name).toBe('gender');

        expect(label?.getAttribute('for')).toBe('gender-m');
        expect(textSpan?.getAttribute('data-i18n')).toBe('Male');
        expect(textSpan?.textContent?.trim()).toBe('Male');

        cleanup();
    });

    it('should correctly merge classes and handle checked state', () => {
        const state = {
            radioItems: [
                {id: 'opt-1', label: 'Selected', value: 'val', checked: true}
            ],
            attrs: {
                class: 'custom-radio-style'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', state);

        const input = container.querySelector('input');

        expect(input?.className).toContain('custom-radio-style');
        expect(input?.hasAttribute('checked')).toBe(true);

        cleanup();
    });

    it('should render multiple items in the group correctly', () => {
        const state = {
            name: 'choice',
            radioItems: [
                {id: '1', label: 'One', value: '1'},
                {id: '2', label: 'Two', value: '2'},
                {id: '3', label: 'Three', value: '3'}
            ]
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', state);

        const radios = container.querySelectorAll('input');
        const labels = container.querySelectorAll('label');

        expect(radios.length).toBe(3);
        expect(labels[2].getAttribute('for')).toBe('3');
        expect(labels[2].textContent?.trim()).toBe('Three');

        cleanup();
    });

    it('should render reactive bindings on each radio in the group', () => {
        const state = {
            radioItems: [
                {id: 'r1', label: 'Radio', value: 'v1'}
            ],
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
