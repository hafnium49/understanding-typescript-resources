"use strict";
// =====================================================================
// CONDITIONAL TYPES — types that branch based on a condition.
// =====================================================================
//
// A conditional type uses syntax that LOOKS like a JavaScript ternary
// expression, but operates on TYPES at compile time:
//
//   T extends SomeType ? TrueBranch : FalseBranch
//
// "extends" here is NOT a constraint (which uses the same keyword in
// generic parameter brackets). It is a type-level CHECK: "if T fits
// SomeType, use TrueBranch; otherwise, use FalseBranch."
//
// This is most useful for utility/helper types — types that need to
// behave differently depending on what type they receive. You will
// rarely need them in regular application code, but they are common
// in libraries and frameworks.
// PREVIOUS APPROACH (commented out): a generic type with a constraint
// that ONLY works on arrays. Useful, but it cannot accept non-array
// types at all — passing anything else is a compile error.
// type ElementType<T extends any[]> = T[number];
// type Example1 = ElementType<StringArray>
let text = 1;
// The function uses two TypeScript features together:
//   - Generic constraint: T extends object (any object shape)
//   - Conditional return: FullnameOrNothing<T> picks string vs never
//     based on whether the actual object T has firstName/lastName.
function getFullname(person) {
    // Runtime checks: ensure both properties exist AND are truthy.
    // The "in" operator and truthiness checks are standard JavaScript.
    if ('firstName' in person &&
        'lastName' in person &&
        person.firstName &&
        person.lastName) {
        // Type assertion is needed because TypeScript cannot prove at
        // compile time that the runtime checks above match the conditional
        // type's expectation. We tell it: "trust me, this branch produces
        // a valid FullnameOrNothing<T> result."
        return `${person.firstName} ${person.lastName}`;
    }
    throw new Error('No first name and / or last name found.');
}
// EMPTY OBJECT: T = {}, which does NOT extend FullnamePerson, so the
// false branch runs. name1 is typed as "never" — TypeScript knows
// the function cannot produce a meaningful value here. (At runtime,
// it throws an error.)
const name1 = getFullname({});
// PROPER PERSON OBJECT: T extends FullnamePerson, so the true branch
// runs and name2 is typed as "string". The conditional type let
// TypeScript pick the right return type per call site.
const name2 = getFullname({ firstName: 'Max', lastName: 'Schwarzmüller' });
