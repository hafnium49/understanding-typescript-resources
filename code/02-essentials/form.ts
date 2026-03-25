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
console.log(inputEl?.value);