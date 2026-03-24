// ARRAY TYPES — TypeScript understands the structure of arrays.
//
// TypeScript does not just see that "hobbies" is an array — it also
// infers the type of values INSIDE the array. Since every element in
// the initial value is a string, TypeScript infers the type as string[],
// meaning "an array of strings."
//
// The notation "string[]" is how TypeScript represents a typed array:
// the element type followed by []. You could write this explicitly as
// "let hobbies: string[] = [...]", but it is unnecessary here because
// inference handles it correctly.
//
// This combined type understanding (array + element type) is what makes
// TypeScript powerful for complex data structures — it does not just
// check simple primitives, but also enforces the internal consistency
// of collections.
let hobbies = ['Sports', 'Cooking'];

// COMPILE ERROR if uncommented: 10 is a number, but hobbies was inferred
// as string[]. TypeScript prevents pushing a value of the wrong type
// into a typed array, catching bugs that plain JavaScript would silently
// allow at runtime.
// hobbies.push(10);

// let users: (string | number)[];
let users: Array<string | number>;

users = [1, 'Max'];
users = [5, 1];
users = ['Max', 'Anna'];

let possibleResults: [number, number]; // [1, -1]

possibleResults = [1, -1];
// possibleResults = [5, 10, 12];

let user: {
  name: string;
  age: number | string;
  hobbies: string[];
  role: {
    description: string;
    id: number;
  }
} = {
  name: 'Max',
  age: 38,
  hobbies: ['Sports', 'Cooking'],
  role: {
    description: 'admin',
    id: 5
  }
};

let val: {} = 'is a value';

let data: Record<string, number | string>;

data = {
  entry1: 1,
  entry2: 'some string'
};