// LESSON 208 — ENTRY POINT UNCHANGED; WEBPACK CONFIG DOES THE WORK.
//
// The application source is identical to the previous snapshot —
// only the Webpack configuration grew. See webpack.config.js for
// the three additions that complete the TypeScript pipeline:
//
//   - module.rules → register ts-loader for ".ts" files
//   - resolve.extensions → tell Webpack to auto-append ".ts"/".js"
//   - devtool: "inline-source-map" → ship source maps in the bundle
//
// Build with "npm run build"; the result lands in dist/bundle.js
// and index.html now loads that single file in one request.
import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
