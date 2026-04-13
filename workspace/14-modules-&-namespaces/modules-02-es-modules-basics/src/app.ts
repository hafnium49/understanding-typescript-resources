// LESSON 187 — ES MODULES: the standard JavaScript import/export syntax.
//
// This project has been converted from namespaces (/// <reference> +
// namespace blocks) to ES modules (import/export statements).
//
// NAMESPACES (previous approach):
//   - TypeScript-specific (namespace keyword, /// <reference> directives)
//   - Requires outFile in tsconfig to bundle into one JS file
//   - Missing imports cause RUNTIME errors, not compile-time errors
//
// ES MODULES (this approach):
//   - Standard JavaScript syntax — works in TypeScript and vanilla JS
//   - Each file compiles to its own .js file (no outFile)
//   - Missing imports cause COMPILE-TIME errors — much safer
//   - The browser resolves imports automatically, downloading each
//     dependency file as it encounters import statements
//
// CONVERSION STEPS performed in this lesson:
//   1. Remove all namespace blocks and /// <reference> directives
//   2. Keep the "export" keyword on everything that was exported
//   3. Add "import { Name } from './path/to/file.js'" at the top of
//      each file that uses something from another file
//   4. Change tsconfig: "module" to "es2015", remove "outFile"
//   5. In index.html: add type="module" to the <script> tag
//
// IMPORT SYNTAX:
//   import { ExportedName } from './relative/path.js';
//   - Curly braces for named imports; comma-separate multiple items
//   - Path is relative to the importing file (../ to go up a level)
//   - IMPORTANT: use .js extension — the browser looks for compiled JS
//     files, not .ts. Build tools like Webpack can remove this requirement
//
// WHY ES MODULES ARE PREFERRED:
//   - Missing imports produce compile errors (namespaces only fail at runtime)
//   - Standard JavaScript — not TypeScript-specific
//   - Each file explicitly declares its own dependencies
//   - The de facto standard in the TypeScript community
import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
