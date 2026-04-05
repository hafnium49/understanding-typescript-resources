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
