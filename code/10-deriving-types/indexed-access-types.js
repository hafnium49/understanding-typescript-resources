"use strict";
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
