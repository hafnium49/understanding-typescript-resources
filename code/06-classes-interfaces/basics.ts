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
