// ADVANCED CLASS FEATURES — see basics.ts for class fundamentals
// (class creation, properties, constructor, parameter properties,
// access modifiers: public, private, protected, readonly).

// This User class demonstrates getters, setters, and static members.
// The properties use an underscore prefix (_firstName, _lastName) —
// a common convention indicating they are intended for internal use
// and should be accessed via getters/setters rather than directly.
class User {
  // WHY "protected" AND NOT "private" OR "public"?
  //
  // The Employee subclass below needs to access _firstName in its
  // work() method. Three access levels were considered:
  //
  //   private    → FAILS: Employee cannot access _firstName at all.
  //                "private" restricts to the defining class only.
  //   public     → WORKS but too permissive: _firstName becomes
  //                accessible from outside the class (e.g.,
  //                max._firstName = 'anything'), bypassing the setter
  //                validation — defeating its purpose.
  //   protected  → WORKS correctly: subclasses like Employee CAN
  //                access it, but outside code CANNOT. This is the
  //                sweet spot for properties that need to be shared
  //                with child classes but hidden from external code.
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

// =====================================================================
// INHERITANCE — building on an existing class with "extends".
// =====================================================================
//
// The "extends" keyword creates a CHILD class that inherits ALL
// properties and methods from a PARENT (base) class. The child can
// then add its own properties and methods, or override inherited ones.
// This is a standard JavaScript feature — not TypeScript-specific.
//
// Employee extends User, so every Employee automatically has everything
// User has: _firstName, _lastName, the firstName/lastName setters,
// the fullName getter, and the static eid and greet(). On top of that,
// Employee adds its own jobTitle property and work() method.
class Employee extends User {
  // "public jobTitle" uses the parameter property shortcut to create
  // a new property unique to Employee — not inherited from User.
  constructor(public jobTitle: string) {
    // SUPER() — required in any child class constructor.
    //
    // When a child class defines a constructor, it MUST call super()
    // to invoke the parent class's constructor. This ensures the
    // parent's initialization logic runs before the child adds its own.
    //
    // If the parent constructor accepted parameters, you would pass
    // them here as arguments: super(param1, param2). In this case,
    // User has no custom constructor, so super() takes no arguments.
    super();

    // The "super" keyword can also be used as an object reference to
    // access parent class members from inside the child class:
    // super.firstName = 'Max';  // would trigger User's setter
  }

  work() {
    // PROTECTED IN ACTION: _firstName was declared "protected" on User,
    // which means it is accessible here in Employee (a subclass) via
    // "this._firstName". If it were "private" instead of "protected",
    // this line would produce a compile error — private properties are
    // restricted to the class where they are defined, not even
    // subclasses can access them. This is the key difference between
    // private and protected.
    console.log(this._firstName);
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
