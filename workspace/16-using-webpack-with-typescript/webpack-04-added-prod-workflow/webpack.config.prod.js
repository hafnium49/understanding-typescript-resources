// Lesson 211: Production webpack configuration.
//
// Webpack does NOT look for this filename automatically — its default
// is webpack.config.js. To use this file, the build script in package.json
// passes "--config webpack.config.prod.js" to the webpack CLI.
//
// This file is a copy of the development config with three production-
// oriented adjustments:
//   - mode is "production" (full optimizations, minification, tree-shaking)
//   - publicPath is REMOVED (production output is written to disk, not
//     served from memory by webpack-dev-server)
//   - devtool is omitted (no source maps needed for end-user delivery)
// Plus one new addition: the clean-webpack-plugin, configured below.

const path = require('path');
// CLEAN-WEBPACK-PLUGIN — clears the output folder before each build.
//
// Installed with: npm install --save-dev clean-webpack-plugin
//
// Without it, leftover files from previous builds can accumulate in the
// dist folder. With it, the dist folder always contains ONLY the latest
// build artifacts. The constant name "CleanPlugin" is just a chosen alias
// — the package exports an object whose CleanWebpackPlugin property is
// the actual plugin constructor.
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  // PRODUCTION MODE — opposite of "development":
  // enables minification, tree-shaking, and other optimizations that
  // shrink the bundle and speed up runtime, at the cost of slower builds
  // and unreadable output. Always use "production" for code that ships
  // to end users.
  mode: 'production',
  entry: './src/app.ts',
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  // OUTPUT — note the absence of "publicPath" here.
  //
  // publicPath was needed in the development config so webpack-dev-server
  // could serve the in-memory bundle at the right URL. In production we
  // run plain "webpack" (no dev server), and the bundle is written
  // directly to disk in the "dist" folder. Whatever serves the dist
  // folder in production (a CDN, web server, etc.) handles URL paths,
  // so webpack does not need to know about them.
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // NOTE: "devtool" is omitted entirely (equivalent to "none").
  // Source maps are a development debugging aid — not normally shipped
  // to production end users.
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  // PLUGINS — extensions applied to the OVERALL build, not per-file.
  //
  // Compare with module.rules above: those describe how to transform
  // INDIVIDUAL files (e.g., run .ts files through ts-loader). Plugins,
  // by contrast, hook into the build lifecycle and act on the whole
  // bundling process — generating files, cleaning folders, injecting
  // banners, optimizing assets, etc.
  plugins: [
    // Each plugin must be INSTANTIATED with "new" before being added
    // to the array. The clean plugin takes no arguments here, but it
    // accepts options for advanced cases (e.g., excluding certain files
    // from deletion).
    new CleanPlugin.CleanWebpackPlugin()
  ]
};