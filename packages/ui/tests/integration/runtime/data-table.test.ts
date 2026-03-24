import {describe, it, expect, vi} from 'vitest';
import {setupFixture} from '../../fixtures/with-runtime/main';

describe('DataTable: Runtime Integration', () => {

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

    it('should call action handler with correct ID and event arguments', () => {
        const deleteMock = vi.fn();
        const initialState = {
            isTableVisible: true,
            users: [{id: 42, name: 'John Doe'}]
        };
        const context = { deleteUser: deleteMock };

        const {container, cleanup} = setupFixture('./mixins/data-table.pug', initialState, context);
        const actionBtn = container.querySelector('[data-click="deleteUser(42)"]') as HTMLElement;

        actionBtn.click();

        expect(deleteMock).toHaveBeenCalledWith(42, expect.anything(), expect.anything());
        cleanup();
    });

    it('should apply table-level bindings for reactive visibility', () => {
        const initialState = { isTableVisible: true, users: [{id: 1}] };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', initialState);

        const table = container.querySelector('table');
        expect(table?.getAttribute('data-show')).toBe('isTableVisible');
        cleanup();
    });

    it('should render empty state message when items are empty', () => {
        const initialState = { isTableVisible: true, users: [] };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', initialState);

        const emptyCell = container.querySelector('thead th');
        expect(emptyCell?.textContent).toContain('No data');
        expect(container.querySelectorAll('tbody tr').length).toBe(0);
        cleanup();
    });

    it('should respect custom labels and humanize snake_case keys', () => {
        const initialState = {
            isTableVisible: true,
            users: [{ name: 'Alice', joined_at: '2024-01-01' }]
        };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', initialState);

        const headers = Array.from(container.querySelectorAll('th.data-table__header'));
        const headerTexts = headers.map(th => th.textContent?.trim());

        expect(headerTexts).toContain('Full Name');
        expect(headerTexts).toContain('Joined at');

        cleanup();
    });

    it('should render row indices when showIndex is true', () => {
        const initialState = {
            isTableVisible: true,
            users: [{id: 10}, {id: 20}]
        };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', initialState);

        const indices = Array.from(container.querySelectorAll('td.data-table__index'));

        expect(indices[0].textContent).toBe('1');
        expect(indices[1].textContent).toBe('2');
        cleanup();
    });
});
