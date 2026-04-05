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

// merge accepts two values of the same type T and returns them in an
// array. T is determined by the arguments at the call site.
function merge<T>(a: T, b: T) {
  return [a, b];
}

// TypeScript INFERS that T is "number" from the arguments (1 and 2),
// so ids is inferred as number[] — not any[].
// You COULD write merge<number>(1, 2) to be explicit, but it is not
// needed — TypeScript's inference handles it automatically.
const ids = merge(1, 2);
