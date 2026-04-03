// ADVANCED CLASS FEATURES — see basics.ts for class fundamentals
// (class creation, properties, constructor, parameter properties,
// access modifiers: public, private, protected, readonly).

// =====================================================================
// SETTERS — intercept assignment to run logic before storing a value.
// =====================================================================
//
// In lesson 73, this User class had a constructor with two private
// parameters (firstName, lastName) and a fullName getter. Now the
// instructor EVOLVES the class: the constructor is removed, properties
// are declared directly in the class body, and SETTERS are added to
// validate input before storing it.
class User {
  // Properties declared directly in the class body, initialized to
  // empty strings (no constructor needed for initialization).
  //
  // NAME CLASH AVOIDANCE: These backing properties use an underscore
  // prefix (_firstName, _lastName). The setters below are named
  // "firstName" and "lastName" (without underscore). If the property
  // and setter shared the same name, assigning inside the setter
  // (this.firstName = name) would trigger the setter again, creating
  // an infinite loop. The underscore convention keeps the public-facing
  // setter name clean while avoiding this conflict.
  _firstName: string = '';
  _lastName: string = '';

  // A setter is created with the "set" keyword followed by a property
  // name. It is DEFINED like a method but USED like a property — you
  // assign to it with "=" (no parentheses), just like a regular property:
  //   max.firstName = 'Max';    ← correct (triggers the setter)
  //   max.firstName('Max');     ← wrong (setters are not called like methods)
  //
  // A setter must accept exactly ONE parameter — the value being assigned.
  // Inside the setter body, you can validate, transform, or reject the
  // value before storing it in the actual backing property.
  //
  // VALIDATION: Here the setter trims whitespace and rejects empty
  // strings by throwing an Error — a built-in JavaScript class for
  // signaling problems. This means invalid data never reaches the
  // backing property. Without a setter, any string (including empty)
  // could be assigned directly.
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

  // GETTER (from lesson 73) — now reads from the renamed backing
  // properties (_firstName, _lastName) instead of the original
  // constructor parameters. The getter itself works exactly the same:
  // defined like a method, used like a property, must return a value.
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

// No constructor arguments — the constructor was removed. Properties
// start with their default empty string values.
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

// Accessing the getter — still works exactly as in lesson 73.
console.log(max.fullName);
