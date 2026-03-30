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
    scripts: 'ts',
    styles: 'scss',
    appType: 'mpa',
    templates: {
      entry: 'src/views/pages/',
    },
    resolve: {
      alias: {
        '@views': path.resolve(process.cwd(), 'src/views'),
        '@styles': path.resolve(process.cwd(), 'src/styles'),
        '@scripts': path.resolve(process.cwd(), 'src/scripts'),
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
