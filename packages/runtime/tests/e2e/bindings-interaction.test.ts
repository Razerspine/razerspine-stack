import {describe, it, expect, beforeEach} from 'vitest';
import {BaseComponent} from '../../src';

/**
 * Interface for the test component state
 */
interface TestState {
    count: number;
    username: string;
    isVisible: boolean;
    isActive: boolean;
}

/**
 * A comprehensive component to test all binding types in a single flow.
 */
class InteractionComponent extends BaseComponent<TestState> {
    constructor(container: HTMLElement) {
        super(container, {
            count: 0,
            username: '',
            isVisible: true,
            isActive: false
        });
    }

    /**
     * Increment counter method for data-click
     */
    public increment(): void {
        this.setState({count: this.state.count + 1});
    }

    /**
     * Toggle visibility and class state
     */
    public toggleStatus(): void {
        this.setState({
            isVisible: !this.state.isVisible,
            isActive: !this.state.isActive
        });
    }

    async render() {
        this.container.innerHTML = `
            <div id="test-wrapper">
                <h1 id="display-count" data-bind="count"></h1>
                <p id="display-name" data-bind="username"></p>

                <input id="name-input" type="text" data-model="username" />

                <button id="btn-increment" data-click="increment">Add</button>
                <button id="btn-toggle" data-click="toggleStatus">Toggle</button>

                <div id="status-box" data-show="isVisible">Visible Content</div>

                <div id="styled-box" data-class="highlighted:isActive, shadow:isVisible">
                    Styled Box
                </div>
            </div>
        `;
    }
}

describe('E2E: Bindings & Interaction Flow', () => {
    let container: HTMLElement;
    let component: InteractionComponent;

    beforeEach(async () => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app')!;

        component = new InteractionComponent(container);
        await component.mount();
    });

    it('should synchronize initial state to DOM (Initial Render)', () => {
        const countDisplay = container.querySelector('#display-count');
        const statusBox = container.querySelector<HTMLElement>('#status-box');

        expect(countDisplay?.textContent).toBe('0');
        expect(statusBox?.style.display).not.toBe('none');
    });

    it('should update DOM when state changes via method (data-click -> method -> update)', async () => {
        const btn = container.querySelector<HTMLElement>('#btn-increment')!;
        const display = container.querySelector('#display-count')!;

        btn.click();

        expect(display.textContent).toBe('1');

        btn.click();
        expect(display.textContent).toBe('2');
    });

    it('should implement two-way data binding (data-model -> state -> data-bind)', () => {
        const input = container.querySelector<HTMLInputElement>('#name-input')!;
        const display = container.querySelector('#display-name')!;

        input.value = 'John Doe';
        input.dispatchEvent(new Event('input', {bubbles: true}));
        
        expect(display.textContent).toBe('John Doe');
    });

    it('should toggle visibility based on state (data-show)', () => {
        const toggleBtn = container.querySelector<HTMLElement>('#btn-toggle')!;
        const statusBox = container.querySelector<HTMLElement>('#status-box')!;

        expect(statusBox.style.display).not.toBe('none');

        toggleBtn.click();
        expect(statusBox.style.display).toBe('none');

        toggleBtn.click();
        expect(statusBox.style.display).not.toBe('none');
    });

    it('should toggle CSS classes based on state rules (data-class)', () => {
        const toggleBtn = container.querySelector<HTMLElement>('#btn-toggle')!;
        const styledBox = container.querySelector<HTMLElement>('#styled-box')!;

        expect(styledBox.classList.contains('shadow')).toBe(true);
        expect(styledBox.classList.contains('highlighted')).toBe(false);

        toggleBtn.click();

        expect(styledBox.classList.contains('highlighted')).toBe(true);
        expect(styledBox.classList.contains('shadow')).toBe(false);
    });

    it('should clean up event listeners on destroy', () => {
        const btn = container.querySelector<HTMLElement>('#btn-increment')!;

        component.destroy();

        btn.click();

        expect(container.innerHTML).toBe('');
    });
});
