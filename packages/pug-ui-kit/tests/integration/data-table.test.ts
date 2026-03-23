import {describe, it, expect, vi} from 'vitest';
import {setupFixture} from '../fixtures/with-runtime/main';

describe('Pug UI Kit: DataTable Integration', () => {

    it('should call action handler via runtime bindings', () => {
        const deleteMock = vi.fn();
        const initialState = {
            isTableVisible: true,
            users: [
                {id: 1, name: 'Alice'}
            ]
        };
        const userId = initialState.users[0].id;
        const context = {deleteUser: deleteMock};

        const {container, cleanup} = setupFixture('./mixins/data-table.pug', initialState, context);
        const actionBtn = container.querySelector(`[data-click="deleteUser(${userId})"]`) as HTMLElement;

        actionBtn.click();
        expect(deleteMock).toHaveBeenCalledWith(userId, expect.anything(), expect.anything());

        cleanup();
    });

    it('should render rows based on items', () => {
        const initialState = {
            isTableVisible: true,
            users: [
                {id: 1, name: 'A'},
                {id: 2, name: 'B'}
            ]
        };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', initialState);

        expect(container.querySelectorAll('tbody tr').length).toBe(2);

        cleanup();
    });
});
