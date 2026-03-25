// FUNCTION RETURN TYPES — TypeScript tracks what functions produce.
//
// In addition to annotating parameter types, you can annotate the RETURN
// TYPE of a function. The syntax places ": type" after the closing
// parenthesis of the parameter list and before the opening curly brace:
//
//   function add(a: number, b: number): number { ... }
//
// However, TypeScript can usually INFER the return type by analyzing the
// return statement(s). Here, adding two numbers always produces a number,
// so TypeScript automatically infers "number" as the return type. You can
// verify this by hovering over the function name in your editor — the
// tooltip shows the full signature including the inferred return type.
//
// BEST PRACTICE: Omit the explicit return type when inference handles it
// correctly. Only add one when you need to enforce a specific return type
// that differs from what would be inferred, or when you want to document
// the contract explicitly (common in library code and public APIs).
function add(a: number, b: number) {
  return a + b;
}

// THE "void" RETURN TYPE — for functions that return nothing.
//
// When a function has no return statement (or returns without a value),
// its return type is "void". This is a special type used exclusively
// with function return values — you would never use void as the type
// of a variable or parameter.
//
// As with other return types, TypeScript infers void automatically when
// no value is returned, so an explicit ": void" annotation is usually
// unnecessary. Hover over the function name to confirm the inference.
function log(message: string) {
  console.log(message);
}

// THE "never" RETURN TYPE — for functions that never finish executing.
//
// "void" means a function completes but returns no value. "never" is more
// specific: it means the function will NEVER complete at all. This happens
// when a function always throws an error (crashing or unwinding the call
// stack) or enters an infinite loop.
//
// TypeScript infers "void" here by default, but explicitly annotating
// "never" is more precise and has a practical benefit: if you accidentally
// try to store the return value in a variable, that variable's type will
// be "never", and any attempt to use it (access properties, pass it to
// other functions) will produce a compile error — because TypeScript knows
// the value can never actually exist.
//
// Note: "throw new Error(...)" is standard JavaScript for creating and
// throwing error objects. It is not TypeScript-specific.
function logAndThrow(errorMessage: string): never {
  console.log(errorMessage);
  throw new Error(errorMessage);
}

const logMsg = (msg: string) => {
  console.log(msg);
};

function performJob(cb: (msg: string) => void) {
  // ...
  cb('Job done!');
}

performJob(log);

type User = {
  name: string;
  age: number;
  greet: () => string;
};

let user: User = {
  name: 'Max',
  age: 39,
  greet() {
    console.log('Hello there!');
    return this.name;
  }
}

user.greet();