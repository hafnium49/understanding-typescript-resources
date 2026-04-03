// ADVANCED CLASS FEATURES — see basics.ts for class fundamentals
// (class creation, properties, constructor, parameter properties,
// access modifiers: public, private, protected, readonly).

// This User class demonstrates getters, setters, and static members.
// The properties use an underscore prefix (_firstName, _lastName) —
// a common convention indicating they are intended for internal use
// and should be accessed via getters/setters rather than directly.
class User {
  // "protected" — accessible inside this class AND in subclasses
  // (see the Employee class below for an example).
  protected _firstName: string = '';
  // "private" — accessible ONLY inside this class.
  private _lastName: string = '';

  // SETTERS — intercept assignment to run logic before storing a value.
  //
  // A setter is created with the "set" keyword followed by a property
  // name. It is DEFINED like a method but USED like a property — you
  // assign to it with "=" (no parentheses), just like a regular property:
  //   user.firstName = 'Max';    ← correct (triggers the setter)
  //   user.firstName('Max');     ← wrong (setters are not called like methods)
  //
  // A setter must accept exactly ONE parameter — the value being assigned.
  // Inside the setter body, you can validate, transform, or reject the
  // value before storing it in the actual backing property.
  //
  // NAME CLASH AVOIDANCE: The setter is named "firstName" but the
  // backing property is "_firstName" (with underscore). If both had the
  // same name, assigning inside the setter would trigger the setter
  // again, creating an infinite loop. The underscore prefix convention
  // keeps the public-facing name clean while avoiding this conflict.
  //
  // VALIDATION EXAMPLE: Here the setter trims whitespace and rejects
  // empty strings by throwing an Error — a built-in JavaScript class
  // for signaling problems. This means invalid data never reaches the
  // backing property. Without a setter, any string (including empty)
  // could be assigned directly to the property.
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

  // GETTERS — computed properties accessed like regular properties.
  //
  // A getter is created with the "get" keyword followed by a property
  // name and parentheses (like a method). Inside, you MUST return a
  // value — this is the value that will be produced when the property
  // is accessed.
  //
  // KEY DISTINCTION: Even though a getter is DEFINED like a method
  // (with parentheses and a body), it is USED like a property — you
  // access it with dot notation WITHOUT parentheses:
  //   user.fullName     ← correct (property access)
  //   user.fullName()   ← wrong (would be a method call)
  //
  // Getters are useful for deriving values on the fly from private
  // or protected properties that should not be exposed directly.
  // Here, _firstName and _lastName are private/protected, but
  // fullName combines them into a public, read-only computed value.
  get fullName() {
    return this._firstName + ' ' + this._lastName;
  }

  // ===================================================================
  // STATIC PROPERTIES & METHODS — belong to the class, not instances.
  // ===================================================================
  //
  // Regular properties and methods belong to individual INSTANCES —
  // each object created with "new User()" gets its own copy, and you
  // access them via the instance (e.g., max.firstName).
  //
  // STATIC properties and methods belong to the CLASS ITSELF. They
  // are accessed directly on the class name (e.g., User.eid) WITHOUT
  // creating an instance first. You cannot access them on instances,
  // and they cannot access instance-specific data like firstName or
  // lastName (because no instance exists in that context).
  //
  // Use cases: utility methods that don't need instance data, shared
  // constants, factory functions, or grouping related helpers under
  // a class name (utility classes).
  static eid = 'USER';

  static greet() {
    console.log('Hello!');
  }
}

// Static members are accessed on the class name — no "new" keyword,
// no instance needed. This works even before any instance is created.
console.log(User.eid);
User.greet();

// No constructor arguments — this class uses setters instead.
// Properties start with their default empty string values and are
// set individually afterward.
const max = new User();

// Using the setter — looks like a normal property assignment, but
// behind the scenes the "set firstName" method runs, validates the
// input, and stores it in _firstName.
max.firstName = 'Max';

// This assignment triggers the lastName setter. Because an empty
// string fails the trim() check, the setter throws an Error at
// runtime: "Invalid name." This demonstrates the setter's value —
// it prevents invalid data from ever reaching the backing property.
max.lastName = '';

// max._firstName = 'Max 2';  // COMPILE ERROR: _firstName is protected

// Accessing the getter — no parentheses, just dot notation like a
// regular property. The value is computed on the fly each time.
console.log(max.fullName);

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
