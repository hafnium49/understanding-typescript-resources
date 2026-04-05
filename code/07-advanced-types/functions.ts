// =====================================================================
// FUNCTION OVERLOADS — multiple signatures for a single function.
// =====================================================================
//
// PROBLEM (lesson 94): When a function accepts a union type and returns
// different types depending on which variant it receives, TypeScript
// infers the return type as a union of ALL possible returns. The caller
// cannot use type-specific properties without extra narrowing or casting.
//
// SOLUTION: Function overloads let you declare multiple SIGNATURES
// above the main implementation. Each signature specifies a narrower
// parameter type AND its corresponding return type. TypeScript then
// picks the matching signature based on the arguments at each call
// site, giving the caller a precise return type instead of a union.
//
// SYNTAX: Add one or more "function name(params): returnType;" lines
// (no body — just the signature followed by a semicolon) ABOVE the
// main implementation. The main implementation's parameter list must
// be compatible with ALL overload signatures (typically a union).

// OVERLOAD SIGNATURES — no body, just parameter + return type.
// These tell TypeScript: "if called with an array, return a number;
// if called with a string, return a string."
function getLength(val: any[]): number;
function getLength(val: string): string;

// IMPLEMENTATION SIGNATURE — the actual function body.
// Its parameter type (string | any[]) is broad enough to cover both
// overload signatures. This signature is NOT directly callable —
// callers see only the overload signatures above.
function getLength(val: string | any[]) {
  if (typeof val === 'string') {
    const numberOfWords = val.split(' ').length;
    return `${numberOfWords} words`;
  }
  return val.length;
}

// Thanks to the overload signatures, TypeScript now knows:
//   - getLength(string)  → returns string
//   - getLength(any[])   → returns number
//
// numOfWords is inferred as STRING (not string | number), because
// TypeScript matched the call to the string overload signature.
const numOfWords = getLength('does this work?');

// This now works WITHOUT type casting — TypeScript knows numOfWords
// is a string, so .length (number of characters) is valid.
numOfWords.length;

// numItems is inferred as NUMBER — matched to the array overload.
const numItems = getLength(['Sports', 'Cookies']);
