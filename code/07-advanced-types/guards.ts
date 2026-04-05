// =====================================================================
// TYPE GUARDS — safely narrowing union types at runtime.
// =====================================================================
//
// When a parameter's type is a union (e.g., FileSource | DBSource),
// TypeScript cannot know which variant you received. A TYPE GUARD is
// an if-check that narrows the type so TypeScript (and your code) can
// safely access properties specific to one variant.
//
// LESSON 90 used the "in" operator to check for the existence of a
// specific property (e.g., 'path' in source). That works, but has a
// downside: if the property name is ever renamed, the type guard
// breaks silently.

// =====================================================================
// DISCRIMINATED UNIONS — a cleaner pattern for type narrowing.
// =====================================================================
//
// Instead of checking for the existence of different properties, add
// a SHARED property (commonly called "type" or "kind") to ALL types
// in the union. Each type sets this shared property to a different
// LITERAL value. Then the type guard checks the VALUE of this shared
// property rather than the EXISTENCE of type-specific properties.
//
// This pattern is called a "discriminated union" because you
// DISCRIMINATE (distinguish) between variants using a shared property
// whose value differs per variant.

// Both types now have a shared "type" property — but each sets it to
// a different LITERAL string value. This is what makes discrimination
// possible: the property name is the same, the value is unique.
type FileSource = { type: 'file'; path: string };
const fileSource: FileSource = {
  type: 'file',
  path: 'some/path/to/file.csv',
};

type DBSource = { type: 'db'; connectionUrl: string };
const dbSource: DBSource = {
  type: 'db',
  connectionUrl: 'some-connection-url',
};

type Source = FileSource | DBSource;

function loadData(source: Source) {
  // DISCRIMINATED UNION TYPE GUARD:
  //
  // Since both FileSource and DBSource have a "type" property,
  // source.type is ALWAYS safe to access — no matter which variant
  // we received. TypeScript infers its type as 'file' | 'db' (a
  // union of the two literal values).
  //
  // Checking source.type === 'file' narrows source to FileSource
  // inside the if-block, giving access to source.path. After the
  // return, TypeScript automatically narrows to DBSource, giving
  // access to source.connectionUrl — same automatic narrowing as
  // with the "in" operator approach from the previous lesson.

  // Old approach (lesson 90): if ('path' in source) { ... }
  // New approach: check the shared discriminant property instead.
  if (source.type === 'file') {
    source.path; // => use this to open and read the file
    return;
  }

  source.connectionUrl; // => use this to reach out to the database
}
