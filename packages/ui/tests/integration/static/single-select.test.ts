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

    it('should render placeholder as the first disabled option', () => {
        const state = {
            id: 'test-select',
            placeholder: 'Select a fruit...',
            options: ['Apple', 'Banana']
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);

        const firstOption = container.querySelector('option');

        expect(firstOption?.textContent?.trim()).toBe('Select a fruit...');
        expect(firstOption?.disabled).toBe(true);
        expect(firstOption?.value).toBe('');

        cleanup();
    });

    it('should merge custom classes and handle additional attributes', () => {
        const state = {
            id: 'styled-select',
            options: [],
            attrs: {
                class: 'custom-select-lg',
                required: true
            }
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);

        const select = container.querySelector('select');

        expect(select?.classList.contains('custom-select-lg')).toBe(true);
        expect(select?.hasAttribute('required')).toBe(true);

        cleanup();
    });

    it('should render label with correct i18n attribute', () => {
        const state = {
            id: 'lang-select',
            label: 'Choose Language',
            options: []
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);

        const label = container.querySelector('label');
        expect(label?.getAttribute('for')).toBe('lang-select');
        expect(label?.getAttribute('data-i18n')).toBe('Choose Language');

        cleanup();
    });

    it('should NOT render placeholder option if label is present', () => {
        const state = {
            id: 'test-id',
            label: 'My Label',
            placeholder: 'Should not see me',
            options: ['Opt 1']
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);

        const options = container.querySelectorAll('option');
        expect(options.length).toBe(1);
        expect(options[0].textContent).toBe('Opt 1');

        const label = container.querySelector('label');
        expect(label).not.toBeNull();

        cleanup();
    });

    it('should correctly render data-opt-value and data-i18n for options', () => {
        const state = {
            id: 'category',
            options: [
                {value: 'cat_1', text: 'Electronics'}
            ]
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);
        const option = container.querySelector('option[value="cat_1"]');

        expect(option?.getAttribute('data-opt-value')).toBe('cat_1');
        expect(option?.getAttribute('data-i18n')).toBe('Electronics');

        cleanup();
    });

    it('should allow overriding default required attribute via attrs', () => {
        const state = {
            id: 'optional-select',
            options: ['Option'],
            attrs: {
                required: false
            }
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);
        const select = container.querySelector('select');

        expect(select?.hasAttribute('required')).toBe(false);

        cleanup();
    });

    it('should use default labelKey "text" and valueKey "value" if not provided', () => {
        const state = {
            id: 'default-keys',
            options: [
                {value: 'v1', text: 'T1'}
            ]
        };
        const {container, cleanup} = setupFixture('./mixins/single-select.pug', state);

        const options = container.querySelectorAll('option');
        expect(options[1].value).toBe('v1');
        expect(options[1].textContent?.trim()).toBe('T1');

        cleanup();
    });
});
