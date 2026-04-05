// =====================================================================
// TYPE GUARDS — safely narrowing union types at runtime.
// =====================================================================
//
// When a parameter's type is a union (e.g., FileSource | DBSource),
// TypeScript cannot know which variant you received. A TYPE GUARD is
// an if-check that narrows the type so TypeScript (and your code) can
// safely access properties specific to one variant.

// Two types with DIFFERENT shapes — they share no common properties.
type FileSource = { path: string };
const fileSource: FileSource = {
  path: 'some/path/to/file.csv',
};

type DBSource = { connectionUrl: string };
const dbSource: DBSource = {
  connectionUrl: 'some-connection-url',
};

// A union type — the parameter could be either variant.
type Source = FileSource | DBSource;

function loadData(source: Source) {
  // THE "in" OPERATOR AS A TYPE GUARD:
  //
  // The "in" operator is standard JavaScript — it checks whether a
  // property name exists on an object. When used in an if-check with
  // a union type, TypeScript uses it to NARROW the type: inside the
  // if-block, source is treated as FileSource (the only variant that
  // has a "path" property).
  //
  // Unlike the "unknown" type example from earlier sections, we do
  // NOT need to check "typeof source === 'object'" first — the Source
  // union already guarantees source is an object (both FileSource and
  // DBSource are object types). The only question is WHICH object
  // shape we received.
  if ('path' in source) {
    // TypeScript narrows source to FileSource inside this block.
    source.path; // => use this to open and read the file
    return;
  }

  // AUTOMATIC NARROWING AFTER RETURN:
  //
  // Because the if-block above returns, TypeScript knows that any
  // code reaching this point CANNOT be a FileSource (it would have
  // returned). Therefore, source is automatically narrowed to
  // DBSource — no additional check needed.
  source.connectionUrl; // => use this to reach out to the database
}
