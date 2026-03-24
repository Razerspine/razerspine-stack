import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('InputRadio: Runtime Integration', () => {

    it('should render a radio group where both buttons share the same model', () => {
        const initialState = {
            name: 'gender',
            radioItems: [
                {id: 'm', label: 'Male', value: 'male', checked: true},
                {id: 'f', label: 'Female', value: 'female', checked: false}
            ],
            bindings: {
                model: 'user.gender'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', initialState);

        const radios = container.querySelectorAll('input[type="radio"]');

        expect(radios.length).toBe(2);

        radios.forEach((radio, index) => {
            const input = radio as HTMLInputElement;
            expect(input.name).toBe('gender');
            expect(input.getAttribute('data-model')).toBe('user.gender');
            expect(input.value).toBe(initialState.radioItems[index].value);
        });

        cleanup();
    });

    it('should apply static attributes from attrs to all items in the group', () => {
        const initialState = {
            radioItems: [
                {id: 'r1', label: 'Opt 1', value: '1'}
            ],
            attrs: {
                disabled: true,
                class: 'custom-radio'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', initialState);

        const input = container.querySelector('input') as HTMLInputElement;

        expect(input.disabled).toBe(true);
        expect(input.classList.contains('custom-radio')).toBe(true);

        cleanup();
    });
});
