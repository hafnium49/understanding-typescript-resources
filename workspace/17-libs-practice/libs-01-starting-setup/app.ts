// =====================================================================
// LESSON 214 — USING TYPESCRIPT WITH JAVASCRIPT LIBRARIES (overview).
// =====================================================================
//
// Real TypeScript projects rarely consist of only TypeScript code. They
// typically rely on third-party npm packages — for HTTP requests, date
// formatting, UI rendering, utilities, and countless other needs.
//
// This section explores three scenarios:
//   1. JavaScript-only libraries (need .d.ts declarations, often via @types/*)
//   2. .d.ts files themselves (type-only, no runtime logic)
//   3. TypeScript-first libraries (seamless, no extra types needed)

// =====================================================================
// LESSON 215 — TRYING TO USE LODASH (a JavaScript-only library).
// =====================================================================
//
// Lodash is one of the most popular JavaScript utility libraries on npm.
// It offers a vast set of helpers for working with arrays, objects,
// strings, and more. However, Lodash is written in plain JavaScript —
// its source repository contains no TypeScript code and no type
// declarations. This is the exact scenario where TypeScript needs extra
// help to understand a library.
//
// INSTALLATION:
//   npm install --save lodash
//
// This adds Lodash as a runtime dependency so the JavaScript code can
// be imported at runtime. Installing the library is NOT enough for
// TypeScript, though — as the error below demonstrates.
//
// IMPORT CONVENTION:
// Lodash is traditionally imported under the name "_" (underscore).
// That single-character alias is a community convention going back to
// Underscore.js (Lodash's predecessor) and matches how the library is
// commonly referenced in documentation.
import _ from 'lodash';

// A simple array to demonstrate chunking.
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

// _.chunk splits an array into sub-arrays of a given size. Here, size 2
// would produce [[1,2], [3,4], [5,6], [7,8]]. With numbers not evenly
// divisible by the chunk size, the final group contains the remainder.
console.log(_.chunk(numbers, 2));

// =====================================================================
// LESSON 216 — FIXING THE ERROR WITH @types/lodash.
// =====================================================================
//
// The error from the previous lesson said:
//   "Could not find a declaration file for module 'lodash'.
//    Try `npm i --save-dev @types/lodash` ..."
//
// That hint points to the solution: the @types/* scope on npm contains
// community-maintained TYPE DECLARATION PACKAGES for thousands of
// JavaScript libraries that don't ship their own types.
//
// INSTALLATION (as a development-only dependency):
//   npm install --save-dev @types/lodash
//
// The --save-dev flag places the package under "devDependencies" in
// package.json. Type declarations are only needed during development
// and compilation — the production JavaScript output does not use them.
//
// THE DEFINITELYTYPED PROJECT:
//
// All @types/* packages come from a single GitHub monorepo called
// DefinitelyTyped (github.com/DefinitelyTyped/DefinitelyTyped). It
// houses .d.ts files for essentially every popular JavaScript library.
// When you run "npm install @types/<pkg>", npm downloads the relevant
// folder from that repository, published under the @types scope.
//
// Common examples follow the same pattern:
//   - jQuery         → npm install --save-dev @types/jquery
//   - React          → npm install --save-dev @types/react
//   - Express        → npm install --save-dev @types/express
//   - Node.js APIs   → npm install --save-dev @types/node
//
// With @types/lodash installed, the previous error disappears. The IDE
// now provides autocomplete for all Lodash methods, shows parameter
// types (e.g., chunk expects an array and a number), and infers the
// return type of _.chunk(numbers, 2) as number[][].
//
// This is the canonical workflow for using any JavaScript-only library
// in a TypeScript project: install the package itself, then install
// its type declarations from @types/*.

// Assigning the result to a variable makes the inferred return type
// visible in the IDE tooltip — number[][] (an array of number arrays).
const chunkedArray = _.chunk(numbers, 2);
console.log(chunkedArray);

// =====================================================================
// LESSON 217 — WHAT DID WE JUST INSTALL? (peeking inside @types/lodash).
// =====================================================================
//
// The @types/lodash package lives at node_modules/@types/lodash/. Opening
// that folder reveals dozens of .d.ts files — one (or more) for each
// Lodash utility method (chunk.d.ts, map.d.ts, pick.d.ts, etc.).
//
// WHAT .d.ts FILES CONTAIN:
// Declaration files carry ONLY type information: interfaces, type
// aliases, and function signatures. No runtime logic, no actual
// implementation — that lives in the JavaScript source. The .d.ts
// files purely tell TypeScript "here's what this library looks like".
//
// STRUCTURE OF @types/lodash:
//   - index.d.ts         — the entry point, references many sub-files
//   - chunk.d.ts         — imports chunk from index and re-exports
//   - common/array.d.ts  — detailed interfaces for array utilities
//   - common/*.d.ts      — further groupings (collection, object, etc.)
//
// TWO UNFAMILIAR SYNTAX PIECES APPEAR IN THESE FILES:
//
//   /// <reference path="..." />
//     A triple-slash directive. It LOOKS like a comment but is actually
//     a TypeScript feature for pulling other declaration files into
//     the current scope. Used to split a large set of types across
//     many files while still making them all visible together.
//     (Covered in depth in the namespaces & modules section.)
//
//   declare module 'lodash' { ... }
//     The "declare" keyword tells TypeScript about the existence of
//     something without providing runtime code. "declare module" groups
//     type definitions under a module name so that even when they live
//     in different files, TypeScript treats them as one logical unit.
//
// WHEN WOULD YOU WRITE THESE YOURSELF?
// Essentially only if you maintain a JavaScript library and want to
// ship type support to TypeScript users. As an APPLICATION developer
// (the typical case in this course), you will never need to author
// .d.ts files — you just install the appropriate @types/* package and
// let the community-maintained declarations do the work.
//
// KEY TAKEAWAY:
// The @types/* install is not magic. It downloads a folder of plain
// .d.ts files into node_modules and TypeScript picks them up
// automatically. The library itself (lodash) is still plain JavaScript
// at runtime; the .d.ts files just teach the compiler what types that
// JavaScript code operates on.
