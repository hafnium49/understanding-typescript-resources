// =====================================================================
// ADVANCED TYPES — section overview.
// =====================================================================
//
// This section explores more advanced TypeScript features and patterns:
//
//   - Intersection types — combining multiple types into one
//   - Type guards — safely narrowing types at runtime
//   - Discriminated unions — a pattern for clean type narrowing
//   - Function overloads — multiple signatures for a single function
//
// These features build on the essentials (type aliases, union types,
// classes, interfaces) covered in earlier sections.

// =====================================================================
// INTERSECTION TYPES — combining multiple types into one with "&".
// =====================================================================
//
// An intersection type merges two or more types into a single type
// that has ALL the properties of every constituent type. The syntax
// uses the "&" (ampersand) operator between type names.
//
// This is especially useful when you have SHARED information (like
// a Status with isOpen and errorMessage) that needs to be combined
// with DIFFERENT specific types (like FileData or DatabaseData).
// Instead of duplicating the shared properties into each type, you
// define them once and intersect where needed.
//
// ALTERNATIVE: The same result can be achieved with interfaces using
// the "extends" keyword (e.g., interface AccessedFileData extends
// FileData, Status {}). Both approaches are valid — intersection
// types use the "type" keyword, extension uses "interface". It comes
// down to personal preference and project conventions.

type FileData = {
  path: string;
  content: string;
};

type DatabaseData = {
  connectionUrl: string;
  credentials: string;
};

// Shared information — reusable across multiple intersection types.
// The "?" on errorMessage makes it optional (string | undefined).
type Status = {
  isOpen: boolean;
  errorMessage?: string;
};

// INTERSECTION: FileData & Status produces a type with ALL four
// properties: path, content (from FileData) + isOpen, errorMessage
// (from Status). An object of this type must satisfy BOTH shapes.
type AccessedFileData = FileData & Status;

// The same shared Status type intersected with a different data type.
// This avoids duplicating isOpen and errorMessage in every type that
// needs status information.
type AccessedDatabaseData = DatabaseData & Status;
