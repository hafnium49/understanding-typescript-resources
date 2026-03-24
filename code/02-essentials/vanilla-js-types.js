// TYPES EXIST IN PLAIN JAVASCRIPT — they are NOT a TypeScript invention.
//
// JavaScript already knows that values have types (string, number,
// boolean, etc.). What JavaScript lacks is the ability to ENFORCE types
// at development time — you cannot declare "this variable must always
// hold a string" in plain JS. TypeScript adds that enforcement layer
// on top of JavaScript's existing type system.

// This is a standard .js file — no TypeScript involved. Yet the value
// 'Max' is still of type "string" internally. JavaScript tracks types
// at runtime; it simply does not let you constrain them in advance.
let userName = 'Max';

// The "typeof" operator is built into JavaScript (not TypeScript). It
// inspects a value at runtime and returns its type as a string.
// Running this file with Node.js (node vanilla-js-types.js) prints
// "string" to the console, proving that JavaScript is fully aware of
// value types — it just cannot catch type mismatches before execution.
console.log(typeof userName);