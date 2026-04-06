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

type StringArray = string[];

// PREVIOUS APPROACH (commented out): a generic type with a constraint
// that ONLY works on arrays. Useful, but it cannot accept non-array
// types at all — passing anything else is a compile error.
// type ElementType<T extends any[]> = T[number];
// type Example1 = ElementType<StringArray>

let text = 1;

// type Example2 = ElementType<typeof text>;  // ERROR: number is not an array

// CONDITIONAL TYPE APPROACH: instead of a constraint, the type CHECKS
// at use-time whether T is an array. If it is, the result is the
// element type (extracted with the [number] indexed access). If it
// is not, the result falls back to "never" — a type you cannot
// produce a value for, signaling "no meaningful element type here".
//
// "T extends any[]" is the condition. The "?" and ":" mirror the
// ternary syntax. "never" is a common fallback in conditional types
// because it disappears from unions and signals an unusable result.
type GetElementType<T> = T extends any[] ? T[number] : never;

// StringArray IS an array, so the true branch runs and Example1
// becomes "string" — the element type of the array.
type Example1 = GetElementType<StringArray>;

// typeof text is "number", which is NOT an array. The false branch
// runs and Example2 becomes "never". Unlike the constrained version
// above, this does NOT produce a compile error — it just yields a
// fallback type. Whether to fall back to "never", to T itself, or
// to something else is a design choice.
type Example2 = GetElementType<typeof text>;

// =====================================================================
// CONDITIONAL TYPES IN FUNCTION RETURN TYPES.
// =====================================================================
//
// Conditional types are not just for utility types — they can shape
// the return type of a regular function. The pattern: declare what
// the function returns based on what kind of input it received.
//
// The function below builds a full name from a person object. If the
// object has firstName and lastName, it returns a string. If not, it
// throws an error and never produces a value. The conditional return
// type lets callers see "string" when they pass a valid person and
// "never" when they pass anything else — at compile time.

// The shape that a "valid" person must have to produce a full name.
type FullnamePerson = { firstName: string; lastName: string };

// CONDITIONAL RETURN TYPE: if T fits the FullnamePerson shape, the
// return type is "string". Otherwise it is "never" — signaling that
// no meaningful value can be produced.
type FullnameOrNothing<T> = T extends FullnamePerson ? string : never;

// The function uses two TypeScript features together:
//   - Generic constraint: T extends object (any object shape)
//   - Conditional return: FullnameOrNothing<T> picks string vs never
//     based on whether the actual object T has firstName/lastName.
function getFullname<T extends object>(person: T): FullnameOrNothing<T> {
  // Runtime checks: ensure both properties exist AND are truthy.
  // The "in" operator and truthiness checks are standard JavaScript.
  if (
    'firstName' in person &&
    'lastName' in person &&
    person.firstName &&
    person.lastName
  ) {
    // Type assertion is needed because TypeScript cannot prove at
    // compile time that the runtime checks above match the conditional
    // type's expectation. We tell it: "trust me, this branch produces
    // a valid FullnameOrNothing<T> result."
    return `${person.firstName} ${person.lastName}` as FullnameOrNothing<T>;
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
