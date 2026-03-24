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

function log(message: string) {
  console.log(message);
}

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