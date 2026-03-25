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
// The "??" operator returns the right-hand side only when the left-hand
// side is null or undefined. Unlike "||", it does NOT treat empty strings,
// 0, or false as "missing" — only null and undefined trigger the fallback.
// This makes it useful alongside optional types, where absent values are
// specifically undefined (not just any falsy value).
let input = '';
const didProvideInput = input ?? false;
