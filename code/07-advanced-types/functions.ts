// =====================================================================
// FUNCTION OVERLOADS — the problem they solve (setup).
// =====================================================================
//
// When a function accepts a union type parameter and returns different
// types depending on which variant it receives, TypeScript infers the
// RETURN type as a union of all possible return types. This is correct
// in general, but it means the caller cannot use type-specific
// properties on the result without additional type narrowing or casting.
//
// The getLength function below returns a STRING when given a string
// input (e.g., "3 words") and a NUMBER when given an array input
// (e.g., 2). But TypeScript infers the return type as string | number
// for ALL calls — even when the caller passes a string and therefore
// knows the result will be a string.
//
// This means accessing .length on the result (to count characters)
// produces an error, because .length does not exist on number.
// Function overloads (covered in the next lesson) solve this problem.

function getLength(val: string | any[]) {
  if (typeof val === 'string') {
    const numberOfWords = val.split(' ').length;
    return `${numberOfWords} words`;
  }
  return val.length;
}

// TypeScript infers numOfWords as string | number — even though WE
// know it will be a string because we passed a string argument.
const numOfWords = getLength('does this work?');

// PROBLEM: This would cause a compile error because TypeScript thinks
// numOfWords could be a number, and numbers don't have a .length
// property. We could use type casting (numOfWords as string).length
// to work around it, but that's not ideal.
// numOfWords.length;  // ERROR: Property 'length' does not exist on type 'string | number'

const numItems = getLength(['Sports', 'Cookies']);
