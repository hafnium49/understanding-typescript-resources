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
