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

// =====================================================================
// TYPE PREDICATE FUNCTIONS — reusable type guard logic.
// =====================================================================
//
// You can extract a type guard condition into a separate function so
// it can be reused across multiple places in your code.
//
// In modern TypeScript, when a function returns the result of a type
// check (like source.type === 'file'), TypeScript infers a TYPE
// PREDICATE as the return type — not just a plain boolean. A type
// predicate is a boolean with extra information: it tells TypeScript
// that if the function returns true, the input parameter is of a
// specific type.
//
// You can see the inferred return type by hovering over isFile in
// your editor — it shows something like:
//   (source: Source) => source is FileSource
// This means: "if isFile returns true, source is FileSource."
//
// NOTE: In older TypeScript versions, this did not work — TypeScript
// only knew the function returned true/false, without understanding
// what that meant for the input's type. Modern TypeScript infers
// type predicates automatically.
function isFile(source: Source) {
  return source.type === 'file';
}

function loadData(source: Source) {
  // Using the extracted type guard function instead of an inline check.
  // Because isFile returns a type predicate, TypeScript narrows source
  // to FileSource inside this if-block — exactly the same narrowing
  // as the inline "source.type === 'file'" check from lesson 91.
  if (isFile(source)) {
    source.path; // => use this to open and read the file
    return;
  }

  source.connectionUrl; // => use this to reach out to the database
}

// =====================================================================
// INSTANCEOF TYPE GUARD — for objects created from classes.
// =====================================================================
//
// When dealing with classes (not plain object types), you can use the
// "instanceof" operator as a type guard. This is a standard JavaScript
// operator (not TypeScript-specific) that checks whether an object was
// created from a particular class constructor.
//
// Unlike the "in" operator (checks for a property name) or discriminated
// unions (checks a shared literal property), instanceof checks the
// object's PROTOTYPE CHAIN — it asks "was this object created with
// this class (or a class that extends it)?"

class User {
  constructor(public name: string) {}

  join() {
    // ...
  }
}

class Admin {
  constructor(permissions: string[]) {}

  scan() {
    // ...
  }
}

const user = new User('Max');
const admin = new Admin(['ban', 'restore']);

// A union of two class types — entity is either a User or an Admin.
type Entity = User | Admin;

function init(entity: Entity) {
  // INSTANCEOF AS A TYPE GUARD:
  //
  // "entity instanceof User" checks whether entity was created from
  // the User class. If true, TypeScript narrows entity to User inside
  // the if-block, making entity.join() safely accessible.
  //
  // After the return, TypeScript narrows to Admin automatically —
  // the same return-based narrowing pattern used with "in" and
  // discriminated unions above.
  if (entity instanceof User) {
    entity.join();
    return;
  }

  entity.scan();
}
