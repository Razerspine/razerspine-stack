import * as pug from 'pug';
import * as path from 'path';

export function setupFixture(template: string, state: any = {}) {
    const pugPath = path.resolve(__dirname, template);

    const html = pug.renderFile(pugPath, {
        ...state,
        self: false,
        compileDebug: false,
        filename: pugPath
    });

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    return {
        container,
        cleanup: () => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }
    };
}
