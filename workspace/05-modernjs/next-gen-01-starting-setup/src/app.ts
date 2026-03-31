// MODERN JAVASCRIPT & TYPESCRIPT — optional section overview.
//
// This section covers standard JavaScript syntax features that are
// widely supported in modern browsers: let, const, arrow functions,
// the spread operator, rest parameters, and destructuring.
//
// Although these are JavaScript features (not TypeScript-specific),
// they are important to understand because:
//   1. They are used heavily throughout the rest of this course.
//   2. TypeScript can DOWNLEVEL them — compile modern syntax into
//      older JavaScript (e.g., ES5/ES3) that runs in browsers that
//      do not natively support these features. The "target" setting
//      in tsconfig.json controls which JavaScript version is emitted.
//
// PROJECT SETUP:
//   - tsconfig.json targets "es6" (the first version supporting these
//     features), includes DOM and ES6 type libraries, and has strict
//     mode enabled.
//   - Source files live in src/, compiled output goes to dist/.
//   - A lite-server dev dependency serves the index.html file (run
//     with "npm start"), though it is not required for this section.
//
// WORKFLOW:
//   - Write TypeScript code in this file (src/app.ts).
//   - Compile with "tsc" or use watch mode with "tsc -w" for automatic
//     recompilation on every save.
//   - VS Code also shows TypeScript errors inline without compiling.

// Code goes here!
