import {describe, it, expect, vi} from 'vitest';
import {bindClickEvents} from '../../src';

describe('bindClickEvents', () => {

    it('should call context method with event and element', () => {
        document.body.innerHTML = `
            <div id="container">
                <button data-click="handleClick">Click Me</button>
            </div>
        `;

        const context = {
            handleClick: vi.fn()
        };
        const container = document.getElementById('container')!;
        const button = document.querySelector('button')!;

        const unbind = bindClickEvents(container, context);

        button.click();

        expect(context.handleClick).toHaveBeenCalledWith(
            expect.any(MouseEvent),
            button
        );

        expect(context.handleClick.mock.instances[0]).toBe(context);

        unbind();
    });

    it('should find nearest ancestor with [data-click]', () => {
        document.body.innerHTML = `
            <div data-click="parentClick">
                <span id="child">Deep Child</span>
            </div>
        `;
        const context = {parentClick: vi.fn()};
        bindClickEvents(document.body, context);

        document.getElementById('child')!.click();

        expect(context.parentClick).toHaveBeenCalled();
    });
});
