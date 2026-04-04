// =====================================================================
// INTERFACES — TypeScript-exclusive contracts for object shapes.
// =====================================================================
//
// An interface is a TypeScript-only feature — it does not exist in
// vanilla JavaScript and produces NO output in compiled code.
//
// An interface serves two purposes:
//
//   1. OBJECT TYPE: It defines the shape (properties and methods) that
//      an object must have. You can use an interface as a type annotation
//      on variables, parameters, or return types — similar to a type alias,
//      but with some differences explored in later lessons.
//
//   2. CLASS CONTRACT: A class can "implement" an interface using the
//      "implements" keyword. This forces the class to provide all the
//      properties and methods declared in the interface. If any are
//      missing, TypeScript produces a compile error.
//
// Both usages will be demonstrated in the following lessons.

// DEFINING AN INTERFACE — the "interface" keyword followed by a name.
//
// The naming convention is flexible — choose a name that describes what
// the interface represents. Here, "Authenticatable" describes objects
// that support authentication (they have credentials and login/logout
// capability). You will see different naming conventions in different
// projects.
//
// Inside the curly braces, you describe ONLY the shape — the property
// names and types, and method signatures. Unlike a class definition,
// an interface contains NO values, NO logic, and NO method bodies.
// Methods are declared with their parameter list and return type only
// (no curly braces, no implementation code).
//
// Think of it as a blueprint for a blueprint: a class is a blueprint
// for objects, and an interface is a blueprint for what a class (or
// object) must look like — without dictating HOW it works internally.
interface Authenticatable {
  email: string;
  password: string;

  // Method signatures only — no curly braces, no logic.
  // These declare that any object matching this interface must have
  // login and logout methods that take no parameters and return nothing.
  login(): void;
  logout(): void;
}

// =====================================================================
// USING AN INTERFACE AS AN OBJECT TYPE
// =====================================================================
//
// One common way to use an interface is as a type annotation — exactly
// like you would use a type alias. Declaring a variable as type
// Authenticatable means the value assigned to it must be an object
// that has ALL the properties and methods the interface describes.
//
// When you create the actual object, you DO add the concrete logic
// inside the method bodies (curly braces, implementation code). The
// interface only described the shape — the object provides the reality.
let user: Authenticatable;

user = {
  email: 'test@example.com',
  password: 'abc1',
  // Here, unlike in the interface definition, the methods have bodies
  // with actual logic — because this is a concrete object value, not
  // a type description.
  login() {
    // reach out to a database, check credentials, create a session
  },
  logout() {
    // clear the session
  },
};
