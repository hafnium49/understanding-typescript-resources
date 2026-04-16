// LESSON 208 — TEACHING WEBPACK ABOUT TYPESCRIPT FILES.
//
// The previous config told Webpack WHERE to start (entry) and WHERE
// to output (output). This version adds the three pieces that make
// TypeScript compilation actually work:
//
//   1. module.rules   — per-file-type processing instructions
//   2. resolve.extensions — which file extensions Webpack auto-adds
//   3. devtool        — how to hook up source maps for debugging
//
// LESSON 209 — HEADS-UP FOR THE NEXT LESSON (webpack-dev-server).
//
// The course was recorded against an older Webpack version. With the
// current Webpack (5.x) plus webpack-dev-server (4.x+), two extra
// settings are required for the dev-server to serve the root HTML
// and bundle correctly:
//
//   devServer: {
//     static: [ { directory: path.join(__dirname) } ]
//   }
//   // …and in the output block:
//   publicPath: '/dist/'
//
// Both adjustments are ACTUALLY APPLIED in the next snapshot
// (webpack-03-finished-dev-setup). They are mentioned here so you
// know to expect them — this current file (snapshot 02) does not
// yet need them because webpack-dev-server has not been introduced.
//
// COMMON MISTAKE: publicPath must be the STRING "/dist/" with a
// leading slash, not "dist" or "./dist". The leading slash makes
// the dev-server resolve it from the site root; a relative form
// breaks asset paths in the served HTML.
const path = require('path');

module.exports = {
  // MODE — required to silence the "fallback to production" warning
  // and to make source maps actually work in this snapshot.
  //
  // Without this, Webpack defaults to "production" mode, which
  // minifies the bundle AND overrides "devtool" so no usable source
  // maps reach the browser. Result: DevTools shows minified code and
  // no "webpack://" folder with the original .ts files.
  //
  // Setting "development" disables minification, keeps source maps
  // intact, and produces faster, debuggable builds. The course adds
  // this in the next snapshot (webpack-03), but it is needed here
  // too if you want to inspect TypeScript sources during this lesson.
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  // DEVTOOL — controls source map generation and wiring.
  //
  // "inline-source-map" embeds the source map inside the bundled
  // JavaScript as a base64 data URI. Since tsconfig.json's
  // "sourceMap": true causes ts-loader to emit source maps per
  // input file, this setting tells Webpack to EXTRACT those maps
  // and fold them into the final bundle output.
  //
  // Effect in the browser: DevTools → Sources shows the original
  // TypeScript files (under a synthetic "webpack://" folder) so
  // you can set breakpoints and step through .ts code instead of
  // the minified bundle.
  //
  // NOTE: the key is "devtool" (singular), not "devtools" — a
  // frequent typo that silently disables source maps.
  devtool: 'inline-source-map',

  // MODULE — per-file processing rules.
  //
  // In Webpack, a "module" is any file it processes (TypeScript,
  // CSS, images, etc.). "module.rules" is an array of rules that
  // tell Webpack HOW to handle each file based on its filename.
  // Only one rule is needed here (for TypeScript), but more can be
  // added for CSS, images, fonts, etc. in larger projects.
  module: {
    rules: [
      {
        // TEST — a regular expression that Webpack applies to each
        // file's path. If it matches, this rule runs for that file.
        // /\.ts$/ matches any file ending in ".ts".
        test: /\.ts$/,

        // USE — which LOADER processes the matching files. Loaders
        // are npm packages that transform file contents. ts-loader
        // invokes the TypeScript compiler internally to convert
        // .ts input into JavaScript for Webpack to bundle. It auto-
        // detects and respects tsconfig.json, so no duplicate
        // compiler options are needed here.
        use: 'ts-loader',

        // EXCLUDE — skip files matching this regex. The node_modules
        // folder is skipped because third-party packages ship
        // pre-compiled JavaScript (or their own type definitions);
        // re-compiling them through ts-loader would be slow and
        // usually redundant.
        exclude: /node_modules/
      }
    ]
  },

  // RESOLVE — how Webpack turns import specifiers into file paths.
  //
  // By default, Webpack only adds ".js" when resolving imports.
  // Here we also tell it to try ".ts" — so an import like
  // "./components/project-input" resolves to
  // "./components/project-input.ts" if that file exists.
  //
  // This is what allows the source files to use extension-less
  // imports even though Webpack and ts-loader are collaborating
  // on both TypeScript and plain JavaScript inputs.
  resolve: {
    extensions: ['.ts', '.js']
  }
};

// HOW TO INVOKE:
//
// In package.json, a "build" script runs the "webpack" command
// (picked up from node_modules by npm). From the terminal:
//
//   npm run build
//
// After a successful build, dist/bundle.js exists (minified to
// help reduce payload size) and index.html loads it in a single
// request — replacing the many per-file HTTP requests the old
// setup produced.