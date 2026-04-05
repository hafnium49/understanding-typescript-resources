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
