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

// ARROW FUNCTION SYNTAX — a JavaScript feature, not TypeScript-specific.
//
// Arrow functions are an alternative way to define functions using "=>"
// instead of the "function" keyword. They behave slightly differently
// with respect to "this" binding, but for typing purposes they work
// identically — you annotate parameters and return types the same way.
const logMsg = (msg: string) => {
  console.log(msg);
};

// FUNCTION TYPES — describing the shape of a function used as a value.
//
// In JavaScript, functions ARE values: you can store them in variables,
// pass them as arguments, and return them from other functions. When a
// parameter expects to receive a function, you need to tell TypeScript
// what kind of function is acceptable.
//
// A FUNCTION TYPE uses the same arrow syntax as arrow functions, but in
// a type position (after ":" on a parameter or variable). The left side
// of the arrow lists expected parameters with their types; the right side
// specifies the return type:
//
//   (paramName: paramType) => returnType
//
// This is NOT creating a function — it is defining a type. It appears
// after the colon, in the same position where you would write "string"
// or "number" for simpler types.
//
// PARAMETER NAMES in a function type (like "msg" below) are for developer
// readability only. They do not need to match the parameter names of the
// actual function passed in. What must match is the number of parameters,
// their types, and the return type.
//
// TypeScript also has a built-in "Function" type (capital F), but it is
// too broad — it accepts any function regardless of parameters or return
// type. Prefer explicit function types for the same reason you prefer
// specific types over "any".
function performJob(cb: (msg: string) => void) {
  // ...
  cb('Job done!');
}

// Both "log" and "logMsg" satisfy the function type (msg: string) => void
// because each accepts one string parameter and returns nothing. The
// parameter being named "message" in log vs. "msg" in logMsg is irrelevant.
performJob(log);

// FUNCTION TYPES IN OBJECT TYPES — defining methods on type aliases.
//
// Object types can include properties whose type is a function type.
// This is how you describe methods that an object must implement.
// The syntax is the same arrow-based function type used above:
//   propertyName: (params) => returnType
//
// When you later create an object satisfying this type, you can implement
// the method using either arrow function syntax or JavaScript's shorthand
// method syntax (methodName() { ... }) — both are valid.
type User = {
  name: string;
  age: number;
  greet: () => string;
};

// This object satisfies the User type: it has all required properties
// with the correct types, including a greet method that returns a string.
// The method is written using shorthand method syntax (a standard
// JavaScript feature), which is equivalent to "greet: function() { ... }".
let user: User = {
  name: 'Max',
  age: 39,
  greet() {
    console.log('Hello there!');
    return this.name;
  }
}

user.greet();