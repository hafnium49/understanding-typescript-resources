// =====================================================================
// TEMPLATE LITERAL TYPES — composing string literal types like strings.
// =====================================================================
//
// Template literal types use the same backtick syntax as JavaScript's
// template literals, but they operate on TYPES (not values). They let
// you build new string literal types by combining other string literal
// types — including the cross-product of unions.
//
// JAVASCRIPT REMINDER (a value, not a type):
// const mainUserName = 'Max';
// const greeting = `Hi there, ${mainUserName}.`;
//
// The same backtick + ${...} syntax appears in TypeScript types, but
// in a TYPE position (after "type ... ="). The result is a string
// literal TYPE, not a string value.

// Two unions of string literal types — each describing a possible
// permission state in two different categories.
type ReadPermissions = 'no-read' | 'read';
type WritePermissions = 'no-write' | 'write';

// TEMPLATE LITERAL TYPE: combines the two unions into every possible
// "read-write" combination. Because both inputs are unions, TypeScript
// produces the CROSS PRODUCT — every literal in ReadPermissions paired
// with every literal in WritePermissions, separated by a dash.
//
// FilePermissions becomes the union:
//   'no-read-no-write' | 'no-read-write' | 'read-no-write' | 'read-write'
//
// Defining all four manually would work but is tedious; if you added
// new variants to either union, you would have to update the combined
// type by hand. Template literal types do that automatically.
type FilePermissions = `${ReadPermissions}-${WritePermissions}`;

// An object type using FilePermissions as the type for one property.
type DataFile = {
  data: string;
  permissions: FilePermissions;
};

// =====================================================================
// COMBINING WITH keyof — generating event names from property names.
// =====================================================================
//
// Template literal types compose well with other type operators. Here,
// keyof DataFile produces 'data' | 'permissions', and the template
// literal appends 'Changed' to each — giving the union:
//   'dataChanged' | 'permissionsChanged'
//
// This is a common pattern for generating event handler names from a
// data shape. If DataFile gains a new property, the event names update
// automatically.
type DataFileEventNames = `${keyof DataFile}Changed`;

// MAPPED TYPE OVER THE GENERATED NAMES: walks through every name in
// the DataFileEventNames union and creates a property with that name,
// typed as a function. The result is an object type where each event
// name maps to an event handler.
//
// DataFileEvents is now:
//   { dataChanged: () => void; permissionsChanged: () => void; }
type DataFileEvents = {
  [Key in DataFileEventNames]: () => void;
};
