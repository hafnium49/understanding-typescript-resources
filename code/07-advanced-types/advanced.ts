// =====================================================================
// INDEX TYPES — flexible object types with dynamic property names.
// =====================================================================
//
// Sometimes you need an object type where you do not know the property
// names in advance and cannot predict how many properties will exist.
// You just want to constrain the VALUE types of those properties.
//
// TypeScript's INDEX TYPE feature lets you define a placeholder for
// any number of dynamically named properties. The syntax uses square
// brackets inside the type definition:
//
//   { [placeholderName: keyType]: valueType }
//
// - placeholderName: any name you choose (e.g., "prop", "key") — it is
//   NOT an actual property name, just a label for the placeholder.
// - keyType: the type of the property NAMES — typically "string" (most
//   common), but can also be "number" or "symbol" (all valid JavaScript
//   object key types).
// - valueType: the type of values stored under those properties — can
//   be any type, union type, object type, etc.
//
// This allows developers to add as many properties as they want, with
// any names they choose, as long as the values match the declared type.

type DataStore = {
  [prop: string]: number | boolean;
};

// Initially an empty object — valid because the index type does not
// require any specific properties to exist.
let store: DataStore = {};

// ... other code might run here ...

// Dynamically adding properties — TypeScript allows this because the
// index type permits any string-named property with number or boolean
// values.
store.id = 5;
store.isOpen = false;

// COMPILE ERROR if uncommented: 'Max' is a string, but the index type
// only allows number | boolean values. The property NAME can be any
// string, but the VALUE must match the declared type.
// store.name = 'Max';

// INDEX TYPES vs. RECORD — the DataStore type above is essentially a
// custom version of TypeScript's built-in Record type. These two
// definitions are equivalent:
//
//   type DataStore = { [prop: string]: number | boolean };
//   type DataStore = Record<string, number | boolean>;
//
// Record is a GENERIC type (generics are covered in depth later) that
// takes two type arguments: the key type and the value type. It is a
// more concise way to express the same thing as an index type.
// You can use either approach — or mix and match — depending on your
// preference and project conventions.

// =====================================================================
// AS CONST — narrowing inferred types to their most specific form.
// =====================================================================
//
// By default, TypeScript infers broad types from initial values. An
// array like ['admin', 'guest', 'editor'] is inferred as string[] —
// meaning any number of any strings can be added or removed.
//
// Adding "as const" after the value tells TypeScript to infer the
// NARROWEST possible type instead of a broad one. This is a TypeScript-
// specific feature (not JavaScript).
//
// With "as const", the array becomes:
//   - READONLY — you cannot push, pop, or otherwise mutate it
//   - LITERAL TYPED — each element is its exact literal value, not
//     just "string" (e.g., 'admin' instead of string)
//   - FIXED LENGTH — it's a readonly tuple, not a resizable array
//
// This is useful when you want TypeScript to treat values as constants
// with precise types rather than generic containers.
let roles = ['admin', 'guest', 'editor'] as const;

// COMPILE ERROR if uncommented: cannot push to a readonly array.
// Without "as const", this would work fine (roles would be string[]).
// roles.push('max');

// TypeScript knows firstRole is specifically 'admin' (a literal type),
// not just any string — because "as const" preserved the exact value
// at each index position.
const firstRole = roles[0];

// =====================================================================
// SATISFIES — type validation with narrower inference.
// =====================================================================
//
// When you assign a type with the colon notation (e.g., ": Record<...>"),
// TypeScript uses THAT type as the variable's type — even if the actual
// value is more specific. This means you lose access to properties that
// exist on the value but are not guaranteed by the broad type.
//
// The "satisfies" keyword (placed AFTER the value, not before it) takes
// a different approach:
//   1. It VALIDATES the value against the given type — if the value does
//      not match, you get a compile error.
//   2. It then INFERS the most specific type possible from the actual
//      value — so the variable's type is the narrow, concrete shape,
//      not the broad type you validated against.
//
// This gives you both type safety (the value must satisfy the constraint)
// AND narrow inference (TypeScript knows exactly which properties exist).
//
// USE CASES: Most useful in library code where you want to enforce a
// structural contract but let consumers' actual values drive the type
// inference for better downstream type support.

const dataEntries = {
  entry1: 0.51,
  entry2: -1.23
} satisfies Record<string, number>;

// With "satisfies", TypeScript infers the concrete object shape:
// { entry1: number; entry2: number } — NOT the broad Record type.
// This means entry1 and entry2 are known, but entry3 is NOT allowed.

// ... further code can safely use dataEntries ...

// COMPILE ERROR if uncommented: 'entry3' does not exist on the inferred
// concrete type. With a colon type (: Record<string, number>), this
// would have been allowed because Record permits any string key.
// dataEntries.entry3
