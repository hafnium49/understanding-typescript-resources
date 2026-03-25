// THE "null" AND "undefined" TYPES — representing absent values.
//
// Both null and undefined are regular JavaScript values (not TypeScript
// inventions). TypeScript provides corresponding types so you can express
// whether a variable is allowed to be empty.
//
// On its own, "null" as a type is not useful — a variable typed as just
// "null" can only ever hold null. The real power comes from combining it
// with other types in a UNION:
//
//   string | null    — can hold a string OR null
//   string | undefined — can hold a string OR undefined
//
// This is practical when a variable starts with a value but may later
// need to be cleared/reset, or when a value may not yet be available.
//
// Without "null" in the union, assigning null to a string variable would
// be a compile error. The same applies to undefined — you must explicitly
// include it in the union if the variable should accept it.
//
// KEY DISTINCTION: null and undefined are different values in JavaScript.
// null typically represents an intentional "no value" assignment, while
// undefined means a variable has been declared but not yet assigned.
// In TypeScript, they are also distinct types — including one in a union
// does NOT automatically include the other.
let a: null | string;

a = 'Hi!';

// ... imagine more application code in between ...

// Valid: null is explicitly allowed by the union type. This is useful
// for "clearing" or "resetting" a variable that previously held a string.
a = null;