import {describe, it, expect, beforeEach} from 'vitest';
import {BaseComponent} from '../../src';

interface Item {
    id: number;
    text: string;
}

interface ListState {
    items: Item[];
    title: string;
}

class ListComponent extends BaseComponent<ListState> {
    constructor(container: HTMLElement) {
        super(container, {
            title: 'My Tasks',
            items: [
                {id: 1, text: 'First task'},
                {id: 2, text: 'Second task'}
            ]
        });
    }

    public setTitle(title: string): void {
        this.setState({title});
    }

    public setItems(items: Item[]): void {
        this.setState({items});
    }

    public addTask(text: string): void {
        const newId = this.state.items.length + 1;
        this.setState({
            items: [...this.state.items, {id: newId, text}]
        });
    }

    render() {
        this.container.innerHTML = `
            <h1 id="list-title" data-bind="title"></h1>
            <ul id="task-list" data-for="task:items">
                <li class="task-item">
                    <span class="index" data-bind="task_index"></span>
                    <span class="content" data-bind="task.text"></span>
                </li>
            </ul>
        `;
    }
}

describe('E2E: List Rendering (Smart Patching Flow)', () => {
    let container: HTMLElement;
    let component: ListComponent;

    beforeEach(async () => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app')!;
        component = new ListComponent(container);
        await component.mount();
    });

    it('should render initial list correctly', () => {
        const items = container.querySelectorAll('.task-item');
        expect(items.length).toBe(2);
        expect(items[0].querySelector('.content')?.textContent).toBe('First task');
    });

    it('should reuse DOM nodes when adding items (No more full re-render)', async () => {
        const oldFirstItem = container.querySelector('.task-item');

        component.addTask('New Task');

        const items = container.querySelectorAll('.task-item');
        const newFirstItem = container.querySelector('.task-item');

        expect(items.length).toBe(3);
        expect(items[2].textContent).toContain('New Task');
        expect(oldFirstItem).toBe(newFirstItem); // Referential equality check
    });

    it('should preserve focus or state inside list items during title update', async () => {
        const oldList = container.querySelector('#task-list');

        component.setTitle('New List Title');

        const titleEl = container.querySelector('#list-title');
        const newList = container.querySelector('#task-list');

        expect(titleEl?.textContent).toBe('New List Title');
        expect(oldList).toBe(newList);
        expect(container.querySelectorAll('.task-item').length).toBe(2);
    });

    it('should correctly map nested properties and indexes', async () => {
        const items = container.querySelectorAll('.task-item');

        expect(items[0].querySelector('.index')?.textContent).toBe('0');
        expect(items[1].querySelector('.index')?.textContent).toBe('1');
        expect(items[1].querySelector('.content')?.textContent).toBe('Second task');
    });

    it('should preserve unmanaged input state during list update', async () => {
        const firstItem = container.querySelector('.task-item')!;
        const input = document.createElement('input');
        input.className = 'custom-input';
        firstItem.appendChild(input);

        input.value = 'User text';

        component.addTask('Another task');

        const preservedInput = container.querySelector('.custom-input') as HTMLInputElement;
        expect(preservedInput).not.toBeNull();
        expect(preservedInput.value).toBe('User text');
    });

    it('should preserve manually attached event listeners due to node reuse', async () => {
        const firstItem = container.querySelector('.task-item') as HTMLElement;
        let clicked = false;

        firstItem.addEventListener('click', () => {
            clicked = true;
        });

        component.addTask('Third task');

        const updatedFirstItem = container.querySelector('.task-item') as HTMLElement;
        updatedFirstItem.click();

        expect(clicked).toBe(true);
        expect(firstItem).toBe(updatedFirstItem);
    });

    it('should handle transition from populated list to empty and back (DOM Hygiene)', async () => {
        // Clear
        component.setItems([]);
        const list = container.querySelector('#task-list');
        expect(container.querySelectorAll('.task-item').length).toBe(0);
        expect(list?.innerHTML).toBe('');

        // Restore
        component.setItems([{id: 1, text: 'Back again'}]);
        expect(container.querySelectorAll('.task-item').length).toBe(1);
        expect(container.querySelector('.content')?.textContent).toBe('Back again');
    });

    it('should correctly remove multiple elements from the end while keeping the rest', async () => {
        component.setItems([
            {id: 1, text: '1'},
            {id: 2, text: '2'},
            {id: 3, text: '3'},
            {id: 4, text: '4'}
        ]);

        const secondNodeBefore = container.querySelectorAll('.task-item')[1];

        component.setItems([
            {id: 1, text: 'Updated 1'},
            {id: 2, text: 'Updated 2'}
        ]);

        const items = container.querySelectorAll('.task-item');
        expect(items.length).toBe(2);
        expect(items[1]).toBe(secondNodeBefore);
        expect(items[1].querySelector('.content')?.textContent).toBe('Updated 2');
    });
});
