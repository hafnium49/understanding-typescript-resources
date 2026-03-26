// OPTIONAL PARAMETERS — making function arguments non-mandatory.
//
// Adding "?" after a parameter name (before the colon and type) marks it
// as optional. Callers can omit the argument entirely without triggering
// a compile error. When omitted, the parameter's value is undefined.
//
// The "?" must come after the parameter name and before the type
// annotation: paramName?: type. This is different from a default value
// (paramName = defaultValue), which also makes a parameter optional but
// provides a fallback value instead of undefined.
function generateError(msg?: string) {
  throw new Error(msg);
}

// Valid: no argument provided — msg will be undefined inside the function.
generateError();

// OPTIONAL PROPERTIES — making object fields non-mandatory.
//
// The same "?" syntax works in object type definitions. Adding "?" after
// a property name means the property may or may not be present on objects
// of that type. Objects missing the optional property are still valid.
//
// When an optional property is present, its value must still match the
// declared type. When absent, its value is undefined.
type User = {
  name: string;
  age: number;
  role?: 'admin' | 'guest'
};

// NULLISH COALESCING (??) — a JavaScript operator for default values.
//
// This operator is NOT TypeScript-specific — it works in standard modern
// JavaScript as well — but it pairs naturally with optional types.
//
// PROBLEM: The logical OR operator (||) checks whether the left side is
// FALSY. In JavaScript, falsy values include: false, null, undefined, 0,
// "" (empty string), and NaN. So "input || false" would use the fallback
// "false" for BOTH null AND an empty string — even though an empty string
// might represent valid input the user intentionally submitted.
//
// SOLUTION: The "??" operator checks ONLY for null or undefined. All
// other values — including empty strings, 0, and false — are kept as-is.
//
//   Example with input = '':
//     input || false   →  false   (empty string is falsy, fallback used)
//     input ?? false   →  ''      (empty string is not null/undefined)
//
//   Example with input = null:
//     input || false   →  false   (null is falsy, fallback used)
//     input ?? false   →  false   (null triggers ??, fallback used)
//
// Use ?? when you want a fallback specifically for "no value at all"
// (null/undefined) without accidentally replacing legitimate values
// like 0 or empty strings.
let input = '';
const didProvideInput = input ?? false;
console.log(didProvideInput); // Output: '' (empty string, not replaced by false)
