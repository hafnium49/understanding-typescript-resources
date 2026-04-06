"use strict";
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
// A concrete value matching the Operations type — methods that
// actually perform the math.
let mathOperations = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
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
let mathResults = {
    add: mathOperations.add(5, 1),
    subtract: mathOperations.subtract(5, 2),
};
