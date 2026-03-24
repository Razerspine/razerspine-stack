import {describe, it, expect, vi} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('Button: Runtime Integration', () => {

    it('should toggle visibility via data-show', async () => {
        const initialState = {
            isDirty: false,
            text: 'Save',
            variant: 'primary',
            attrs: {
                'data-click': 'save'
            },
            bindings: {
                show: 'isDirty'
            }
        };

        const {container, state, cleanup} = setupFixture('./mixins/btn.pug', initialState);
        const saveBtn = container.querySelector('[data-click="save"]') as HTMLElement;
        expect(saveBtn.style.display).toBe('none');
        state.isDirty = true;
        await Promise.resolve();
        await new Promise(res => setTimeout(res, 0));

        expect(saveBtn.style.display).toBe('');
        cleanup();
    });

    it('should call context method on click (data-click)', () => {
        const context = {reload: vi.fn()};
        const initialState = {
            text: null,
            variant: 'icon-primary',
            size: 'small',
            iconName: 'refresh',
            attrs: {
                id: 'reload-btn'
            },
            bindings: {
                click: 'reload'
            }
        };

        const {container, cleanup} = setupFixture('./mixins/btn.pug', initialState, context);
        const reloadBtn = container.querySelector('#reload-btn') as HTMLElement;

        reloadBtn.click();
        expect(context.reload).toHaveBeenCalled();
        cleanup();
    });

    it('should toggle class via data-class binding', async () => {
        const initialState = {
            isActive: false,
            text: 'Toggle',
            bindings: {
                class: 'btn--active:isActive'
            }
        };

        const {container, state, cleanup} = setupFixture('./mixins/btn.pug', initialState);
        const btn = container.querySelector('button') as HTMLElement;

        expect(btn.getAttribute('data-class')).toBe('btn--active:isActive');
        expect(btn.classList.contains('btn--active')).toBe(false);

        state.isActive = true;

        await Promise.resolve();
        await new Promise(res => setTimeout(res, 0));

        expect(btn.classList.contains('btn--active')).toBe(true);
        cleanup();
    });

    it('should handle multiple class toggles via comma-separated data-class binding', async () => {
        const initialState = {
            isActive: true,
            isHidden: false,
            text: 'Multiple Toggle',
            bindings: {
                class: 'btn--active:isActive, hidden:isHidden'
            }
        };

        const {container, state, cleanup} = setupFixture('./mixins/btn.pug', initialState);
        const btn = container.querySelector('button') as HTMLElement;

        await Promise.resolve();
        await new Promise(res => setTimeout(res, 0));

        expect(btn.classList.contains('btn--active')).toBe(true);
        expect(btn.classList.contains('hidden')).toBe(false);

        state.isActive = false;
        state.isHidden = true;

        await Promise.resolve();
        await new Promise(res => setTimeout(res, 0));

        expect(btn.classList.contains('btn--active')).toBe(false);
        expect(btn.classList.contains('hidden')).toBe(true);

        cleanup();
    });
});
