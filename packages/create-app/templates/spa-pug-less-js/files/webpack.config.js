const path = require('path');
const {
  createBaseConfig,
  createDevConfig,
  createProdConfig,
} = require('@razerspine/build');
const uiKit = require('@razerspine/ui');

module.exports = (env = {}, argv = {}) => {
  const mode = argv?.mode || env?.mode || process.env.NODE_ENV || 'development';

  const baseConfig = createBaseConfig({
    mode,
    scripts: 'js',
    styles: 'less',
    appType: 'spa',
    templates: {
      entry: 'src/app/app.pug',
    },
    resolve: {
      alias: {
        '@app': path.resolve(process.cwd(), 'src/app'),
        '@pages': path.resolve(process.cwd(), 'src/pages'),
        '@shared': path.resolve(process.cwd(), 'src/shared'),
        '@styles': path.resolve(process.cwd(), 'src/styles'),
        '@images': path.resolve(process.cwd(), 'src/assets/images'),
        '@icons': path.resolve(process.cwd(), 'src/assets/icons'),
        'pug-mixins': uiKit.paths.mixins,
      },
    },
  });

  if (mode === 'development') {
    return createDevConfig(baseConfig);
  }

  return createProdConfig(baseConfig);
};
