// NULL IN PRACTICE — handling DOM methods that may return null.
//
// document.getElementById() returns HTMLElement | null. The null case
// occurs when no element with the given ID exists in the DOM. TypeScript
// infers this union automatically, so you must handle the null possibility
// before using the result.
//
// The "as HTMLInputElement | null" below is a TYPE ASSERTION (covered in
// more detail later). It tells TypeScript to treat the result as a more
// specific type — HTMLInputElement instead of the generic HTMLElement —
// so we can later access input-specific properties like ".value".
//
// NON-NULL ASSERTION OPERATOR (!) — silencing null warnings.
//
// Alternatively, you can place "!" after an expression that might be null:
//   const inputEl = document.getElementById('user-name')!;
// This tells TypeScript "I guarantee this will not be null here." It
// strips null from the inferred type, so TypeScript treats the result as
// just HTMLElement (no null). You can place "!" either where you GET the
// value or where you USE it (e.g., inputEl!.value).
//
// WARNING: This is a dangerous operator. It does not add any runtime
// check — it only suppresses the TypeScript error. If the element truly
// does not exist, you will get a runtime error that TypeScript can no
// longer warn you about. Use it only when you are certain the value
// cannot be null. For safer alternatives, prefer type narrowing (the
// if-check below) or optional chaining (?.).
const inputEl = document.getElementById('user-name') as HTMLInputElement | null;

// TYPE NARROWING — TypeScript tracks control flow to refine types.
//
// By checking if inputEl is falsy (which it would be if null), and
// throwing an error in that case, TypeScript understands that any code
// AFTER this check can only be reached when inputEl is NOT null. It
// automatically narrows the type from "HTMLInputElement | null" down
// to just "HTMLInputElement" for all subsequent lines.
//
// Uncomment the if-block below to see narrowing in action: the error
// on inputEl.value would disappear because TypeScript knows null has
// been ruled out.
// if (!inputEl) {
//   throw new Error('Element not found!');
// }

// OPTIONAL CHAINING (?.) — a JavaScript operator for safe property access.
//
// The "?." operator short-circuits to undefined if the left side is null
// or undefined, instead of throwing a runtime error. It is a concise
// alternative to an explicit null check when you simply want to skip
// the operation rather than throw an error.
//
// COMPARISON OF THE THREE APPROACHES:
//   1. if-check + throw  — safest: handles null explicitly, runs fallback
//      code, and narrows the type for all subsequent lines.
//   2. "!" assertion      — quickest: silences TypeScript but adds no
//      runtime protection. Risky if your assumption is wrong.
//   3. "?." chaining      — concise and safe at runtime: skips the
//      operation on null, but provides no fallback logic (unlike the
//      if-check approach where you can throw, log, or set a default).
console.log(inputEl?.value);