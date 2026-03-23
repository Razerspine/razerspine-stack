import {describe, it, expect} from 'vitest';
import {setupFixture} from '../fixtures/with-runtime/main';

describe('Pug UI Kit: InputRadio Integration', () => {

    it('should render a radio group with shared model binding', () => {
        const initialState = {
            user: {
                gender: 'male'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', initialState);

        const maleRadio = container.querySelector('input#m') as HTMLInputElement;
        const femaleRadio = container.querySelector('input#f') as HTMLInputElement;

        expect(maleRadio.name).toBe('gender');
        expect(femaleRadio.name).toBe('gender');

        expect(maleRadio.getAttribute('data-model')).toBe('user.gender');
        expect(femaleRadio.getAttribute('data-model')).toBe('user.gender');

        expect(maleRadio.getAttribute('value')).toBe('male');
        expect(femaleRadio.getAttribute('value')).toBe('female');

        console.log('RADIO HTML:', container.innerHTML);

        cleanup();
    });

    it('should render correct labels for radio buttons', () => {
        const initialState = {
            user: {
                gender: 'female'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/input-radio.pug', initialState);

        const labels = container.querySelectorAll('label.check-control-label');

        expect(labels[0].getAttribute('for')).toBe('m');
        expect(labels[1].getAttribute('for')).toBe('f');

        const texts = container.querySelectorAll('.input-text');
        expect(texts[0].getAttribute('data-i18n')).toBe('Male');
        expect(texts[1].getAttribute('data-i18n')).toBe('Female');

        cleanup();
    });
});
