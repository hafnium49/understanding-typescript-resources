// (Logger, WithTemplate, Person, and the Log property decorator from
// earlier lessons — kept here for context.)
function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function(constructor: any) {
    console.log('Rendering template');
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}

// @Logger('LOGGING - PERSON')
@Logger('LOGGING')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);

// ---

// Property decorator from the previous lesson — reference in the
// Product class below. Two arguments: (target, propertyName).
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

// =====================================================================
// ACCESSOR, METHOD, AND PARAMETER DECORATORS.
// =====================================================================
//
// With property decorators covered, three more positions remain.
// Accessors, methods, and parameters each accept a decorator with a
// slightly different signature. The first argument (target) is always
// the same pattern — the prototype for instance members, the
// constructor function for static members. What differs is the second
// and third arguments.

// ACCESSOR DECORATOR — attached to a getter or setter.
//
// Signature: (target, name, descriptor: PropertyDescriptor)
//
// The third argument is a PROPERTY DESCRIPTOR — a built-in TypeScript
// type representing the low-level JavaScript descriptor object. For an
// accessor it exposes fields like `get`, `set`, `enumerable`, and
// `configurable`. In this example, only a setter is defined on "price"
// so the `set` field will be populated and `get` will be undefined.
// The name printed is the ACCESSOR name ("price"), not the backing
// private field ("_price") — those are two separate things.
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// METHOD DECORATOR — attached to a class method.
//
// Signature: (target, name, descriptor: PropertyDescriptor)
//
// The shape is identical to the accessor decorator, so in theory one
// function could be reused for both — they are written separately here
// purely to produce clearer log output. The difference shows up in the
// DESCRIPTOR contents: method descriptors expose `value` (the function
// itself) and `writable` instead of `get`/`set`. That is a plain
// JavaScript distinction, not a TypeScript one.
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// PARAMETER DECORATOR — attached to a specific parameter of a method.
//
// Signature: (target, name, position: number)
//
// This is the odd one out. The three arguments are:
//   - target: the prototype (instance) or constructor (static), same
//     as every other decorator type
//   - name: surprisingly, the name of the METHOD the parameter belongs
//     to, NOT the parameter itself. There is no way to read the
//     parameter name from the decorator.
//   - position: the ZERO-BASED INDEX of the parameter within the
//     method's parameter list. The first parameter is 0, the second
//     is 1, and so on.
//
// Each parameter can carry its own decorator independently — you are
// not forced to decorate all of them or even adjacent ones.
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

// Product now demonstrates all four non-class decorator positions at
// once. Every @LogN executes at class-definition time (before any
// Product instance is created), not on method invocation.
class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  // @Log3 decorates the method as a whole, @Log4 decorates the "tax"
  // parameter specifically. Note that the parameter decorator is
  // placed INSIDE the parameter list, not above the method — a
  // syntactic detail unique to parameter decorators.
  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

// Instantiating Product does NOT re-run any of the decorators above.
// They already ran once, when the class definition was processed.
// Creating instances is a separate runtime activity that only triggers
// the constructor.
const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 29);
