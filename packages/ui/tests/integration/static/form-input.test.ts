import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('FormInput: Static Integration', () => {

    it('should link label to input via "for" and "id"', () => {
        const state = {
            type: 'text',
            id: 'user-email',
            label: 'Email Address'
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', state);

        const label = container.querySelector('label');
        const input = container.querySelector('input');

        expect(label?.getAttribute('for')).toBe('user-email');
        expect(input?.id).toBe('user-email');
        expect(label?.textContent).toBe('Email Address');
        cleanup();
    });

    it('should render data-model and maintain form-control class', () => {
        const state = {
            type: 'password',
            id: 'pass',
            bindings: {
                model: 'user.password'
            },
            attrs: {
                class: 'is-invalid'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', state);
        const input = container.querySelector('input');

        expect(input?.getAttribute('data-model')).toBe('user.password');
        expect(input?.className).toContain('form-control');
        expect(input?.className).toContain('is-invalid');
        cleanup();
    });

    it('should not render label if it is null or empty', () => {
        const initialState = {
            type: 'text',
            id: 'no-label-input',
            label: null
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', initialState);

        const label = container.querySelector('label');
        expect(label).toBeNull();

        cleanup();
    });

    it('should merge custom classes with the default form-control class', () => {
        const initialState = {
            type: 'text',
            id: 'custom-class-input',
            attrs: {
                class: 'mb-3 is-invalid'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', initialState);
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input.classList.contains('form-control')).toBe(true);
        expect(input.classList.contains('mb-3')).toBe(true);
        expect(input.classList.contains('is-invalid')).toBe(true);

        cleanup();
    });

    it('should apply additional HTML attributes like required or readonly', () => {
        const initialState = {
            type: 'number',
            id: 'numeric-input',
            attrs: {
                required: true,
                readonly: true,
                min: '0',
                max: '100'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', initialState);
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input.hasAttribute('required')).toBe(true);
        expect(input.readOnly).toBe(true);
        expect(input.getAttribute('min')).toBe('0');
        expect(input.getAttribute('max')).toBe('100');

        cleanup();
    });

    it('should correctly render password type and specific name/value', () => {
        const initialState = {
            type: 'password',
            id: 'pass-field',
            name: 'user_password',
            value: 'secret123'
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', initialState);
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input.type).toBe('password');
        expect(input.name).toBe('user_password');
        expect(input.value).toBe('secret123');

        cleanup();
    });
});
