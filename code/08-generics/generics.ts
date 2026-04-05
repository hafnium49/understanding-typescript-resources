// =====================================================================
// GENERICS — types that work WITH other types.
// =====================================================================
//
// This section explores Generic types — a concept that may seem complex
// at first but is fundamental to writing flexible, reusable TypeScript
// code.
//
// Topics covered in this section:
//   - What generics are and why they exist
//   - Built-in generic types (like Array<T>)
//   - Creating your own generic types, functions, and classes
//   - Generic constraints (restricting what types are allowed)

// =====================================================================
// BUILT-IN GENERIC TYPES — Array<T> as a first example.
// =====================================================================
//
// You have already seen two ways to describe an array of strings:
//
//   string[]          — the shorthand notation
//   Array<string>     — the generic type notation
//
// Both are equivalent, but the second form reveals an important concept:
// Array is a GENERIC TYPE. It is a type that works together with another
// type (the element type) to fully describe the overall type.
//
// The angle brackets < > after "Array" contain the TYPE ARGUMENT — the
// type of values stored inside the array. Without this argument, Array
// alone is incomplete — TypeScript needs to know what is inside.
//
// Array<string> is the first built-in generic type you encounter, but
// the same pattern appears throughout TypeScript (Promise<T>, Map<K,V>,
// Record<K,V>, etc.) and you can create your own generic types as well.

// WHAT MAKES A TYPE "GENERIC"?
//
// A generic type is the type IN FRONT of the angle brackets — here,
// "Array" is the generic type. It is FLEXIBLE: it can describe arrays
// of strings, arrays of numbers, arrays of objects, etc. The type
// inside the angle brackets (the type argument) tells it what specific
// kind of values the array will hold.
//
// So generics are about COMBINATIONS of types: the generic type
// (Array) provides the structure, the type argument (string) provides
// the specifics. Together they describe the full value type.
//
// With this understanding, you can now build your own generic types —
// types that are flexible and reusable, parameterized by other types.
let names: Array<string> = ['Max', 'Anna'];

// =====================================================================
// CREATING A CUSTOM GENERIC TYPE — defining your own <T>.
// =====================================================================
//
// To create a generic type, add angle brackets < > after the type name
// in the DEFINITION. Inside the brackets, place a PLACEHOLDER (commonly
// "T" for type, but any name works). This placeholder represents a
// type that will be provided later — when someone USES the type.
//
// KEY DIFFERENCE from using a built-in generic:
//   Array<string>      — USING a generic: you provide a concrete type
//   type DataStore<T>  — DEFINING a generic: you create a placeholder
//
// The placeholder T can then be used anywhere inside the type definition
// where you would normally put a concrete type. It acts as a variable
// for types — filled in later at the point of use.
//
// You can have multiple placeholders if needed (e.g., <T, U>), but a
// single placeholder is the most common starting point.

// DataStore is a generic type — it does not decide what values it
// stores. That decision is deferred to wherever DataStore is used.
// The index type [key: string] allows any string-named properties,
// and T is the type of VALUE stored under each property.
type DataStore<T> = {
  [key: string]: T;
};

// USING the custom generic type — now we provide the concrete type
// argument inside < >. Each usage can choose a different type.

// This store accepts string OR boolean values — T is string | boolean.
let store: DataStore<string | boolean> = {};
store.name = 'Max';
store.isInstructor = true;

// This store accepts ONLY strings — T is string.
// The same generic type, but with a different type argument.
let nameStore: DataStore<string> = {};

// =====================================================================
// GENERIC FUNCTIONS — functions parameterized by type placeholders.
// =====================================================================
//
// Just as you can create generic types (like DataStore<T>), you can
// create GENERIC FUNCTIONS. The syntax is the same: add angle brackets
// with a placeholder after the FUNCTION NAME.
//
// The placeholder can then be used as a type for parameters and the
// return value. This lets the function work with any kind of value
// while preserving the concrete type information — unlike "any", which
// discards all type information.
//
// WHY NOT "any"?
// Using "any" for parameters means the return type is also "any" (or
// any[]). TypeScript then cannot provide autocompletion or type checks
// on the returned value. With a generic placeholder, TypeScript tracks
// the actual type through the function and infers a precise return type.

// MULTIPLE TYPE PLACEHOLDERS — allowing different types per parameter.
//
// With a single placeholder (e.g., merge<T>(a: T, b: T)), both
// parameters must be the SAME type — passing a number and a string
// would produce an error because T can only be one type at a time.
//
// To allow different types, add more placeholders separated by commas:
// <T, U>. Each placeholder is independent — T can be number while U
// is string, or both can be the same type. You can add as many
// placeholders as needed (<T, U, V, ...>).
function merge<T, U>(a: T, b: U) {
  return [a, b];
}

// T is inferred as "number", U is inferred as "string" — ids is
// (number | string)[]. Both types are preserved, not lost to "any".
// You COULD write merge<number, string>(1, 'Max') to be explicit,
// but TypeScript's inference handles it automatically.
const ids = merge(1, 'Max');

// =====================================================================
// GENERIC CONSTRAINTS — restricting which types a placeholder accepts.
// =====================================================================
//
// By default, a type placeholder like <T> accepts ANY type — numbers,
// strings, booleans, objects, anything. Sometimes that is too broad.
// For example, a function that spreads two values into a new object
// only makes sense if both values ARE objects — spreading a number
// produces an empty object, which is probably not what you want.
//
// The "extends" keyword after a placeholder adds a CONSTRAINT:
//   <T extends object>
// This tells TypeScript: "T can be any type, AS LONG AS it is some
// kind of object." Numbers, strings, booleans are rejected at compile
// time. Any object shape qualifies — the constraint does not restrict
// which properties the object must have, only that it must be an object.
//
// You can constrain to any type — not just "object". For example:
//   <T extends number>    — T must be a number or number subtype
//   <T extends string>    — T must be a string
//   <T extends { length: number }> — T must have a length property
//
// Each placeholder can have its own independent constraint.
function mergeObj<T extends object, U extends object>(a: T, b: U) {
  return { ...a, ...b };
}

// Both arguments are objects — satisfies the "extends object" constraint.
// TypeScript infers the merged return type with all properties from both.
const merged = mergeObj({ userName: 'Max' }, { age: 35 });
console.log(merged);
