import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('FormTextarea: Runtime Integration', () => {

    it('should apply reactive visibility and rows via attributes', () => {
        const initialState = {
            id: 'feedback',
            label: 'Feedback',
            attrs: {
                rows: 10
            },
            bindings: {
                show: 'isFeedbackVisible'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-textarea.pug', initialState);

        const textarea = container.querySelector('#feedback') as HTMLTextAreaElement;

        expect(textarea.getAttribute('data-show')).toBe('isFeedbackVisible');
        expect(textarea.getAttribute('rows')).toBe('10');
        expect(textarea.classList.contains('form-textarea')).toBe(true);

        cleanup();
    });

    it('should apply model binding for two-way sync', () => {
        const initialState = {
            id: 'comment',
            label: 'Comment',
            bindings: {
                model: 'post.comment'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-textarea.pug', initialState);

        const textarea = container.querySelector('#comment');
        expect(textarea?.getAttribute('data-model')).toBe('post.comment');

        cleanup();
    });
});
