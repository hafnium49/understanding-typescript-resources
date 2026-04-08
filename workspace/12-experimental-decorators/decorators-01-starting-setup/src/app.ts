// EXPERIMENTAL DECORATORS — section starting setup.
//
// This empty file is the starting point for the experimental decorators
// section. Code will be added here as you progress through the lessons.
//
// PROJECT WORKFLOW:
//   - "npm install"  → install lite-server (one time)
//   - "npm start"    → start the dev server (serves index.html)
//   - "tsc -w"       → run the TypeScript compiler in watch mode so
//                      app.ts is recompiled to dist/app.js on every save
//
// IMPORTANT — TSCONFIG REQUIREMENT:
// Decorators are not enabled by default. To use them in this project,
// the tsconfig.json must have:
//   - "target": "es6" (or higher) — decorators rely on ES6+ class syntax
//   - "experimentalDecorators": true — opts in to the older decorators
//     proposal that TypeScript has supported for years
//
// In this starting-setup directory, "experimentalDecorators" is still
// COMMENTED OUT in tsconfig.json. The next lesson will uncomment it
// and add the first decorator. Until then, attempting to use the @
// decorator syntax will produce a compile error.
