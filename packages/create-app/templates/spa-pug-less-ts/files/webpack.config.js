const path = require('path');
const {defineConfig} = require('@razerspine/build');
const uiKit = require('@razerspine/ui');

module.exports = defineConfig({
  scripts: 'ts',
  styles: 'less',
  appType: 'spa',
  templates: {
    type: 'pug',
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
