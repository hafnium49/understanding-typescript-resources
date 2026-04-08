// =====================================================================
// FIRST CLASS DECORATOR — what a decorator actually is.
// =====================================================================
//
// A DECORATOR is, at its core, just a regular JavaScript function. The
// only special thing is HOW you apply it: instead of calling it
// directly with parentheses, you attach it to a class (or class member)
// using the "@" syntax. The decorator is then automatically invoked by
// TypeScript/JavaScript at a specific point in the program lifecycle.
//
// Decorators always operate on classes — even when applied to a method
// or property, they ultimately work with the class that owns it. The
// decorator below is a CLASS DECORATOR: it is attached to a class as
// a whole and receives the class's constructor function as its argument.
//
// PREREQUISITE: Before any of this works, the tsconfig.json must have
// "experimentalDecorators": true. Without that flag, TypeScript refuses
// to recognize the "@" syntax. The "target" must also be "es6" or higher
// because decorators rely on ES6+ class syntax under the hood.

// NAMING CONVENTION: Decorator functions are typically named with an
// uppercase first character (Logger, not logger). This is a community
// convention — not a technical requirement. It mirrors what most
// libraries do, so following it makes your code feel familiar.
//
// CLASS DECORATOR SIGNATURE: A decorator applied to a class receives
// ONE argument — the class's CONSTRUCTOR function. Internally, a class
// in JavaScript is just syntactic sugar over a constructor function,
// so "constructor: Function" captures the underlying function reference.
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

// APPLYING A DECORATOR — the "@" symbol followed by the function name.
//
// "@Logger" tells TypeScript: "When this class is defined, run the
// Logger function and pass it the constructor of this class." Note
// that we do NOT call Logger ourselves with parentheses — we point
// at it. TypeScript handles the invocation.
//
// CRITICAL TIMING DETAIL: Class decorators run when the class is
// DEFINED, not when an instance is created. This is the most important
// thing to internalize about decorators. The console output below
// proves it — "Logging..." and the constructor dump appear BEFORE the
// "Creating person object..." message from the constructor itself,
// even though the constructor call (new Person()) comes later in the
// source order. The decorator would still run even if no instance
// were ever created.
@Logger
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

// Instantiation is NOT required for the decorator to fire — it already
// fired when the class definition above was processed. The lines below
// just demonstrate the constructor and the resulting object for context.
const pers = new Person();

console.log(pers);
