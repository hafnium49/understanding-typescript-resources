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
// Example (conceptual):
//
//   class User {
//     name: string;
//     age: number;
//     constructor(name: string, age: number) {
//       this.name = name;
//       this.age = age;
//     }
//     greet() { console.log('Hi, I am ' + this.name); }
//   }
//
//   const max = new User('Max', 38);   // instance 1
//   max.greet();                        // "Hi, I am Max"
//   const fred = new User('Fred', 35); // instance 2
//   fred.greet();                       // "Hi, I am Fred"
//
// Both max and fred share the same structure (name, age, greet) but
// hold different values — because they were created from the same
// class blueprint with different constructor arguments.
//
// For more on vanilla JavaScript classes:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

// CREATING A CLASS — the "class" keyword followed by a name.
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
// Properties can be initialized with a default value (as shown below
// with '' for both fields). If left uninitialized, they must receive
// a value in the constructor — otherwise TypeScript flags an error
// under strict mode (strictPropertyInitialization).
//
// THE CONSTRUCTOR:
//
// A special method called automatically when you create an instance
// with "new User(...)". It receives arguments and can assign them to
// properties using "this.propertyName = value". The parameter names
// do not need to match the property names.
class User {
  protected _firstName: string = '';
  private _lastName: string = '';

  set firstName(name: string) {
    if (name.trim() === '') {
      throw new Error('Invalid name.');
    }
    this._firstName = name;
  }

  set lastName(name: string) {
    if (name.trim() === '') {
      throw new Error('Invalid name.');
    }
    this._lastName = name;
  }

  get fullName() {
    return this._firstName + ' ' + this._lastName;
  }

  static eid = 'USER';

  static greet() {
    console.log('Hello!');
  }
}

console.log(User.eid);
User.greet();

const max = new User();
max.firstName = 'Max';
max.lastName = '';
// max._firstName = 'Max 2';
console.log(max.fullName);

// PARAMETER PROPERTIES — a TypeScript shortcut for declaring and
// assigning class properties in one step.
//
// Without this shortcut, creating a property requires three things:
//   1. Declare the property in the class body (e.g., jobTitle: string;)
//   2. Accept a parameter in the constructor (e.g., jt: string)
//   3. Assign the parameter to the property (e.g., this.jobTitle = jt;)
//
// With parameter properties, adding "public" (or "private", "protected",
// or "readonly") in front of a constructor parameter tells TypeScript to
// automatically: create a property of the same name, AND assign the
// incoming argument to that property. The constructor body can be empty.
//
// This is a TypeScript-EXCLUSIVE shortcut — vanilla JavaScript does not
// have this syntax. It results in more concise code than the equivalent
// vanilla JavaScript class, which always requires manual assignment.
//
// Since the constructor is still a function, all function features apply:
// default values, optional parameters (?), etc.
class Employee extends User {
  constructor(public jobTitle: string) {
    super();
    // super.firstName = 'Max';
  }

  work() {
    // ...
    console.log(this._firstName);
    // super._firstName
  }
}

abstract class UIElement {
  constructor(public identifier: string) {}

  clone(targetLocation: string) {
    // logic to duplicate the UI element
  }
}

// let uiElement = new UIElement();

class SideDrawerElement extends UIElement {
  constructor(public identifier: string, public position: 'left' | 'right') {
    super(identifier);
  }

  // ...
}
