// =====================================================================
// MAPPED TYPES — transforming each property of an object type.
// =====================================================================
//
// A mapped type creates a new object type by walking through the keys
// of an existing object type and producing a property for each one.
// You decide what type to assign to each new property.
//
// The syntax uses two TypeScript features together:
//   - keyof T  — produces the union of T's property names
//   - K in U   — iterates over each member of the union U
//
// Combined as "[Key in keyof T]", this means: "for every property name
// in T, create a property in the new type with that same name."
//
// Mapped types let you define one object type that automatically tracks
// the SHAPE of another, without manually duplicating keys. If the source
// type changes, the mapped type updates with it.

// A starting object type with two methods. The keys are "add" and
// "subtract", and the values are functions returning numbers.
//
// READONLY: Marking each method as "readonly" prevents reassigning
// the function — once mathOperations.add is set, you cannot replace
// it with a different function. This is a standard TypeScript modifier
// available on any object type, not exclusive to mapped types.
type Operations = {
  readonly add: (a: number, b: number) => number;
  readonly subtract: (a: number, b: number) => number;
};

// MAPPED TYPE WITH MODIFIER ADJUSTMENTS:
//
// Mapped types support adding extra modifiers to each generated
// property. Two common modifiers are "?" (optional) and "readonly".
//
// The "?" after the closing bracket makes EVERY mapped property
// optional — even if it was required in the source type. This is how
// you transform a "required" object type into a "partial" version of
// itself.
//
// You can also REMOVE these modifiers using "-?" or "-readonly", which
// is useful when the source type has them and you want to strip them.
// Both forms — adding and removing — are mapped-type-exclusive syntax.
//
// MODIFIER INHERITANCE: By default, mapped types preserve the modifiers
// from the source type. So Operations being readonly would normally
// flow into Results, but the explicit "?" addition here only changes
// optionality — readonly inheritance is independent.
type Results<T> = {
  [Key in keyof T]?: number;
};

// A concrete value matching the Operations type — methods that
// actually perform the math.
let mathOperations: Operations = {
  add(a: number, b: number) {
    return a + b;
  },
  subtract(a: number, b: number) {
    return a - b;
  },
};

// USING THE MAPPED TYPE: Results<Operations> produces a new object
// type with the same keys as Operations (add, subtract), but each
// value is now a number — the RESULT of calling the corresponding
// operation, not the function itself.
//
// Without the mapped type, you would have to manually write
// "type Results = { add: number; subtract: number; }" — and keep it
// in sync whenever Operations changes. The mapped type does that
// automatically.
let mathResults: Results<Operations> = {
  add: mathOperations.add(5, 1),
  subtract: mathOperations.subtract(5, 2),
};
