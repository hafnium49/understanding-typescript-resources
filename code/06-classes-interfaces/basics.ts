// CLASSES & INTERFACES — section overview.
//
// This section covers two related but distinct concepts:
//
// 1. CLASSES — a standard JavaScript feature (introduced in ES6) for
//    creating objects with shared structure and behavior. TypeScript
//    ENHANCES classes with extra features like access modifiers
//    (public, private, protected), parameter properties, abstract
//    classes, and stronger type checking.
//
// 2. INTERFACES — a TypeScript-EXCLUSIVE feature (no JavaScript
//    equivalent). Interfaces define a contract: a shape that objects
//    or classes must conform to. They are used in conjunction with
//    classes but can also type plain objects and function parameters.
//    Interfaces exist only at compile time — they produce no JavaScript
//    output at all.
//
// WHAT ARE CLASSES?
//
// Classes are BLUEPRINTS for objects. You define a class once — its
// properties (data) and methods (behavior) — and then create multiple
// INSTANCES (individual objects) from that single definition. Each
// instance has the same shape and methods but holds its own data.
//
// For more on vanilla JavaScript classes:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

// =====================================================================
// CREATING A CLASS — the "class" keyword followed by a name.
// =====================================================================
//
// Convention: class names start with an uppercase character (e.g., User).
// Inside the curly braces, you define PROPERTIES (fields) and METHODS.
//
// PROPERTIES IN TYPESCRIPT vs. VANILLA JAVASCRIPT:
//
// In vanilla JavaScript, properties are typically created inside the
// constructor using "this.name = value". In TypeScript, properties must
// be DECLARED directly in the class body with their types — outside of
// the constructor. This is one of the key differences TypeScript
// introduces for classes.
//
// Properties can be initialized with a default value. If left
// uninitialized, they must receive a value in the constructor —
// otherwise TypeScript flags an error under strict mode
// (strictPropertyInitialization).
//
// THE CONSTRUCTOR:
//
// A special method called automatically when you create an instance
// with "new ClassName(...)". It receives arguments and can assign them
// to properties using "this.propertyName = value". The parameter names
// do not need to match the property names — below, "n" and "a" are
// used as parameter names while the properties are "name" and "age".

// (Named "BasicUser" here to avoid conflict with the User class in
// advanced.ts — in the course, both files use "User" but are compiled
// together via tsconfig, so names must be unique.)
class BasicUser {
  // Property declarations with types — required in TypeScript.
  // These tell TypeScript that every BasicUser instance will have
  // a "name" of type string and an "age" of type number.
  //
  // ACCESS LEVEL: Properties declared without a keyword are "public"
  // by default — they can be read and written from anywhere outside
  // the class (e.g., basicMax.name = 'Anna' would work).
  //
  // TypeScript also supports "private" and "protected" keywords that
  // restrict access, but those will be covered in a later lesson.
  // For now, just know that omitting the keyword means "public".
  name: string;
  age: number;

  // The constructor receives values and assigns them to the properties.
  // "n" maps to this.name, "a" maps to this.age — the names do not
  // need to match, but the types must be compatible.
  constructor(n: string, a: number) {
    this.name = n;
    this.age = a;
  }
}

// INSTANTIATION — creating objects from the class blueprint.
//
// Use "new ClassName(...)" to create an instance. The arguments are
// passed to the constructor, which assigns them to the declared
// properties via "this.propertyName = value".
//
// Each instance is an independent object with its own data.
const basicMax = new BasicUser('Max', 38);
const basicFred = new BasicUser('Fred', 35);

// Both objects share the same structure (name, age) but hold different
// values — because they were created from the same class blueprint
// with different constructor arguments.
console.log(basicMax);   // BasicUser { name: 'Max', age: 38 }
console.log(basicFred);  // BasicUser { name: 'Fred', age: 35 }

// =====================================================================
// PARAMETER PROPERTIES — a TypeScript shortcut for declaring and
// assigning class properties in one step.
// =====================================================================
//
// The verbose approach above (BasicUser) requires three things per
// property:
//   1. Declare the property in the class body (e.g., name: string;)
//   2. Accept a parameter in the constructor (e.g., n: string)
//   3. Assign the parameter to the property (e.g., this.name = n;)
//
// In vanilla JavaScript, the code is actually shorter because step 1
// is not required — you can create properties on the fly in the
// constructor. So TypeScript's stricter approach would make classes
// MORE verbose, not less.
//
// To solve this, TypeScript offers a shortcut: add the "public" keyword
// in front of a constructor parameter, and TypeScript will automatically:
//   - Create a property of the SAME NAME in the class
//   - Assign the incoming argument to that property
//
// The constructor body can be completely empty. This is a TypeScript-
// EXCLUSIVE shortcut — vanilla JavaScript does not have this syntax.
//
// NOTE: "public" here is used purely to trigger the shortcut. The
// meaning of "public" (and alternatives like "private") will be
// explained in a later lesson. For now, just know that adding it
// before a constructor parameter activates this automatic property
// creation and assignment behavior.
//
// Since the constructor is still a function, all function features
// apply: you can make parameters optional with "?", set default
// values, etc. — just as you learned with regular functions.

class ConciseUser {
  // No property declarations needed — "public" on the constructor
  // parameters creates and assigns them automatically.
  // The resulting properties have the same "public" access level as
  // the BasicUser properties above (which are public by default).
  constructor(public name: string, public age: number) {}
}

// The result is identical: ConciseUser instances have name and age
// properties, just like BasicUser — but with far less boilerplate.
const conciseMax = new ConciseUser('Max', 38);
const conciseFred = new ConciseUser('Fred', 35);

console.log(conciseMax);   // ConciseUser { name: 'Max', age: 38 }
console.log(conciseFred);  // ConciseUser { name: 'Fred', age: 35 }
