import {describe, it, expect, vi} from 'vitest';
import {setupFixture} from '../fixtures/with-runtime/main';

describe('Pug UI Kit: Button Integration', () => {

    it('should toggle visibility via data-show', async () => {
        const initialState = {
            isDirty: false
        };
        const {container, state, cleanup} = setupFixture('./mixins/btn.pug', initialState);
        const saveBtn = container.querySelector('[data-click="save"]') as HTMLElement;

        expect(saveBtn.style.display).toBe('none');
        state.isDirty = true;
        await Promise.resolve();
        expect(saveBtn.style.display).toBe('');
        cleanup();
    });

    it('should call context method on click (data-click)', () => {
        const context = {reload: vi.fn()};
        const {container, cleanup} = setupFixture('./mixins/btn.pug', {isDirty: false}, context);
        const reloadBtn = container.querySelector('#reload-btn') as HTMLElement;

        reloadBtn.click();
        expect(context.reload).toHaveBeenCalled();
        cleanup();
    });
});
