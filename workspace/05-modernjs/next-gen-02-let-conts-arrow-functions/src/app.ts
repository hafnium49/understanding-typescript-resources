// (Previous lesson covered let & const — see next-gen-01 for details.)
const userName = 'Max';
// userName = 'Maximilian';  // COMPILE ERROR: const cannot be reassigned.
let age = 30;

age = 29;

// =====================================================================
// ARROW FUNCTIONS — a shorter syntax for writing functions (ES6).
// =====================================================================
//
// Instead of the "function" keyword, arrow functions use "=>" (an equals
// sign followed by a greater-than sign). They are written as expressions
// and stored in a variable or constant.

// FULL ARROW FUNCTION SYNTAX:
// const add = (a: number, b: number) => { return a + b; };
//
// If the function body contains ONLY ONE expression, you can omit the
// curly braces AND the return keyword. The single expression's result
// is implicitly returned. This makes common one-liner functions very
// concise compared to the traditional "function" keyword form.
const add = (a: number, b: number) => a + b;

// SINGLE-PARAMETER SHORTHAND:
//
// When an arrow function has exactly one parameter, the parentheses
// around that parameter can be omitted — BUT only in vanilla JavaScript.
// In TypeScript, if you add a type annotation directly on the parameter
// (e.g., "output: string"), you must keep the parentheses.
//
// WORKAROUND: move the type information to a FUNCTION TYPE annotation
// on the variable itself. Then the parameter in the arrow function has
// no inline annotation, so the parentheses can be dropped.
//
// Below, "(a: number | string) => void" is the function type assigned
// to the constant. This tells TypeScript what "printOutput" accepts and
// returns. With that in place, the arrow function body uses the bare
// parameter name "output" without parentheses.
const printOutput: (a: number | string) => void = output => console.log(output);

// ARROW FUNCTIONS AS CALLBACKS — common in event listeners.
//
// When passing a function to addEventListener (or any callback-based
// API), arrow functions shine because of their brevity. TypeScript
// also infers the callback's parameter types from the API's type
// definitions — here it knows "event" is a MouseEvent because we
// are listening to "click", so no manual type annotation is needed.
const button = document.querySelector('button');

// The null check (if block) is required because querySelector could
// return null if no matching element exists in the DOM — TypeScript's
// strict null checks enforce this.
if (button) {
  button.addEventListener('click', event => console.log(event));
}

printOutput(add(5, 2));
