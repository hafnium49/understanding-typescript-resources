"use strict";
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
    // WHY "protected" AND NOT "private" OR "public"?
    //
    // The Employee subclass needs to access _firstName in its work()
    // method. Three access levels were considered:
    //
    //   private    → FAILS: Employee cannot access _firstName at all.
    //                Even "super._firstName" does not work — private
    //                restricts to the defining class only.
    //   public     → WORKS but too permissive: _firstName becomes
    //                accessible from outside the class (e.g.,
    //                max._firstName = 'anything'), bypassing the setter
    //                validation — defeating its purpose.
    //   protected  → WORKS correctly: subclasses like Employee CAN
    //                access it via "this._firstName", but outside code
    //                CANNOT. This is the sweet spot for properties that
    //                need to be shared with child classes but hidden
    //                from external code.
    _firstName = '';
    _lastName = '';
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
    set firstName(name) {
        if (name.trim() === '') {
            throw new Error('Invalid name.');
        }
        this._firstName = name;
    }
    set lastName(name) {
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
    jobTitle;
    // "public jobTitle" uses the parameter property shortcut to create
    // a new property unique to Employee — not inherited from User.
    constructor(jobTitle) {
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
        this.jobTitle = jobTitle;
        // The "super" keyword can also be used as an object reference to
        // access parent class members from inside the child class:
        // super.firstName = 'Max';  // would trigger User's firstName setter
    }
    work() {
        // PROTECTED IN ACTION: this._firstName works here because
        // _firstName is "protected" on User — accessible in subclasses.
        // If it were "private", this line would produce a compile error.
        // If it were "public", it would work here BUT also from outside
        // the class, which is undesirable.
        console.log(this._firstName);
    }
}
// Protected property — NOT accessible from outside the class:
// max._firstName = 'Max 2';  // COMPILE ERROR: _firstName is protected
// =====================================================================
// ABSTRACT CLASSES — base classes that cannot be instantiated directly.
// =====================================================================
//
// The "abstract" keyword marks a class as a BASE-ONLY class. You cannot
// create instances of an abstract class with "new" — it exists solely
// to be extended by other classes that inherit its properties and methods.
//
// This is useful when you have a generic concept (like a UI element)
// that should never exist on its own, but should serve as a foundation
// for more specialized classes (like a side drawer, a login form, tabs).
//
// TYPESCRIPT-EXCLUSIVE: The "abstract" keyword does not exist in vanilla
// JavaScript. It is stripped from the compiled output — it serves purely
// as a compile-time constraint enforced by TypeScript.
class UIElement {
    identifier;
    // The constructor and methods work exactly like a regular class.
    // The only difference is that "new UIElement(...)" is forbidden.
    constructor(identifier) {
        this.identifier = identifier;
    }
    clone(targetLocation) {
        // logic to duplicate the UI element
    }
}
// COMPILE ERROR if uncommented: cannot create an instance of an abstract
// class. Abstract classes are meant to be extended, not used directly.
// let uiElement = new UIElement('main-element');
// A concrete (non-abstract) class that EXTENDS the abstract base class.
// SideDrawerElement inherits everything from UIElement (identifier
// property, clone method) and adds its own position property.
class SideDrawerElement extends UIElement {
    identifier;
    position;
    // The constructor accepts identifier (needed by the base class) and
    // position (new to this subclass). Both use the parameter property
    // shortcut.
    constructor(identifier, position) {
        // super(identifier) forwards the identifier to UIElement's
        // constructor. This is required because the base class constructor
        // expects one argument. Unlike the Employee example above (where
        // User had no custom constructor), here we MUST pass a value.
        super(identifier);
        this.identifier = identifier;
        this.position = position;
    }
}
