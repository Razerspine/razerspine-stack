import PugPlugin from 'pug-plugin';

export function pugRule() {
    return {
        test: /\.pug$/,
        oneOf: [
            {
                issuer: /\.(js|ts|tsx|jsx)$/,
                loader: PugPlugin.loader,
                options: {
                    method: 'compile',
                },
            },
            {
                loader: PugPlugin.loader,
                options: {
                    method: 'render',
                },
            },
        ],
    };
}
