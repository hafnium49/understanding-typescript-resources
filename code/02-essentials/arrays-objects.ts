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

// EXPLICIT ARRAY TYPE ANNOTATIONS — needed when there is no initial value.
//
// When a variable is declared without an initial array, TypeScript cannot
// infer the element type. You must annotate it explicitly.
//
// For a simple array of one type, use: string[] or number[].
// For an array that accepts multiple element types, combine union types
// with array notation. There are two equivalent syntaxes:
//
//   (string | number)[]          — union wrapped in parentheses, then []
//   Array<string | number>       — generic Array syntax (see below)
//
// The parentheses in (string | number)[] are essential — without them,
// "string | number[]" would mean "a string OR an array of numbers",
// which is a very different type.
//
// GENERIC ARRAY SYNTAX: Array<elementType>
//
// The "Array" keyword followed by angle brackets < > is a GENERIC TYPE.
// Generics are a more advanced TypeScript feature covered in depth later,
// but the core idea is simple: a generic type is a combination of types
// where one type (Array) is parameterized by another (the element type
// inside the angle brackets).
//
// Array<string | number> means exactly the same thing as (string | number)[]
// — both describe an array whose elements can be strings or numbers.
// Neither form is "better"; you will encounter both in real-world projects.
// The commented-out line below shows the bracket syntax for comparison.
// let users: (string | number)[];
let users: Array<string | number>;

// All three assignments below are valid because every element in each
// array is either a string or a number, both of which the union allows.
users = [1, 'Max'];
users = [5, 1];
users = ['Max', 'Anna'];

// TUPLE TYPES — fixed-length arrays with per-position types.
//
// A regular array type like number[] allows any number of elements.
// A TUPLE restricts both the LENGTH and the TYPE at each position.
//
// The syntax places types inside square brackets: [type1, type2, ...].
// This looks similar to an array literal, but appears in a type position.
//
// Tuples are useful when you know the exact structure of a short array —
// for example, a pair of coordinates, a success/error result, or (as here)
// a fixed set of possible outcome values. They provide stronger guarantees
// than a plain number[] because colleagues working on the same codebase
// cannot accidentally store arrays of the wrong length or shape.
//
// NOTE: TypeScript can be even more precise than "any number" — you can
// restrict to specific literal values (e.g., only 1 or -1), but that
// feature (literal types) is covered in a later lesson.
let possibleResults: [number, number]; // intended to hold [1, -1]

// Valid: exactly two elements, both numbers — matches the tuple shape.
possibleResults = [1, -1];
// COMPILE ERROR if uncommented: three elements violate the tuple's fixed
// length of two, even though all values are numbers.
// possibleResults = [5, 10, 12];

// OBJECT TYPES — TypeScript's way of describing the shape of objects.
//
// Objects are among the most common data structures in JavaScript, and
// TypeScript handles them naturally. If you assign an object literal to a
// variable, TypeScript infers the type from its properties and their values
// (e.g., { name: string; age: number }).
//
// You can also define the object type EXPLICITLY using a syntax that
// resembles an object literal — but instead of property: value pairs, you
// write property: type pairs. This appears on the left side of the "=",
// after the colon following the variable name.
//
// Inside an object type, you can use any type you already know:
// - Primitives (string, number, boolean)
// - Union types (number | string)
// - Array types (string[])
// - Nested object types (another { ... } block inside the type)
//
// The assigned value must satisfy EVERY property in the type definition.
// Missing or extra properties will produce compile errors. Your IDE also
// provides autocompletion based on the type, helping you fill in the
// required properties correctly.
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
  // TypeScript enforces types all the way down — adding a number here
  // (e.g., hobbies: ['Sports', 10]) would fail because hobbies is
  // typed as string[], not (string | number)[].
  hobbies: ['Sports', 'Cooking'],
  // Nested objects must also match their type definition exactly.
  // Both "description" and "id" are required with the correct types.
  role: {
    description: 'admin',
    id: 5
  }
};

// THE {} TYPE — a deceptive syntax that does NOT mean "empty object."
//
// When {} appears as a VALUE (right side of "="), it creates an empty
// object — that is standard JavaScript. But when {} appears as a TYPE
// (left side of "=", after the colon), it means something very different:
// "any value that is not null or undefined."
//
// This means strings, numbers, booleans, arrays, and objects are ALL
// assignable to a variable typed as {}. Only null and undefined are
// rejected. For example:
//   let val: {} = false;       // valid
//   let val: {} = 0;           // valid
//   let val: {} = '';          // valid
//   let val: {} = { a: 1 };   // valid
//   let val: {} = null;        // COMPILE ERROR
//   let val: {} = undefined;   // COMPILE ERROR
//
// This is one of TypeScript's most counterintuitive features. It is
// mentioned here because it looks like it should relate to object types,
// but it actually has nothing to do with describing object shapes.
let val: {} = 'is a value';

let data: Record<string, number | string>;

data = {
  entry1: 1,
  entry2: 'some string'
};