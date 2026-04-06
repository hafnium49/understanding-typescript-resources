// =====================================================================
// THE "infer" KEYWORD — extracting types from inside other types.
// =====================================================================
//
// "infer" is used inside CONDITIONAL TYPES to capture a type from the
// type being checked. It works like a placeholder that says: "if this
// type fits a certain pattern, give me the part I am pointing at."
//
// You declare a name (e.g., "infer RV") inside the "extends" pattern.
// If the condition matches, that name becomes a type variable you can
// use in the true branch — typically to return it as the result of
// the conditional type.
//
// Common use case: building utility types that pull a piece out of
// a larger type, such as the return type of a function.

function add(a: number, b: number) {
  return a + b;
}

// AddFn captures the FULL function signature:
//   (a: number, b: number) => number
type AddFn = typeof add;

// RETURN VALUE TYPE UTILITY:
//
// The condition "T extends (...args: any[]) => infer RV" asks:
// "Is T some kind of function?" The "(...args: any[]) =>" part is a
// generic function shape — any number of parameters of any types.
// The "...args" syntax is borrowed from JavaScript's rest parameters
// feature, used here to mean "we don't care how many parameters
// there are or what types they have."
//
// "infer RV" is the special part: it captures whatever the function's
// return type happens to be and binds it to the name RV. When the
// condition matches, the true branch returns RV — the captured
// return type. When it does not match, the false branch returns
// "never" (the input was not a function).
type ReturnValueType<T> = T extends (...args: any[]) => infer RV ? RV : never;

// Apply ReturnValueType to AddFn. The conditional matches because
// AddFn IS a function type, infer RV captures "number" (the return
// type of add), and the result is "number" — exactly the piece we
// wanted to extract from the bigger function type.
type AddFnReturnValueType = ReturnValueType<AddFn>;

// =====================================================================
// BUILT-IN UTILITY TYPES — TypeScript already provides many of these.
// =====================================================================
//
// The custom ReturnValueType above is so commonly needed that the
// TypeScript team has built an equivalent right into the language:
// "ReturnType". Under the hood, it uses the exact same features
// covered in this section (conditional types, infer, etc.).
//
// For your own projects, prefer the built-in versions when they
// exist — they are tested, well-documented, and globally available
// without any imports.
//
// A few of the most useful built-in utility types:
//   ReturnType<T>          — extracts a function's return type
//   Parameters<T>          — extracts a function's parameter tuple
//   Partial<T>             — makes all properties of T optional
//   Required<T>            — makes all properties of T required
//   Readonly<T>            — makes all properties of T readonly
//   Pick<T, Keys>          — selects a subset of T's properties
//   Omit<T, Keys>          — removes a subset of T's properties
//   Record<Keys, Type>     — builds an object with given keys and value type
//   NonNullable<T>         — strips null and undefined from T
//   Awaited<T>             — unwraps the value of a Promise<T>
//
// See the full list at:
// https://www.typescriptlang.org/docs/handbook/utility-types.html

// Using the built-in ReturnType — same result as our custom version
// (number), but no custom type definition needed.
type AddFnBuiltInReturn = ReturnType<AddFn>;
