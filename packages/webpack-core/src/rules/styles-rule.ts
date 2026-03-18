import {ConfigOptionType} from '../types';

export function stylesRule(env: ConfigOptionType) {
    const isLess = env.styles === 'less';

    return {
        test: isLess ? /\.(css|less)$/ : /\.(css|scss|sass)$/,
        use: [
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ['autoprefixer']
                    }
                }
            },
            isLess
                ? {
                    loader: 'less-loader',
                    options: {
                        lessOptions: {javascriptEnabled: true}
                    }
                }
                : 'sass-loader'
        ]
    };
}
