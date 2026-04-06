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

type User = { name: string; age: number };

// keyof User produces the union 'name' | 'age' — every property name
// in User becomes a literal in the union. If a new property is added
// to User later, UserKeys updates automatically.
type UserKeys = keyof User;

// validKey can only hold one of the values in the UserKeys union.
// Any other string would produce a compile error.
let validKey: UserKeys;

validKey = 'name';
validKey = 'age';
// validKey = 'email';  // COMPILE ERROR: not a key of User
