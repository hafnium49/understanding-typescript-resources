// SECTION SUMMARY — TypeScript as a JavaScript downlevel compiler.
//
// Throughout this section, every feature demonstrated (let, const, arrow
// functions, default parameters, spread, rest parameters, destructuring)
// is standard JavaScript — not TypeScript-specific syntax.
//
// The key takeaway is that TypeScript does NOT only strip its own type
// annotations during compilation. It also TRANSFORMS modern JavaScript
// syntax into older JavaScript when the "target" in tsconfig.json is
// set to an earlier version.
//
// EXAMPLE:
//   target: "es6"  → output keeps const, let, arrow functions, destructuring
//                     (all supported natively in ES6).
//   target: "es5"  → output converts const/let to var, replaces arrow
//                     functions with regular functions, rewrites
//                     destructuring into manual index/property access, etc.
//                     The compiled code is longer but runs in older runtimes
//                     like Internet Explorer.
//
// This means you can write modern, readable JavaScript/TypeScript and
// still deploy to environments that only support older JS versions —
// TypeScript handles the translation automatically based on the target.
//
// NOTE: When you change the target, you may also need to adjust the "lib"
// setting. Commenting out "lib" lets TypeScript use the default libraries
// for the chosen target. Leaving an ES6 lib with an ES5 target can cause
// mismatches between what types are available and what code is emitted.

// --- All features from previous lessons, combined in one file ---

const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];

activeHobbies.push(...hobbies);

const person = {
  firstName: 'Max',
  age: 30
};

const copiedPerson = { ...person };

const add = (...numbers: number[]) => {
  return numbers.reduce((curResult, curValue) => {
    return curResult + curValue;
  }, 0);
};

const addedNumbers = add(5, 10, 2, 3.7);
console.log(addedNumbers);

const [hobby1, hobby2, ...remainingHobbies] = hobbies;

console.log(hobbies, hobby1, hobby2);

const { firstName: userName, age } = person;

console.log(userName, age, person);
