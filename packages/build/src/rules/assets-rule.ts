export function assetsRule() {
    return {
        oneOf: [
            {
                test: /\.(woff(2)?|ttf|otf|eot|svg)$/i,
                type: 'asset/resource',
                include: /assets\/fonts|node_modules/,
                generator: {
                    filename: 'fonts/[name][ext][query]',
                },
            },
            {
                test: /\.(png|jpe?g|svg|webp|ico)$/i,
                exclude: /assets\/fonts/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[hash:8][ext]',
                },
            },
            {
                test: /\.webmanifest$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'favicons/[name][ext]',
                },
            },
        ],
    };
}
