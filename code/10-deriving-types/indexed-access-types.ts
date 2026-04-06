// =====================================================================
// INDEXED ACCESS TYPES — looking up a property's type by name.
// =====================================================================
//
// Indexed access types let you extract the type of a specific property
// from an existing object type. The syntax uses square brackets — it
// LOOKS like JavaScript property access, but it operates on TYPES at
// compile time, not on values at runtime.
//
//   SomeType['propertyName']  → the type of that property
//
// This avoids duplicating type definitions when you need a sub-type
// for use elsewhere (e.g., a function parameter, another type alias).
// If the source type changes later, the extracted type updates
// automatically — no manual sync needed.

// You could derive AppUser from a value with typeof if you already
// had one, but here we define it explicitly:
// const appUser = {
//   name: 'Max',
//   age: 35,
//   permissions: [{ id: 'p1', title: 'Admin', description: 'Admin access' }],
// };
// type AppUser = typeof appUser;

type AppUser = {
  name: string;
  age: number;
  permissions: {
    id: string;
    title: string;
    description: string;
  }[];
};

// INDEXED ACCESS — extract the permissions property's type from AppUser.
// Perms is now exactly the array type defined for permissions above.
// If AppUser's permissions property changes shape later, Perms updates
// automatically — no copy-paste, no risk of drift.
//
// This is NOT JavaScript runtime code. The square brackets here operate
// in TypeScript's type system, not on a value.
type Perms = AppUser['permissions'];
