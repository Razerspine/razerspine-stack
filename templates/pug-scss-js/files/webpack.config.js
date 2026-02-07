const path = require("path");
const {
  createBaseConfig,
  createDevConfig,
  createProdConfig,
} = require("@razerspine/webpack-core");
const uiKit = require("@razerspine/pug-ui-kit");

/**
 * createBaseConfig:
 *  - mode: development | production
 *  - scripts: js | ts
 *  - styles: scss | less
 *  - templates: {
 *  -    entry: 'src/views/pages'
 *  - },
 *  - resolve: {
 *  -   alias: {...your_aliases}
 *  - }
 */
module.exports = (env = {}, argv = {}) => {
  const mode = argv?.mode || env?.mode || process.env.NODE_ENV || "development";

  const baseConfig = createBaseConfig({
    mode,
    scripts: "js",
    styles: "scss",
    templates: {
      entry: "src/views/pages/",
    },
    resolve: {
      alias: {
        "@views": path.resolve(process.cwd(), "src/views"),
        "@styles": path.resolve(process.cwd(), "src/assets/styles"),
        "@scripts": path.resolve(process.cwd(), "src/assets/scripts"),
        "@fonts": path.resolve(process.cwd(), "src/assets/fonts"),
        "@images": path.resolve(process.cwd(), "src/assets/images"),
        "@icons": path.resolve(process.cwd(), "src/assets/icons"),
        "pug-ui-kit": uiKit.paths.mixins,
      },
    },
  });

  if (mode === "development") {
    return createDevConfig(baseConfig);
  }

  return createProdConfig(baseConfig);
};
