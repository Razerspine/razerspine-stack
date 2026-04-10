const path = require('path');
const {defineConfig} = require('@razerspine/build');
const uiKit = require('@razerspine/ui');

module.exports = defineConfig({
  scripts: 'js',
  styles: 'scss',
  appType: 'mpa',
  templates: {
    type: 'pug',
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
