// =====================================================================
// CONDITIONAL TYPES — types that branch based on a condition.
// =====================================================================
//
// A conditional type uses syntax that LOOKS like a JavaScript ternary
// expression, but operates on TYPES at compile time:
//
//   T extends SomeType ? TrueBranch : FalseBranch
//
// "extends" here is NOT a constraint (which uses the same keyword in
// generic parameter brackets). It is a type-level CHECK: "if T fits
// SomeType, use TrueBranch; otherwise, use FalseBranch."
//
// This is most useful for utility/helper types — types that need to
// behave differently depending on what type they receive. You will
// rarely need them in regular application code, but they are common
// in libraries and frameworks.

type StringArray = string[];

// PREVIOUS APPROACH (commented out): a generic type with a constraint
// that ONLY works on arrays. Useful, but it cannot accept non-array
// types at all — passing anything else is a compile error.
// type ElementType<T extends any[]> = T[number];
// type Example1 = ElementType<StringArray>

let text = 1;

// type Example2 = ElementType<typeof text>;  // ERROR: number is not an array

// CONDITIONAL TYPE APPROACH: instead of a constraint, the type CHECKS
// at use-time whether T is an array. If it is, the result is the
// element type (extracted with the [number] indexed access). If it
// is not, the result falls back to "never" — a type you cannot
// produce a value for, signaling "no meaningful element type here".
//
// "T extends any[]" is the condition. The "?" and ":" mirror the
// ternary syntax. "never" is a common fallback in conditional types
// because it disappears from unions and signals an unusable result.
type GetElementType<T> = T extends any[] ? T[number] : never;

// StringArray IS an array, so the true branch runs and Example1
// becomes "string" — the element type of the array.
type Example1 = GetElementType<StringArray>;

// typeof text is "number", which is NOT an array. The false branch
// runs and Example2 becomes "never". Unlike the constrained version
// above, this does NOT produce a compile error — it just yields a
// fallback type. Whether to fall back to "never", to T itself, or
// to something else is a design choice.
type Example2 = GetElementType<typeof text>;
