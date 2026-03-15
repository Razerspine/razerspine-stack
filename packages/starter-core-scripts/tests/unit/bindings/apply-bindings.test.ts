import {describe, it, expect, beforeEach} from 'vitest';
import {applyBindings} from '../../../src';

describe('applyBindings', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should render lists with [data-for] and handle indexes', () => {
        document.body.innerHTML = `
            <ul data-for="item:items">
                <li><span data-bind="item"></span> (index: <span data-bind="item_index"></span>)</li>
            </ul>
        `;
        const state = {items: ['Apple', 'Banana']};

        applyBindings(document.body, state);

        const listItems = document.querySelectorAll('li');
        expect(listItems.length).toBe(2);
        expect(listItems[0].textContent).toContain('Apple (index: 0)');
        expect(listItems[1].textContent).toContain('Banana (index: 1)');
    });

    it('should toggle visibility with [data-show] and negation', () => {
        document.body.innerHTML = `
            <div id="box1" data-show="isVisible">Visible</div>
            <div id="box2" data-show="!isVisible">Hidden</div>
        `;
        const state = {isVisible: true};

        applyBindings(document.body, state);
        expect(document.getElementById('box1')!.style.display).toBe('');
        expect(document.getElementById('box2')!.style.display).toBe('none');

        applyBindings(document.body, {isVisible: false});
        expect(document.getElementById('box1')!.style.display).toBe('none');
        expect(document.getElementById('box2')!.style.display).toBe('');
    });

    it('should toggle classes with [data-class]', () => {
        document.body.innerHTML = '<div data-class="active:isActive, red:isError"></div>';
        const el = document.querySelector('div')!;

        applyBindings(document.body, {isActive: true, isError: false});
        expect(el.classList.contains('active')).toBe(true);
        expect(el.classList.contains('red')).toBe(false);

        applyBindings(document.body, {isActive: false, isError: true});
        expect(el.classList.contains('active')).toBe(false);
        expect(el.classList.contains('red')).toBe(true);
    });

    it('should not leak bindings into nested [data-for]', () => {
        document.body.innerHTML = `
            <div id="parent" data-bind="outer">
                <div data-for="item:items">
                    <span data-bind="item"></span>
                </div>
            </div>
        `;
        const state = {outer: 'Root', items: ['Inner']};

        applyBindings(document.body, state);

        expect(document.getElementById('parent')!.firstChild?.textContent?.trim()).toContain('Root');
    });

    it('should render nothing when array is empty', () => {
        document.body.innerHTML = `
            <ul data-for="item:items">
                <li data-bind="item"></li>
            </ul>
        `;

        applyBindings(document.body, {items: []});

        const listItems = document.querySelectorAll('li');

        expect(listItems.length).toBe(0);
    });

    it('should update list when data changes', () => {
        document.body.innerHTML = `
            <ul data-for="item:items">
                <li data-bind="item"></li>
            </ul>
        `;

        applyBindings(document.body, {items: ['A']});

        applyBindings(document.body, {items: ['A', 'B', 'C']});

        const listItems = document.querySelectorAll('li');

        expect(listItems.length).toBe(3);
    });

    it('should bind text content using [data-bind]', () => {
        document.body.innerHTML = `
            <span data-bind="username"></span>
        `;

        applyBindings(document.body, {username: 'Alice'});

        const span = document.querySelector('span')!;

        expect(span.textContent).toBe('Alice');
    });

    it('should handle undefined values in bindings', () => {
        document.body.innerHTML = `
            <span data-bind="missing"></span>
        `;

        applyBindings(document.body, {});

        const span = document.querySelector('span')!;

        expect(span.textContent).toBe('');
    });

    it('should combine data-for and data-bind correctly', () => {
        document.body.innerHTML = `
            <ul data-for="user:users">
                <li>
                    <span data-bind="user.name"></span>
                </li>
            </ul>
        `;

        const state = {
            users: [
                {name: 'Alice'},
                {name: 'Bob'}
            ]
        };

        applyBindings(document.body, state);

        const items = document.querySelectorAll('li');

        expect(items[0].textContent).toContain('Alice');
        expect(items[1].textContent).toContain('Bob');
    });
});
