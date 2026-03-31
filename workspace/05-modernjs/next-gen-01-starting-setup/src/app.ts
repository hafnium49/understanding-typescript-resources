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

// ES6 COMPATIBILITY REFERENCE:
// https://compat-table.github.io/compat-table/es6/
// This page shows which modern JS features are supported by each browser,
// runtime, and compiler (including TypeScript). Useful for deciding whether
// you can use a feature natively or need TypeScript to downlevel it.

// =====================================================================
// LET & CONST — block-scoped variable declarations (ES6).
// =====================================================================
//
// Before ES6, JavaScript only had "var" for declaring variables.
// ES6 introduced "let" and "const" as replacements.

// CONST — declares a constant. Once assigned, the value cannot be changed.
// Attempting to reassign produces a compile-time error in TypeScript AND
// a runtime error in vanilla JavaScript.
const userName = 'Max';
// userName = 'Anna';  // COMPILE ERROR: cannot assign to a constant.

// LET — declares a variable that CAN be reassigned.
// It replaces "var" for mutable variables.
let age = 30;
age = 31; // valid: let allows reassignment.

// WHY NOT JUST KEEP USING VAR?
//
// "var" still exists in JavaScript (features are never removed to avoid
// breaking existing websites), but you should avoid it. The key difference
// is SCOPE:
//
// VAR has only two scopes:
//   - Global scope (declared outside any function)
//   - Function scope (declared inside a function)
//
// LET and CONST introduce BLOCK SCOPE:
//   - A variable is available only within the nearest enclosing { } block
//     (if statement, for loop, or even bare curly braces) and any nested
//     blocks inside it.
//
// This matters because "var" leaks out of blocks that are not functions:

function add(a: number, b: number) {
  // "result" is scoped to this function — not accessible outside.
  let result = a + b;
  return result;
}
// console.log(result);  // ERROR: "result" does not exist here.

// BLOCK SCOPE DEMONSTRATION:
//
// With "var", a variable declared inside an if-block is accessible OUTSIDE
// that block — because "var" only respects function and global scope. This
// is a well-known source of bugs in older JavaScript code.
//
// With "let" (and "const"), the variable is confined to the if-block. Any
// attempt to access it outside the block produces an error — both in
// TypeScript (at compile time) and in vanilla JavaScript (at runtime).
//
// TypeScript catches this error regardless of whether you use var or let,
// because TypeScript's analysis is stricter than JavaScript's runtime
// behavior. But in plain JavaScript, only let/const enforce block scope.

if (age > 20) {
  let isOld = true;
  console.log(isOld); // valid: inside the same block.
}
// console.log(isOld);  // ERROR with let: not defined outside the block.
//                       // Would work (but shouldn't) with var.

// SUMMARY: Always use "const" for values that never change, "let" for
// values that do. Never use "var" — let and const provide the same
// capabilities with safer, more predictable scoping.
