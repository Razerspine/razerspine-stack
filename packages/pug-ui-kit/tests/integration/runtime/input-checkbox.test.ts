import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('Pug UI Kit: InputCheckbox Integration', () => {

    it('should render checkbox with label and model binding', () => {
        const initialState = {
            form: {
                agreed: false
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', initialState);

        const input = container.querySelector('input#agree') as HTMLInputElement;

        expect(input.getAttribute('data-model')).toBe('form.agreed');

        expect(input.checked).toBe(false);

        cleanup();
    });

    it('should respect initial checked state', () => {
        const {container, cleanup} = setupFixture('./mixins/input-checkbox.pug', {});

        const newsletter = container.querySelector('input#newsletter') as HTMLInputElement;
        expect(newsletter.checked).toBe(true);
        expect(newsletter.disabled).toBe(true);

        cleanup();
    });
});
