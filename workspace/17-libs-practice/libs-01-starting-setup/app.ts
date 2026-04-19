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

// EXPECTED ERROR:
//
// Both the IDE and the TypeScript compiler (tsc) flag this with:
//   "Could not find a declaration file for module 'lodash'."
//
// The JavaScript runtime would be perfectly happy with this code —
// Lodash is installed and the import path resolves. The problem is
// purely at the TYPE-CHECKING stage: TypeScript cannot see what
// functions Lodash exports or what types they accept and return,
// because the package ships no .d.ts files.
//
// The next lesson will show how to fix this by installing type
// declarations from the @types/* scope on npm.
