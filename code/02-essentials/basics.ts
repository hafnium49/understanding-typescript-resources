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

let userName: string; // number, boolean
let userAge = 38;

// ...

userName = 'Max';
// userAge = '34';

function add(a: number, b = 5) {
  return a + b;
}

add(10);
// add('10');
add(10, 6);
// add(10, '6');

