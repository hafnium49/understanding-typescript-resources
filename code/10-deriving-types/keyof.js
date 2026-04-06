"use strict";
// =====================================================================
// THE "keyof" OPERATOR — extracting property names as a union type.
// =====================================================================
//
// Unlike typeof (which exists in both JavaScript and TypeScript), keyof
// is a TypeScript-EXCLUSIVE operator. There is no JavaScript equivalent.
//
// keyof is followed by a TYPE (not a value, like typeof). It produces
// a UNION of string literal types — one literal for each property name
// in the source type. This is useful when you need to refer to "the
// set of valid keys for this type" without hard-coding them.
// validKey can only hold one of the values in the UserKeys union.
// Any other string would produce a compile error.
let validKey;
validKey = 'name';
validKey = 'age';
// validKey = 'email';  // COMPILE ERROR: not a key of User
// =====================================================================
// PRACTICAL USE CASE — keyof in a generic utility function.
// =====================================================================
//
// keyof shines when used with generics. The pattern below LINKS two
// placeholders: one for an object's type, and one constrained to be
// one of that object's keys. This guarantees at compile time that
// the key parameter is always a valid property name of the object.
//
// getProp is a utility that extracts a property from any object and
// throws if the value is undefined or null — so callers can trust the
// return value is always present.
//
// Two placeholders:
//   T extends object        — any object shape
//   U extends keyof T       — any property name from T
//
// "U extends keyof T" is the key insight: the second placeholder is
// constrained by the FIRST placeholder. TypeScript figures out which
// keys exist in T from the actual argument, then ensures the second
// argument is one of those keys. Pass a wrong key and you get a
// compile error before the code ever runs.
function getProp(obj, key) {
    // obj[key] is standard JavaScript dynamic property access.
    // TypeScript knows the result type because it knows T and U.
    const val = obj[key];
    if (val === undefined || val === null) {
        throw new Error('Accessing undefined or null value.');
    }
    return val;
}
// USAGE EXAMPLES:
// First example — an arbitrary data object. TypeScript infers T from
// the data argument and the allowed keys ('id' | 'isStored' | 'values')
// from keyof T. The return type of isStored is correctly inferred as
// boolean — not "any".
const data = { id: 1, isStored: false, values: [1, -5, 10] };
const isStored = getProp(data, 'isStored');
// Second example — a user object. The same generic function works
// with any shape, and the key parameter is constrained per-call to
// the keys of whichever object you pass in.
const user = { name: 'Max', age: 35 };
// 'age' is a valid key of user, so this compiles. val is inferred
// as number — TypeScript looked up user['age'] in the type system.
// Passing 'email' here would fail because user has no email key.
const val = getProp(user, 'age');
