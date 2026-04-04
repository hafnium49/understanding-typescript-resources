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
