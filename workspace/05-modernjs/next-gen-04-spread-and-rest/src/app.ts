// (Previous lessons covered let, const, arrow functions, default params,
// and the spread operator — see earlier next-gen projects for details.)

const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];
activeHobbies.push(...hobbies);

const person = {
  name: 'Max',
  age: 30
};
const copiedPerson = { ...person };

// =====================================================================
// REST PARAMETERS (...) — accepting an unlimited number of arguments.
// =====================================================================
//
// The spread operator (...) expands values OUT of an array. REST
// PARAMETERS use the same three-dot syntax but do the OPPOSITE: they
// COLLECT an incoming comma-separated list of arguments INTO an array.
//
// The difference is WHERE the dots appear:
//   - In a function CALL or array/object literal → spread (expanding)
//   - In a function PARAMETER LIST → rest (collecting)
//
// REST PARAMETER SYNTAX:
//   (...paramName: type[])
//
// This tells JavaScript: "accept any number of arguments and merge them
// into an array." The caller passes individual values (not an array),
// and inside the function you work with an array.
//
// TYPE ANNOTATION: The rest parameter is typed as an array of the
// expected element type — here, "number[]" means each argument must be
// a number, and "numbers" inside the function is a number array.
//
// Many built-in methods use rest parameters internally. For example,
// Array.push() accepts (...items: T[]) — which is why you can push
// multiple values at once: activeHobbies.push('A', 'B', 'C').

const add = (...numbers: number[]) => {
  // ARRAY.REDUCE() — a standard JavaScript method that iterates over
  // every element in an array, accumulating a single result.
  //
  // It takes two arguments:
  //   1. A callback with (accumulator, currentValue) → new accumulator
  //   2. An initial value for the accumulator (0 here)
  //
  // On each iteration, curResult holds the running total and curValue
  // is the current array element. The final accumulated value is returned.
  return numbers.reduce((curResult, curValue) => {
    return curResult + curValue;
  }, 0);
};

// Calling add with 4 arguments — all are collected into the "numbers"
// array inside the function via rest parameters.
const addedNumbers = add(5, 10, 2, 3.7);
console.log(addedNumbers);

// REST PARAMETERS WITH TUPLES — for a fixed number of arguments.
//
// If you know exactly how many arguments the function should accept
// (but still want the rest parameter collection syntax), you can use
// a tuple type instead of an open array:
//
//   const addThree = (...numbers: [number, number, number]) => { ... };
//
// This accepts exactly three number arguments — no more, no fewer.
// It combines the convenience of rest syntax with the strictness of
// a tuple. For truly unlimited arguments, use number[] as shown above.
