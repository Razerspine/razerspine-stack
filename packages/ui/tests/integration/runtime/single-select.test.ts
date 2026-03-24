import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('SingleSelect: Runtime Integration', () => {

    it('should apply reactive model binding (data-model)', () => {
        const initialState = {
            id: 'role-select',
            label: 'User Role',
            options: ['Admin', 'User', 'Guest'],
            bindings: {
                model: 'user.role'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', initialState);

        const select = container.querySelector('select#role-select');
        expect(select?.getAttribute('data-model')).toBe('user.role');

        const options = container.querySelectorAll('option');
        expect(options.length).toBe(3);
        expect(options[0].textContent?.trim()).toBe('Admin');

        cleanup();
    });

    it('should render correct options from object array using labelKey and valueKey', () => {
        const initialState = {
            id: 'country-select',
            options: [
                {id: 1, name: 'Ukraine'},
                {id: 2, name: 'Poland'}
            ],
            labelKey: 'name',
            valueKey: 'id',
            selectedValue: 1
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', initialState);
        const options = container.querySelectorAll('option');

        expect(options.length).toBe(2);
        expect(options[0].value).toBe('1');
        expect(options[0].textContent?.trim()).toBe('Ukraine');

        expect((options[0] as HTMLOptionElement).selected).toBe(true);

        cleanup();
    });

    it('should have required attribute by default and support multiple bindings', () => {
        const initialState = {
            id: 'security-level',
            options: ['Low', 'High'],
            bindings: {
                model: 'settings.level',
                show: 'isAdmin',
                click: 'logSelection'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', initialState);
        const select = container.querySelector('select') as HTMLSelectElement;

        expect(select.required).toBe(true);

        expect(select.getAttribute('data-model')).toBe('settings.level');
        expect(select.getAttribute('data-show')).toBe('isAdmin');
        expect(select.getAttribute('data-click')).toBe('logSelection');

        cleanup();
    });
});
