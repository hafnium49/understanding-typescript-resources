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

import fs from 'node:fs';

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