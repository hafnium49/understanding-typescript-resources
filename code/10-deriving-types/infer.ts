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
