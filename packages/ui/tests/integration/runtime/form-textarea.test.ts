import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('FormTextarea: Runtime Integration', () => {

    it('should handle reactive visibility and custom attributes', async () => {
        const initialState = {
            isFeedbackVisible: false,
            post: {
                comment: ''
            }
        };
        const {container, state, cleanup} = setupFixture('./mixins/form-textarea.pug', initialState);

        const feedbackTextarea = container.querySelector('#feedback') as HTMLElement;

        expect(feedbackTextarea.style.display).toBe('none');
        expect(feedbackTextarea.getAttribute('rows')).toBe('10');

        state.isFeedbackVisible = true;
        await Promise.resolve();

        expect(feedbackTextarea.style.display).toBe('');

        cleanup();
    });

    it('should apply model binding for two-way sync', () => {
        const initialState = {
            isFeedbackVisible: true,
            post: {
                comment: 'Initial comment'
            }
        };
        const {container, cleanup} = setupFixture('./mixins/form-textarea.pug', initialState);

        const commentTextarea = container.querySelector('#comment');
        expect(commentTextarea?.getAttribute('data-model')).toBe('post.comment');

        cleanup();
    });
});
