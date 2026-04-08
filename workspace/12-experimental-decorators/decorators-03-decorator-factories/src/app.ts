// =====================================================================
// DECORATOR FACTORIES — configuring decorators with arguments.
// =====================================================================
//
// In the previous lesson, Logger was a decorator function applied
// directly with @Logger (no parentheses). That works, but it gives no
// way to pass values into the decorator at the point where you attach
// it. A DECORATOR FACTORY solves this.
//
// A decorator factory is a function that RETURNS a decorator function.
// You call the factory (with parentheses) at the application site, and
// the value it returns is the actual decorator that gets attached. This
// indirection lets you parameterize the decorator's behavior — the
// arguments you pass to the factory are captured in a closure and used
// by the inner decorator function when it eventually runs.
//
// MENTAL MODEL:
//   Plain decorator:        @Logger             ← function reference
//   Decorator factory call: @Logger('TEXT')     ← function CALL whose
//                                                 return value is the
//                                                 actual decorator
//
// The outer function (Logger here) accepts whatever configuration values
// you want — strings, numbers, multiple parameters, etc. The inner
// returned function has the standard decorator signature (for a class
// decorator, that means it takes the constructor as its single argument).
function Logger(logString: string) {
  // The returned anonymous function is the REAL decorator. It closes
  // over "logString", so when the decorator runs at class definition
  // time, it has access to whatever was passed to the factory call.
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

// APPLYING A DECORATOR FACTORY:
//
// Note the parentheses after Logger — unlike @Logger from the previous
// lesson, this is now a function CALL. The call executes immediately,
// runs the outer function body, and yields the inner function. That
// inner function is what TypeScript actually attaches as the decorator.
//
// The string 'LOGGING - PERSON' is captured in the inner function's
// closure and printed when the decorator runs (still at class
// definition time, not at instantiation time).
@Logger('LOGGING - PERSON')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);
