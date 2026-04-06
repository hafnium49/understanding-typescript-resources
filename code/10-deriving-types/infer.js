"use strict";
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
function add(a, b) {
    return a + b;
}
