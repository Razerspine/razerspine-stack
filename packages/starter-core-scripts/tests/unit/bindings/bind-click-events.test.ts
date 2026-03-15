import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {bindClickEvents} from '../../../src';
import {silenceConsole} from '../../helpers/silence-console';

describe('bindClickEvents', () => {

    let warnSpy: any;

    beforeEach(() => {
        warnSpy = silenceConsole('warn');
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

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

    it('should ignore missing handler functions and log warning', () => {
        document.body.innerHTML = `
            <button data-click="missingHandler"></button>
        `;

        const context = {};

        bindClickEvents(document.body, context);

        const button = document.querySelector('button')!;

        expect(() => button.click()).not.toThrow();

        expect(warnSpy).toHaveBeenCalled();
    });
});
