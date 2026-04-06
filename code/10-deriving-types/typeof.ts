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

// =====================================================================
// A MORE PRACTICAL EXAMPLE — deriving an object type from a value.
// =====================================================================
//
// The basic example above is trivial — you could just write "string"
// instead of "typeof userName". But typeof becomes genuinely useful
// when you have a complex value (like a settings object with many
// properties) and you want a type that exactly matches its shape.
//
// Manually writing the matching object type is tedious, repetitive,
// and error-prone — every property name and type must be retyped, and
// any typo can cause confusing errors elsewhere in your code. With
// typeof, TypeScript derives the type automatically from the value.

const settings = {
  difficulty: 'easy',
  minLevel: 10,
  didStart: false,
  players: ['John', 'Jane']
};

// You COULD create a named type alias from the settings value:
// type Settings = typeof settings;
//
// But you do not have to — typeof can also be used directly in a
// parameter type or any other type position. Here, the function's
// parameter type is derived from the settings constant on the fly.
// Note that the parameter NAME (s) must differ from the value name
// (settings) to avoid a name clash.
function loadData(s: typeof settings) {
  // ...
}

// The settings object trivially matches its own derived type.
loadData(settings);

// =====================================================================
// typeof FOR FUNCTION TYPES — deriving the signature of a function.
// =====================================================================
//
// typeof works on functions too, not just primitive values and objects.
// This is useful when you have existing functions and need to type a
// parameter (like a callback) that should accept those exact functions.
//
// Manually writing the function type would mean repeating the signature
// in two places, which is duplication and a maintenance hazard. typeof
// extracts the signature directly from the function definition.

function sum(a: number, b: number) {
  return a + b;
}

function subtract(a: number, b: number) {
  return a - b;
}

// SumFn is now (a: number, b: number) => number — derived from sum's
// signature. SubtractFn is identical because subtract has the same
// signature, but the two aliases keep the relationship to the original
// functions explicit.
type SumFn = typeof sum;
type SubtractFn = typeof subtract;

// performMathAction accepts a callback that must be either sum or
// subtract (or any function with a matching signature). The union
// type combines the two derived function types.
function performMathAction(cb: SumFn | SubtractFn) {
  // some code...
}

performMathAction(sum);
performMathAction(subtract);
