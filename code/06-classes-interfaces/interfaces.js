"use strict";
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
// =====================================================================
// USING AN INTERFACE AS AN OBJECT TYPE
// =====================================================================
//
// One common way to use an interface is as a type annotation — exactly
// like you would use a type alias. Declaring a variable as type
// Authenticatable means the value assigned to it must be an object
// that has ALL the properties and methods the interface describes.
//
// When you create the actual object, you DO add the concrete logic
// inside the method bodies (curly braces, implementation code). The
// interface only described the shape — the object provides the reality.
let user;
user = {
    email: 'test@example.com',
    password: 'abc1',
    // Here, unlike in the interface definition, the methods have bodies
    // with actual logic — because this is a concrete object value, not
    // a type description.
    login() {
        // reach out to a database, check credentials, create a session
    },
    logout() {
        // clear the session
    },
};
let sum;
sum = (a, b) => a + b;
// =====================================================================
// IMPLEMENTING AN INTERFACE — using interfaces as class contracts.
// =====================================================================
//
// The "implements" keyword forces a class to provide ALL properties
// and methods declared in the interface. If any are missing or have
// the wrong type, TypeScript produces a compile error.
//
// This is useful in larger projects or when building libraries — it
// guarantees that a class has a certain minimal shape, regardless of
// who writes the class. The class CAN have more properties and methods
// than the interface requires (like userName below), but it MUST have
// at least everything the interface defines.
//
// You can implement multiple interfaces on a single class by separating
// them with commas: class Foo implements InterfaceA, InterfaceB { ... }
//
// "implements" is a TypeScript-exclusive keyword — it does not exist
// in vanilla JavaScript.
class AuthenticatableUser {
    userName;
    email;
    password;
    // The constructor provides the required email and password properties
    // (from the interface) plus an extra userName property (not required
    // by the interface, but allowed — a class can exceed the contract).
    constructor(userName, email, password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
    }
    // Concrete implementations of the methods declared in the interface.
    // The interface only defined the signatures (no logic); here the class
    // provides the actual behavior.
    login() {
        // ...
    }
    logout() {
        // ...
    }
}
// =====================================================================
// INTERFACES AS PARAMETER TYPES — guaranteeing object shape in functions.
// =====================================================================
//
// One of the most practical uses of interfaces is as parameter types
// on functions. When a function expects an object with a certain shape,
// using an interface as the parameter type guarantees that any caller
// must pass an object that satisfies the full interface contract.
//
// This is more robust than defining an inline object type (e.g.,
// { login(): void }) because the interface may have many properties
// and methods — and the function is guaranteed to receive ALL of them,
// not just the one or two it happens to use internally.
//
// Any object that implements the Authenticatable interface (whether
// via "implements" on a class or by manually matching the shape) is
// accepted as a valid argument.
function authenticate(user) {
    user.login();
}
