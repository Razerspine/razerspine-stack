import {ConfigOptionType} from '../types';

export function scriptsRule(env: ConfigOptionType) {
    if (env.scripts === 'ts') {
        return {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader',
                options: {
                    transpileOnly: env.mode === 'development',
                },
            },
        };
    }

    return {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
    };
}
