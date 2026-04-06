// =====================================================================
// THE "typeof" OPERATOR — JavaScript vs TypeScript.
// =====================================================================
//
// "typeof" exists in BOTH JavaScript and TypeScript, but it does
// different things depending on WHERE you use it. TypeScript picks
// the correct one automatically based on context.
//
// JAVASCRIPT typeof — a runtime operator that returns a string
// describing the type of a value at runtime ('string', 'number',
// 'boolean', 'object', etc.). Used in regular expressions.
//
// TYPESCRIPT typeof — a compile-time operator used in TYPE positions
// (e.g., after the "type" keyword's "="). It extracts the TYPE of a
// value so you can use it as a type annotation, alias, or part of
// other type expressions.

let userName = 'Max';

// Here we are in a regular JavaScript expression, so this uses the
// JAVASCRIPT typeof operator. At runtime, it logs "string".
console.log(typeof userName);

// Here we are in a TYPE position (after "type ... ="), so this uses
// the TYPESCRIPT typeof operator. It extracts the type of userName
// at compile time and assigns it to the UserName type alias.
//
// Because userName is declared with "let", TypeScript inferred its
// type as "string" (any string can be reassigned to it). So UserName
// becomes equivalent to "string". If userName had been declared with
// "const", TypeScript would have inferred the literal type 'Max'
// instead, and UserName would equal 'Max' — because a const cannot
// be reassigned to any other value.
type UserName = typeof userName;
