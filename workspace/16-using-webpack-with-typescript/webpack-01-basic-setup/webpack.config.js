// LESSON 207 — CREATING webpack.config.js.
//
// Webpack reads its settings from a file named EXACTLY
// "webpack.config.js" at the project root. The filename is the
// default convention; Webpack will auto-discover this file when
// invoked via the CLI.
//
// This file runs in a Node.js environment (not in the browser), so:
//   - "require(...)" is used to import built-in modules.
//   - "module.exports = {...}" is how Node.js scripts export a value
//     (here, the Webpack configuration object).
//   - The "__dirname" global is available and resolves to the
//     absolute path of the folder containing this file.
//
// "path" is a CORE Node.js module (no npm install needed). It's
// imported here to build an absolute filesystem path for the Webpack
// output location.
const path = require('path');

module.exports = {
  // ENTRY — the single file that starts the application.
  // Webpack reads this file, follows its imports, then follows the
  // imports of THOSE files, and so on, discovering the entire module
  // graph. All reachable code will be bundled into the output file.
  entry: './src/app.ts',

  // OUTPUT — where the bundled result is written.
  output: {
    // FILENAME — the name of the generated JavaScript bundle.
    // You can use placeholders here (e.g., "[contenthash]") for
    // cache-busting, but "bundle.js" keeps it simple for now.
    filename: 'bundle.js',

    // PATH — must be an ABSOLUTE path. Unlike tsconfig's "outDir",
    // Webpack rejects relative paths like "./dist" here.
    //
    // path.resolve(__dirname, 'dist') builds the absolute location
    // of the dist folder inside this project, regardless of where
    // the Webpack command is invoked from. Ideally this matches
    // tsconfig's "outDir" so there is one consistent output location.
    path: path.resolve(__dirname, 'dist')
  }

  // NOTE: At this point Webpack knows WHERE to start (entry) and
  // WHERE to write (output), but it does not yet know HOW to
  // process .ts files. The next lesson adds a "module.rules"
  // section wiring up ts-loader so Webpack can read TypeScript.
};