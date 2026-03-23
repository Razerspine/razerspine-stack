import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('Pug UI Kit: FormInput Integration', () => {

    it('should render input with correct attributes and label', () => {
        const initialState = {
            user: {
                name: 'John'
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
});
