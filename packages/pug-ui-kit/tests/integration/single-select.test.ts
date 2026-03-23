import {describe, it, expect} from 'vitest';
import {setupFixture} from '../fixtures/with-runtime/main';

describe('Pug UI Kit: SingleSelect Integration', () => {

    it('should apply reactive model binding (data-model)', () => {
        const initialState = {
            user: {
                role: 'Admin'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', initialState);

        const select = container.querySelector('select');

        expect(select?.getAttribute('data-model')).toBe('user.role');
        cleanup();
    });

    it('should render correct options from string array', () => {
        const initialState = {
            user: {
                role: ''
            }
        }
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', initialState);
        const options = container.querySelectorAll('option');

        expect(options[0].textContent).toBe('Admin');
        expect(options[1].textContent).toBe('User');
        cleanup();
    });
});
