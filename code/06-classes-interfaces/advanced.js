"use strict";
// ADVANCED CLASS FEATURES — see basics.ts for class fundamentals
// (class creation, properties, constructor, parameter properties,
// access modifiers: public, private, protected, readonly).
// =====================================================================
// GETTERS — computed properties accessed like regular properties.
// =====================================================================
//
// This User class has two private properties created via the parameter
// property shortcut in the constructor. Since both are private, they
// cannot be read or written from outside the class.
//
// But what if you want to expose a COMBINED value — like a full name
// built from first and last name — without exposing the individual
// private properties? That is what a getter is for.
class User {
    firstName;
    lastName;
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    // A getter is created with the "get" keyword followed by a property
    // name and parentheses (like a method). Inside, you MUST return a
    // value — this is the value produced when the property is accessed.
    //
    // KEY DISTINCTION: Even though a getter is DEFINED like a method
    // (with parentheses and a body), it is USED like a property — you
    // access it with dot notation WITHOUT parentheses:
    //   max.fullName     ← correct (property access)
    //   max.fullName()   ← wrong (would be a method call)
    //
    // No "private" keyword in front of the getter, so it is public —
    // accessible from outside the class. This is how you expose a
    // computed value while keeping the raw data private.
    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}
// Instantiation — passing values to the constructor's private parameters.
const max = new User('Max', 'Schwarzmuller');
// Private properties cannot be accessed from outside the class:
// console.log(max.firstName);  // COMPILE ERROR: firstName is private
// console.log(max.lastName);   // COMPILE ERROR: lastName is private
// But the public getter CAN be accessed — no parentheses, just dot
// notation like a regular property. The value is computed on the fly.
console.log(max.fullName); // "Max Schwarzmuller"
