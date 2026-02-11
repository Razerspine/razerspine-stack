const path = require('path');

module.exports = {
  paths: {
    fonts: path.join(__dirname, 'fonts'),
    scss: path.join(__dirname, 'scss'),
    less: path.join(__dirname, 'less'),
    style: path.join(__dirname, 'style'),
    mixins: path.join(__dirname, 'mixins')
  },
  // helper
  getStylePath: (type = 'scss') => path.join(__dirname, type, `ui-kit.${type}`)
};
