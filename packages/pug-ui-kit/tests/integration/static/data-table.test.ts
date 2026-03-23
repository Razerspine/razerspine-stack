import {describe, it, expect} from 'vitest';
import {setupFixture} from '../../fixtures/without-runtime/main';

describe('DataTable: Static Integration', () => {
    it('should humanize column headers when labels are not provided', () => {
        const state = {
            users: [
                {first_name: 'John', user_role: 'admin'}
            ]
        };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', state);

        const headers = Array.from(container.querySelectorAll('th.data-table__header'));
        const texts = headers.map(h => h.textContent?.trim());

        expect(texts).toContain('First name');
        expect(texts).toContain('User role');
        cleanup();
    });

    it('should format array values using join(", ")', () => {
        const state = {
            users: [{name: 'Project', tags: ['web', 'ui', 'kit']}]
        };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', state);

        const cells = Array.from(container.querySelectorAll('.data-table__cell'));

        expect(cells[1].textContent).toBe('web, ui, kit');
        cleanup();
    });

    it('should correctly format different data types', () => {
        const state = {
            users: [{
                name: 'Alice',
                tags: ['admin', 'dev'],
                meta: {age: 25}
            }]
        };
        const {container, cleanup} = setupFixture('./mixins/data-table.pug', state);

        const cells = container.querySelectorAll('.data-table__cell');

        expect(cells[0].textContent).toBe('Alice');
        expect(cells[1].textContent).toBe('admin, dev');
        expect(cells[2].textContent).toBe('{"age":25}');

        cleanup();
    });
});
