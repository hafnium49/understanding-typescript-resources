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

// =====================================================================
// LESSON 218 — DIVING DEEPER INTO .d.ts FILES (reference resource).
// =====================================================================
//
// So far this course has focused on USING TypeScript in applications.
// Another area where TypeScript is widely used is in AUTHORING LIBRARIES
// that other developers will consume. That is where writing .d.ts files
// (rather than just installing them) becomes relevant.
//
// THE TERM ".d.ts":
// "d" stands for "declaration". A .d.ts file is a TYPE DECLARATION FILE
// that carries only type information — the bridge between JavaScript
// code a library may ship and the TypeScript code that will consume it.
//
// THREE OPTIONS WHEN PUBLISHING A LIBRARY:
//
//   1) Ship the source as .ts files (no compilation step).
//      Consumers compile it themselves as part of their build.
//
//   2) Ship compiled .js files AND accompanying .d.ts files in the same
//      package. TypeScript consumers get types out of the box with no
//      extra @types install needed. This is the most common modern
//      approach for TypeScript-aware libraries.
//
//   3) Ship only compiled .js files and rely on the community (or your
//      own separate publication) to provide .d.ts files through the
//      @types/* scope on npm. This is the Lodash situation we saw.
//
// Options 2 and 3 both require writing .d.ts files — either bundled
// with the library or maintained separately.
//
// LEARN MORE:
//   https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
//
// The official TypeScript Handbook section covers:
//   - Declaration Reference:   common API patterns and how to type them
//   - Library Structures:      global vs module libraries and their
//                              impact on declaration-file design
//   - Do's and Don'ts:         frequent mistakes and how to avoid them
//   - Deep Dive:               advanced mechanics for complex typings
//   - Publish to npm:          how to ship .d.ts files as part of a
//                              package, and how to manage peer types
//   - Find and Install:        how consumers locate existing types
//
// If the immediate goal is to add types to an EXISTING npm package, the
// handbook recommends starting with the "Modules .d.ts" section rather
// than reading the handbook sequentially.
//
// For typical application developers (this course's focus), this is
// background knowledge — you rarely need to author these files yourself.

// =====================================================================
// LESSON 219 — USING "declare" MANUALLY (lightweight alternative to .d.ts).
// =====================================================================
//
// Sometimes you need TypeScript to recognize just one or two symbols
// that come from outside your TypeScript code — not an entire library.
// Installing or authoring a full .d.ts file would be overkill in that
// case.
//
// SCENARIO — a global variable from an inline HTML <script>:
//
// See index.html in this folder. The inline <script> declares:
//     var MODE = 'DEFAULT';
// This creates a GLOBAL "MODE" variable on the page. Any .ts code
// loaded later could reference it at runtime — but TypeScript does
// not know it exists, because TypeScript never sees the HTML file.
//
// Referencing MODE from a .ts file would produce:
//     error TS2304: Cannot find name 'MODE'.
//
// THE "declare" KEYWORD — telling TypeScript a symbol exists.
//
// "declare" is the same keyword found inside .d.ts files, but you can
// use it directly in your own .ts source too. It DECLARES the existence
// and type of something WITHOUT producing any runtime code — the line
// vanishes during compilation.
//
// Syntax for a single global:
//     declare var MODE: string;
//
// After this declaration, TypeScript accepts references to MODE as if
// it were a string, and the compiled .js output contains nothing for
// the declare line — the variable is assumed to exist at runtime
// (from the HTML script block, from another library, etc.).
//
// Uncomment both lines below to see this in action — the compiler will
// accept both. (They are commented out so this demo file can compile
// cleanly without requiring MODE to actually exist in a browser.)

// declare var MODE: string;
// const selectedMode = MODE;

// DECLARING LARGER SHAPES — namespaces, modules, interfaces.
//
// "declare" is not limited to single variables. You can describe an
// entire external API's shape:
//
//     declare namespace D3 {
//       export interface Selectors {
//         select: {
//           (selector: string): Selection;
//           (element: EventTarget): Selection;
//         };
//       }
//       export interface Event {
//         x: number;
//         y: number;
//       }
//       export interface Base extends Selectors {
//         event: Event;
//       }
//     }
//
// This pattern — declare namespace + nested interfaces — is exactly
// what you find inside real .d.ts files for popular libraries like
// Lodash (see node_modules/@types/lodash for many examples).
//
// WHEN TO PREFER "declare" IN YOUR OWN .ts FILES:
//   - You only need one or two extra type declarations
//   - No suitable @types package exists, and writing a full .d.ts file
//     is not worth the effort
//   - You want the declaration to live alongside the code that uses it
//
// WHEN TO PREFER .d.ts FILES INSTEAD:
//   - You are typing an entire library
//   - You want declarations separated from runtime code
//   - You are publishing a library for other TypeScript users

// =====================================================================
// LESSON 220 — TYPESCRIPT-AWARE vs. TYPESCRIPT-FIRST LIBRARIES (overview).
// =====================================================================
//
// The Lodash scenario illustrated the most difficult case: a library
// written in plain JavaScript that requires a separate @types package.
// Many modern libraries are built differently and are far easier to
// integrate into TypeScript projects. There are two important categories
// beyond pure-JS libraries:
//
// CATEGORY A — LIBRARIES WRITTEN IN TYPESCRIPT.
//
// These are authored in TypeScript and ship pre-built type declarations
// inside the same npm package. No @types/* install is needed — running
// "npm install <library>" is enough for full type support out of the
// box. Prisma is a typical example: its source is TypeScript, but it
// can also be consumed from plain JavaScript projects.
//
// CATEGORY B — TYPESCRIPT-FIRST LIBRARIES.
//
// These go further: they are DESIGNED around TypeScript's type system
// and expect to be used in TypeScript projects. The API exploits
// advanced type features such that the library's true value only
// becomes apparent when you have static types. Using them in plain
// JavaScript usually works but loses most of the point of the library.
//
// Zod is a leading example. It defines runtime validators whose schemas
// double as TypeScript types, so a single declaration gives you both
// runtime validation AND compile-time type safety. That duality is the
// whole selling point and is meaningless without TypeScript.
//
// QUICK DECISION GUIDE when adopting a library in a TypeScript project:
//
//   1. Install the package and import it.
//   2. If TypeScript reports "Cannot find a declaration file", the
//      library is plain JavaScript (category: Lodash). Look for an
//      @types/<name> package.
//   3. If imports work immediately without an @types install, the
//      library either ships its own types (category A) or is
//      TypeScript-first (category B).
//
// The next lesson will install and use Zod to see category B in action.

// =====================================================================
// LESSON 221 — WHAT IS ZOD? (runtime validation driven by TypeScript).
// =====================================================================
//
// ZOD AS AN EXAMPLE OF A TYPESCRIPT-FIRST LIBRARY:
//
// Zod is one prominent example of the "TypeScript-first" category.
// Another library in the same spirit is class-validator, which uses
// decorators on class properties (e.g., @Length(10, 20) on a title
// field) to attach validation rules that operate alongside the type
// system. Zod takes a different but related approach: instead of
// decorating existing classes, you BUILD UP a schema object and then
// use it to parse and validate arbitrary data.
//
// THE PROBLEM ZOD SOLVES:
//
// TypeScript's type checks happen at COMPILATION time. When code runs
// in the browser or in Node.js, the types are gone — the output is
// plain JavaScript. If data arrives at runtime from an untrusted
// source (an HTTP request body, a JSON file on disk, form input,
// LocalStorage, a third-party API), TypeScript cannot guarantee that
// its actual shape matches what your types claim. Runtime validation
// is required to bridge that gap.
//
// Zod extends TypeScript's "certain types in certain places" guarantee
// into runtime by letting you DEFINE a schema once and then PARSE data
// against it. Valid data passes through (typed correctly); invalid
// data raises a ZodError with details.
//
// PREREQUISITES (per Zod's docs):
//   - TypeScript must be installed
//   - "strict": true should be set in tsconfig.json
//
// INSTALLATION:
//   npm install zod
//
// Note: No @types/zod is needed — Zod ships its own type declarations,
// as expected for a TypeScript-first library.
//
// WHY ALSO @types/node?
//
// To read a file from disk we use Node's built-in "fs" module via
// "import { readFileSync } from 'node:fs'". Node.js APIs are not built
// into TypeScript, so without their type declarations the import
// triggers the same "Cannot find a declaration file" error we saw
// with Lodash. Install them as a dev dependency:
//   npm install --save-dev @types/node
import { z } from 'zod';
import { readFileSync } from 'node:fs';

// =====================================================================
// LESSON 222 — COMPOSING OBJECT SCHEMAS & GETTING FREE TYPE INFERENCE.
// =====================================================================
//
// The value in data.json is not a plain string — it is an object with
// three properties (title, id, values). The schema must match that
// shape exactly, so we move from z.string() to a composed object schema.
//
// Zod's schema-building methods (z.string(), z.number(), z.array(),
// z.object(), z.union(), z.boolean(), ...) are all plain JavaScript
// function calls. They compose: each returns a schema that can be
// embedded inside another (an object schema containing a string, an
// array schema containing a union, etc.). That's what makes Zod feel
// like TypeScript at runtime.
//
// THE KEY BENEFIT — TYPE INFERENCE FOR FREE:
//
// Nowhere below do we write a TypeScript type for the shape of the
// parsed data. Zod's method signatures are generic and carry the
// type through from the schema definition to the parse() return
// value. When parse() succeeds, parsedData is automatically typed as:
//     { title: string; id: number; values: (string | number)[] }
//
// That is the "TypeScript-first" superpower at work: we define the
// shape ONCE as a runtime schema, and TypeScript infers the static
// type from that same definition. No duplicate type declaration, no
// drift between runtime validation and compile-time typing.
const dataSchema = z.object({
  title: z.string(),
  id: z.number(),
  // z.array(z.union([...])) expresses "an array whose elements are
  // either strings or numbers". The union's alternatives are passed
  // as an ARRAY of schemas to z.union([...]). The data file happens
  // to contain only string elements, but allowing numbers too makes
  // the schema more tolerant of mixed input.
  values: z.array(z.union([z.string(), z.number()])),
});

// READING AND PREPARING THE FILE CONTENT:
//
// readFileSync returns a Buffer by default. To turn the JSON text into
// an actual JavaScript object we chain:
//   .toString()   — Buffer → string representation of the file
//   JSON.parse()  — string → native JavaScript object
//
// Note the inferred type of the JSON.parse result is "any" because
// TypeScript cannot statically know what a runtime-parsed file
// contains. That is precisely the blind spot Zod fills in next.
const content = JSON.parse(readFileSync('data.json').toString());

// PARSING AGAINST THE SCHEMA:
//
// schema.parse(value) validates at runtime and returns the value
// narrowed to the schema's type (or throws a ZodError on failure).
// parsedData is therefore typed as the object shape defined above —
// with no manual annotation required. Property access like
// parsedData.title or parsedData.values[0] is fully type-checked.
const parsedData = dataSchema.parse(content);
console.log(parsedData);

