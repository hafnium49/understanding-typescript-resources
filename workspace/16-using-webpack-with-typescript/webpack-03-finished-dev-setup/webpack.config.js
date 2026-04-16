// Lesson 210: Finished development setup for webpack + webpack-dev-server.
//
// Two changes were applied in this lesson on top of the prior config:
//   1. "mode: 'development'" added at the top of the exported object.
//   2. "publicPath: '/dist/'" added inside the "output" block.
// Both are explained in detail next to their respective keys below.

const path = require('path');

module.exports = {
  // MODE — tells webpack the kind of build it is producing.
  //
  // "development" turns OFF expensive optimizations (minification,
  // tree-shaking, etc.) so builds are fast and the output is readable.
  // It also produces more meaningful error messages and integrates
  // cleanly with source maps for easier debugging.
  //
  // For shipping to users, switch to "production" (covered in a later
  // lesson) — that mode enables all optimizations and produces a
  // smaller, faster bundle.
  mode: 'development',
  entry: './src/app.ts',
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // PUBLICPATH — the URL prefix the dev server uses to serve the
    // in-memory bundle.
    //
    // index.html loads the bundle via <script src="dist/bundle.js">.
    // By default, webpack-dev-server serves index.html from the project
    // root but does not know that the bundle should be exposed under
    // the "/dist/" URL path. Without publicPath, requests for
    // "dist/bundle.js" fail and the page crashes.
    //
    // Setting publicPath to "/dist/" tells the dev server: "expose the
    // generated bundle under this URL prefix." Now <script src="dist/...">
    // in index.html resolves correctly to the in-memory bundle.
    //
    // This setting only matters during development — the production
    // build writes the actual file to the dist folder on disk.
    publicPath: '/dist/'
  },
  devtool: 'inline-source-map',
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
  }
};