// COMPILING WITH TSCONFIG.JSON — use "tsc" without a filename.
//
// IMPORTANT: When you run "tsc <filename>" (targeting a specific file),
// the tsconfig.json settings are IGNORED. The file compiles with default
// settings, output lands next to the source file, and options like
// outDir, target, and strict have no effect.
//
// To use your tsconfig.json settings, run "tsc" with NO filename argument
// from the same directory where tsconfig.json resides. The compiler then:
//   1. Reads tsconfig.json for all configuration
//   2. Finds all .ts files under rootDir (here: ./src)
//   3. Compiles them with the configured target, strict mode, etc.
//   4. Outputs .js (and .map) files to outDir (here: ./dist)
//
// This is the standard workflow for projects with a tsconfig.json.
//
// WATCH MODE: For active development, run "tsc --watch" (or "tsc -w").
// This keeps the compiler running and automatically re-compiles whenever
// you save a change to any source file under rootDir. The output in
// outDir updates immediately, so you don't need to manually re-run tsc
// after every edit.

// TYPE DECLARATION PACKAGES (@types/*) — teaching TypeScript about
// libraries and APIs whose types are not built in.
//
// TypeScript ships with type definitions for browser/DOM APIs (e.g.,
// HTMLElement, document), but it does NOT include types for Node.js
// APIs, or for third-party libraries like lodash, React, etc.
//
// Without type definitions, importing a module produces an error:
//   "Cannot find module 'node:fs' or its corresponding type declarations."
//
// The solution is to install a TYPE DECLARATION PACKAGE from the
// @types/* scope on npm. For Node.js APIs:
//   npm install --save-dev @types/node
//
// The --save-dev flag installs it as a development-only dependency,
// because type definitions are only needed during development and
// compilation — the compiled JavaScript output does not use them.
//
// These packages come from the DefinitelyTyped project on GitHub
// (github.com/DefinitelyTyped/DefinitelyTyped), a massive community-
// driven repository that maintains type definitions for thousands of
// JavaScript packages. Similar packages exist for other libraries:
//   @types/react, @types/lodash, @types/express, etc.
//
// Once installed, the error disappears and your IDE provides full
// autocompletion and type checking for the library's API.
import fs from 'node:fs';

// With @types/node installed, TypeScript knows the full signature of
// fs.readFileSync — including parameter types and return type.
// fs.readFileSync()

let userName: string;

userName = 'Max';

console.log(userName);

// With "strict: true" in tsconfig.json, the "noImplicitAny" rule is
// active. This means parameters without a type annotation produce a
// compile error instead of silently defaulting to "any". If you truly
// want "any" (not recommended), you must write it explicitly — as done
// here — so TypeScript knows it was intentional, not an oversight.
function add(a: any, b: any) {
  return a + b;
}

console.log(add(1, 2));