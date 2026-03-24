import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('InputCheckbox: Runtime Integration', () => {

    it('should render checkbox with label and model binding', () => {
        const initialState = {
            id: 'agree',
            label: 'I agree to terms',
            name: 'agreed',
            value: 'true',
            checked: false,
            bindings: {
                model: 'form.agreed'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', initialState);

        const input = container.querySelector('input#agree') as HTMLInputElement;
        const label = container.querySelector('label');

        expect(input.getAttribute('data-model')).toBe('form.agreed');
        expect(input.checked).toBe(false);
        expect(input.type).toBe('checkbox');

        expect(label?.getAttribute('for')).toBe('agree');
        expect(label?.textContent).toBe('I agree to terms');

        cleanup();
    });

    it('should respect initial checked state and static disabled attribute', () => {
        const initialState = {
            id: 'newsletter',
            label: 'Subscribe',
            checked: true,
            attrs: {
                disabled: true
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', initialState);

        const input = container.querySelector('input#newsletter') as HTMLInputElement;

        expect(input.checked).toBe(true);
        expect(input.disabled).toBe(true);

        cleanup();
    });

    it('should render correct value attribute for checkbox groups', () => {
        const initialState = {
            id: 'role-admin',
            name: 'roles[]',
            value: 'admin',
            label: 'Administrator'
        };
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', initialState);

        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.getAttribute('value')).toBe('admin');
        expect(input.name).toBe('roles[]');

        cleanup();
    });

    it('should apply additional runtime bindings', () => {
        const initialState = {
            id: 'extra-opt',
            bindings: {
                show: 'isExtraOptionVisible',
                click: 'onOptionClick'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', initialState);

        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.getAttribute('data-show')).toBe('isExtraOptionVisible');
        expect(input.getAttribute('data-click')).toBe('onOptionClick');

        cleanup();
    });
});
