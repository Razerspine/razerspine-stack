import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('SingleSelect: Static Integration', () => {
    it('should render options from an array of strings', () => {
        const state = {
            id: 'role',
            options: ['Admin', 'Editor']
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);
        const options = container.querySelectorAll('option');

        expect(options[0].value).toBe('');
        expect(options[1].value).toBe('Admin');
        expect(options[2].textContent).toBe('Editor');
        cleanup();
    });

    it('should render options from an array of objects with custom keys', () => {
        const state = {
            id: 'country',
            options: [{code: 'UA', name: 'Ukraine'}],
            labelKey: 'name',
            valueKey: 'code'
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);
        const option = container.querySelector('option[value="UA"]');

        expect(option?.textContent).toBe('Ukraine');
        expect(option?.getAttribute('data-opt-value')).toBe('UA');
        cleanup();
    });

    it('should mark the selected value', () => {
        const state = {
            id: 'status',
            options: ['Active', 'Pending'],
            selectedValue: 'Pending'
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);

        const selected = container.querySelector('option[selected]') as HTMLOptionElement | null;

        expect(selected?.value).toBe('Pending');
        cleanup();
    });
});
