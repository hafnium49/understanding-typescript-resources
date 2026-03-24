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
// TypeScript code. Most plain JavaScript is valid inside a .ts file —
// the compiler will process it through TypeScript's type system either way.

// TYPE ANNOTATIONS — the most fundamental TypeScript feature.
//
// The syntax is: variableName: typeName
// The colon followed by a type name tells TypeScript exactly what kind of
// value a variable is allowed to hold. Built-in primitive types include:
// string, number, and boolean.
//
// IMPORTANT: Always use lowercase type names — "string", not "String".
// The uppercase versions (String, Number, Boolean) refer to JavaScript's
// wrapper objects, which are not equivalent. While TypeScript accepts the
// uppercase form without error, it is strongly discouraged.
//
// An explicit annotation is essential when a variable has no initial value,
// because TypeScript cannot infer the type from nothing. Without one, the
// variable silently receives the "any" type, which disables type checking.
let userName: string;

// TYPE INFERENCE — TypeScript's ability to determine types automatically.
//
// When a variable is initialized with a value at declaration time,
// TypeScript examines that value and infers the variable's type from it.
// Here, 38 is a number literal, so TypeScript automatically assigns the
// type "number" to userAge. You can verify this by hovering over userAge
// in your editor — the tooltip will show "let userAge: number".
//
// BEST PRACTICE: Do NOT add a redundant explicit annotation when an
// initial value is present (e.g., "let userAge: number = 38"). It adds
// visual noise without any benefit, since TypeScript already knows the
// type. Only use explicit annotations when there is no initial value or
// when you intentionally need a broader type than what would be inferred.
let userAge = 38;

// ... imagine more application code running in between ...

userName = 'Max';

// UNCOMMENTING THE LINE BELOW WOULD CAUSE A COMPILE ERROR:
// Although '34' looks numeric, the quotes make it a string literal.
// TypeScript inferred userAge as "number" from its initial value of 38,
// so assigning a string violates that inferred type — exactly the same
// protection you get from an explicit annotation, but without writing one.
// userAge = '34';

// Type annotations are removed during compilation — they do not exist
// in the output JavaScript file. They serve purely as development-time
// safety checks, which is why TypeScript requires a compilation step.

// Annotations and inference also apply to function parameters.
// Parameter "a" has an explicit annotation (: number).
// Parameter "b" has a default value of 5, so TypeScript infers its type
// as "number" from that default — no annotation needed, same inference
// concept as with variables above.
function add(a: number, b = 5) {
  return a + b;
}

// Valid: both arguments are numbers.
add(10);
// COMPILE ERROR: '10' is a string, but parameter "a" expects a number.
// add('10');
// Valid: explicitly providing both arguments as numbers.
add(10, 6);
// COMPILE ERROR: '6' is a string, but "b" was inferred as number.
// add(10, '6');

