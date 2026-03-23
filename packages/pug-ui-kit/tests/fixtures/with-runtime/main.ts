import * as pug from 'pug';
import * as path from 'path';
import {createStore, applyBindings, bindClickEvents, bindForms} from '@razerspine/runtime';

export function setupFixture(
    template: string,
    initialState: any,
    context: any = {}
) {
    const pugPath = path.resolve(__dirname, template);

    const html = pug.renderFile(pugPath, {
        ...initialState,
        self: false,
        compileDebug: false,
        filename: pugPath
    });

    const container = document.createElement('div');
    container.innerHTML = html;

    const {state, disconnect} = createStore(initialState, () => {
        applyBindings(container, state);
    });

    applyBindings(container, state);

    const cleanupClicks = bindClickEvents(container, context);
    const cleanupForms = bindForms(container, context, state);

    return {
        container,
        state,
        cleanup: () => {
            cleanupClicks();
            cleanupForms();
            disconnect();
        }
    };
}
