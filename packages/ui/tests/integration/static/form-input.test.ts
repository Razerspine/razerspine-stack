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
});
