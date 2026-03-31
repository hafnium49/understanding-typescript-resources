// (Previous lessons covered let, const, arrow functions, default params.)
const userName = 'Max';
let age = 30;
age = 29;

const add = (a: number, b: number = 1) => a + b;

const printOutput: (a: number | string) => void = output => console.log(output);

const button = document.querySelector('button');

if (button) {
  button.addEventListener('click', event => console.log(event));
}

printOutput(add(5));

// =====================================================================
// THE SPREAD OPERATOR (...) — expanding arrays and objects (ES6).
// =====================================================================
//
// The spread operator is three dots (...) placed before an array or
// object. It "spreads" the contents into individual elements.
//
// ARRAYS: ...array expands the array into a comma-separated list of
// its values. This is useful anywhere a list of individual values is
// expected — for example, as arguments to a function or as elements
// inside a new array literal.

const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];

// WITHOUT SPREAD: push(hobbies) would try to add the entire array as
// a single element, creating a nested array — TypeScript catches this
// because string[] is not assignable to string.
//
// You could manually write push(hobbies[0], hobbies[1]), but that is
// tedious and fragile if the array length changes.
//
// WITH SPREAD: ...hobbies expands into 'Sports', 'Cooking' as separate
// arguments to push, which accepts an unlimited number of arguments.
activeHobbies.push(...hobbies);

// NOTE: push() works on a const array because arrays are REFERENCE
// values. The const only prevents reassigning the variable itself —
// the array in memory can still be mutated via push(), pop(), etc.
// (See: academind.com/learn/javascript/reference-vs-primitive-values/)

// OBJECTS: ...object expands all key-value pairs into a new object.
//
// PRIMITIVE VS. REFERENCE COPIES:
// If you write "const copiedPerson = person", you are copying the
// POINTER (reference) to the same object in memory — not the object
// itself. Changing one changes both.
//
// The spread operator creates a SHALLOW COPY: a brand-new object is
// created, and all top-level key-value pairs from the original are
// copied into it. Now the two variables point to different objects.
// (For nested objects, only the top level is copied — deeper objects
// are still shared references. Use structuredClone() for deep copies.)
const person = {
  name: 'Max',
  age: 30
};

// { ...person } creates a new object with the same key-value pairs.
// Modifying copiedPerson.name would NOT affect person.name.
const copiedPerson = { ...person };
