import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('FormInput: Runtime Integration', () => {

    it('should render input with correct attributes and label', () => {
        const initialState = {
            type: 'text',
            id: 'user-name',
            label: 'Username',
            placeholder: 'Enter name',
            name: 'username',
            value: 'John',
            attrs: {
                class: 'form-control'
            },
            bindings: {
                model: 'user.name'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', initialState);

        const label = container.querySelector('label.form-label');
        const input = container.querySelector('input#user-name') as HTMLInputElement;

        expect(label?.textContent).toBe('Username');
        expect(label?.getAttribute('for')).toBe('user-name');

        expect(input.type).toBe('text');
        expect(input.name).toBe('username');
        expect(input.placeholder).toBe('Enter name');

        expect(input.classList.contains('form-control')).toBe(true);
        expect(input.getAttribute('data-model')).toBe('user.name');

        cleanup();
    });

    it('should support multiple runtime bindings (show, model)', () => {
        const initialState = {
            type: 'text',
            id: 'reactive-input',
            bindings: {
                model: 'user.email',
                show: 'isEmailVisible'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-input.pug', initialState);
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input.getAttribute('data-model')).toBe('user.email');
        expect(input.getAttribute('data-show')).toBe('isEmailVisible');

        cleanup();
    });
});
