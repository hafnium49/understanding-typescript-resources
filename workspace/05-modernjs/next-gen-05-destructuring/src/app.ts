// (Previous lessons covered let, const, arrow functions, default params,
// spread operator, and rest parameters — see earlier projects.)

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

// =====================================================================
// DESTRUCTURING — extracting values from arrays and objects (ES6).
// =====================================================================
//
// Destructuring provides a concise syntax for pulling values out of
// arrays or properties out of objects and storing them in individual
// variables or constants. It is pure JavaScript syntax — not TypeScript.

// ARRAY DESTRUCTURING:
//
// Place square brackets on the LEFT side of the "=" sign. Each name
// inside the brackets becomes a new constant (or variable with "let")
// that receives the corresponding element BY POSITION from the array
// on the right side.
//
// You can combine this with rest syntax (...remainingHobbies) to
// collect all leftover elements into a new array. If the source array
// has only as many elements as named slots, the rest array is empty.
//
// IMPORTANT: Destructuring does NOT modify the original array. The
// values are copied into the new constants — the source array remains
// unchanged.
const [hobby1, hobby2, ...remainingHobbies] = hobbies;

console.log(hobbies, hobby1, hobby2);

// OBJECT DESTRUCTURING:
//
// Place curly braces on the LEFT side of "=". Inside the braces, list
// the PROPERTY NAMES from the object you want to extract. Unlike array
// destructuring (which works by position), object destructuring works
// BY KEY NAME — the names between the braces must match actual property
// names in the object.
//
// RENAMING (ALIASING): If you need a different variable name than the
// property name (e.g., to avoid conflicts with existing variables), use
// "propertyName: newName" syntax. This colon is NOT a type annotation —
// it is JavaScript's destructuring rename syntax. Below, "firstName"
// is the key in the person object, and "userName" is the name of the
// constant that will hold its value.
//
// Just like array destructuring, this does NOT modify the original
// object — the values are copied into new constants.
const { firstName: userName, age } = person;

// "userName" holds the value of person.firstName ('Max').
// "age" holds the value of person.age (30).
// "firstName" is NOT available as a variable — it was renamed to userName.
// "person" itself is unchanged.
console.log(userName, age, person);
