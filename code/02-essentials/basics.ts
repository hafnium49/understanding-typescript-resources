// SECTION SETUP: This file uses a simple workflow for learning TypeScript.
//
// 1. Write TypeScript code in this .ts file.
// 2. Compile it to JavaScript:  tsc basics.ts
// 3. Execute the output with Node.js:  node basics.js
//
// No website, HTML, or browser is needed — Node.js runs the compiled JS
// directly. This keeps the focus purely on TypeScript's core features,
// which apply identically whether you later target Node.js, Bun, or
// the browser.
//
// The .ts extension is the standard convention for files containing
// TypeScript code. Even plain JavaScript is valid inside a .ts file,
// but the compiler will still process it through TypeScript's type system.

// TYPE ANNOTATIONS — the most fundamental TypeScript feature.
//
// When a variable is declared without an initial value, TypeScript cannot
// infer its type. Without an explicit annotation, the variable receives the
// "any" type, which effectively disables type checking for that variable.
// Adding ": type" after the variable name tells TypeScript exactly what
// kind of value this variable is allowed to hold.

// The colon followed by "string" is a TYPE ANNOTATION. It restricts
// userName to only accept string values. Attempting to assign a number
// or boolean to it would produce a compile-time error.
// Other built-in primitive types include: number, boolean.
//
// IMPORTANT: Always use lowercase type names — "string", not "String".
// The uppercase versions (String, Number, Boolean) refer to JavaScript's
// wrapper objects and are NOT the same thing. TypeScript won't error on
// the uppercase form, but it is incorrect for type annotations.
let userName: string;
let userAge = 38;

// ...

// This assignment succeeds because 'Max' is a string, matching the
// declared type. Changing the annotation above to "number" would cause
// TypeScript to flag this line as an error — a string is not assignable
// to a variable that expects a number.
userName = 'Max';

// UNCOMMENTING THE LINE BELOW WOULD CAUSE A COMPILE ERROR:
// '34' is a string literal, but userAge was inferred as number from its
// initial value of 38. TypeScript enforces that consistency.
// userAge = '34';

// Type annotations are removed during compilation — they do not exist
// in the output JavaScript file. They serve purely as development-time
// safety checks, which is why TypeScript requires a compilation step.

function add(a: number, b = 5) {
  return a + b;
}

add(10);
// add('10');
add(10, 6);
// add(10, '6');

