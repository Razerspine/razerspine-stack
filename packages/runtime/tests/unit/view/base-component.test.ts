import {describe, it, expect, beforeEach, vi} from 'vitest';
import {BaseComponent} from '../../../src';
import * as bindings from '../../../src/view/bindings';

vi.mock('../../../src/view/bindings', () => ({
    applyBindings: vi.fn(),
    bindForms: vi.fn(() => vi.fn()),
    bindClickEvents: vi.fn(() => vi.fn()),
}));

interface TestState {
    count: number;
    text: string;
}

class TestComponent extends BaseComponent<TestState> {
    public onInitCalled = false;
    public onDestroyCalled = false;

    constructor(container: HTMLElement, initialState: TestState) {
        super(container, initialState);
    }

    public updateCount(val: number) {
        this.setState({count: val});
    }

    async render() {
        this.container.innerHTML = '<div></div>';
    }

    async onInit() {
        this.onInitCalled = true;
    }

    onDestroy() {
        this.onDestroyCalled = true;
    }
}

describe('BaseComponent', () => {
    let container: HTMLElement;
    let component: TestComponent;
    const initialState = {count: 0, text: 'hello'};

    beforeEach(() => {
        container = document.createElement('div');
        component = new TestComponent(container, initialState);
        vi.clearAllMocks();
    });

    describe('Lifecycle & Mounting', () => {
        it('should execute lifecycle hooks in the correct order', async () => {
            const renderSpy = vi.spyOn(component, 'render');
            const updateSpy = vi.spyOn(component as any, 'update');
            const onInitSpy = vi.spyOn(component as any, 'onInit');

            await component.mount();

            expect(renderSpy).toHaveBeenCalled();
            expect(updateSpy).toHaveBeenCalled();
            expect(onInitSpy).toHaveBeenCalled();
            expect(component.onInitCalled).toBe(true);
        });
    });

    describe('State Management via setState', () => {

        it('should correctly merge partial state', () => {
            const updateSpy = vi.spyOn(component as any, 'update');

            component.updateCount(10);

            expect(component['state'].count).toBe(10);
            expect(component['state'].text).toBe('hello');
            expect(updateSpy).toHaveBeenCalledTimes(1);
        });

        it('should trigger DOM bindings update on state change', () => {
            component.updateCount(5);

            expect(bindings.applyBindings).toHaveBeenCalledWith(
                container,
                expect.objectContaining({count: 5})
            );
        });
    });

    describe('Cleanup & Destruction', () => {

        it('should clean up all resources on destroy', async () => {
            const clickCleanup = vi.fn();
            const formCleanup = vi.fn();
            (bindings.bindClickEvents as any).mockReturnValue(clickCleanup);
            (bindings.bindForms as any).mockReturnValue(formCleanup);

            await component.mount();
            component.destroy();

            expect(component.onDestroyCalled).toBe(true);
            expect(clickCleanup).toHaveBeenCalled();
            expect(formCleanup).toHaveBeenCalled();
            expect(container.innerHTML).toBe('');
        });

        it('should disconnect the store listener on destroy', async () => {
            const updateSpy = vi.spyOn(component as any, 'update');
            await component.mount();
            vi.clearAllMocks();

            component.destroy();

            component.updateCount(99);

            expect(updateSpy).not.toHaveBeenCalled();
        });
    });
});
