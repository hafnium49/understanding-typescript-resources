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

// Both lines below are identical in effect — string[] is a shorthand
// for Array<string>. The generic form makes the "type that works with
// another type" relationship explicit.
let names: Array<string> = ['Max', 'Anna'];
