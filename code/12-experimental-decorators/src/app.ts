// EXPERIMENTAL DECORATORS — section overview.
//
// The previous section covered the OFFICIAL decorators syntax (the
// stage 3 ECMAScript proposal that became standardized). This section
// explores the OLDER experimental decorators syntax that TypeScript
// has supported for years before the official version existed.
//
// WHY LEARN THE OLDER SYNTAX?
//
// Even though it is not the standardized version, the experimental
// decorators syntax is still widely used in real-world TypeScript
// projects — many existing codebases, frameworks, and libraries
// (e.g., Angular, NestJS, TypeORM) rely on it. You will encounter
// it more often "in the wild" than the new official syntax simply
// because it has been around much longer.
//
// PROJECT SETUP:
//   1. Run "npm install" once to install lite-server (used to serve
//      index.html during development — optional for this section).
//   2. Compile the TypeScript file with "tsc" to produce app.js.
//   3. For continuous compilation while editing, use "tsc -w" to
//      enter watch mode — the compiler stays running and recompiles
//      automatically whenever app.ts is saved.
//   4. VS Code will also flag TypeScript errors inline without any
//      compilation step, so the watch mode is purely a convenience.
//
// Most of this section is written in this single app.ts file. The
// index.html file exists only to provide a hook for any decorators
// that interact with the DOM in later examples.
