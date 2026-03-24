import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('FormTextarea: Static Integration', () => {

    it('should link label to textarea and render correct placeholder', () => {
        const state = {
            id: 'user-bio',
            label: 'Biography',
            placeholder: 'Tell us about yourself...',
            name: 'bio'
        };
        const {container, cleanup} = setupFixture('./mixins/form-textarea.pug', state);

        const label = container.querySelector('label');
        const textarea = container.querySelector('textarea');

        expect(textarea?.id).toBe('user-bio');
        expect(label?.getAttribute('for')).toBe('user-bio');

        expect(textarea?.getAttribute('name')).toBe('bio');
        expect(textarea?.getAttribute('placeholder')).toBe('Tell us about yourself...');

        expect(label?.textContent).toBe('Biography');
        expect(label?.getAttribute('data-i18n')).toBe('Biography');

        cleanup();
    });

    it('should merge .form-textarea class with custom classes from attrs', () => {
        const state = {
            id: 'comment',
            label: 'Comment',
            attrs: {
                class: 'custom-note',
                rows: 10
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-textarea.pug', state);
        const textarea = container.querySelector('textarea');

        expect(textarea?.className).toContain('form-textarea');
        expect(textarea?.className).toContain('custom-note');

        expect(textarea?.getAttribute('rows')).toBe('10');

        cleanup();
    });

    it('should render reactive bindings as data-attributes', () => {
        const state = {
            id: 'feedback',
            label: 'Feedback',
            bindings: {
                model: 'form.feedback',
                show: 'isFeedbackEnabled'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-textarea.pug', state);
        const textarea = container.querySelector('textarea');

        expect(textarea?.getAttribute('data-model')).toBe('form.feedback');
        expect(textarea?.getAttribute('data-show')).toBe('isFeedbackEnabled');

        cleanup();
    });

    it('should not render label if label parameter is null', () => {
        const state = {
            id: 'simple-area',
            label: null
        };
        const {container, cleanup} = setupFixture('./mixins/form-textarea.pug', state);

        const label = container.querySelector('label');
        expect(label).toBeNull();

        cleanup();
    });
});
