// (Logger from earlier lessons — unchanged. A class decorator CAN also
// return a replacement, but this one does not — it just logs.)
function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

// =====================================================================
// LESSON 154: RETURNING VALUES FROM DECORATORS.
// =====================================================================
//
// Some decorator positions allow the decorator function itself to
// RETURN a value — and TypeScript will then use that return value to
// replace (or augment) the thing the decorator was attached to. Note:
// this is NOT the same as a decorator factory returning a decorator
// function. The "inner" decorator itself is the one returning.
//
// Which return values are meaningful depends on the position:
//   - Class decorator:    can return a new constructor function (or
//                         a class, which is the same thing) that
//                         REPLACES the original class.
//   - Method decorator:   can return a new PropertyDescriptor that
//                         replaces the method's descriptor (covered
//                         in the next lesson).
//   - Accessor decorator: can return a new PropertyDescriptor, same
//                         pattern as method decorators.
//   - Property decorator: return value is ignored.
//   - Parameter decorator: return value is ignored.
//
// WHY THIS IS POWERFUL:
//
// A class decorator that returns a replacement constructor lets you
// inject logic that runs at INSTANTIATION time rather than only at
// class-definition time. The previous version of WithTemplate rendered
// the template immediately when the class was defined — even if no
// Person was ever created. The new version below defers the rendering
// into the constructor of a REPLACEMENT class that extends the
// original. That rendering now only happens when the developer
// actually creates an instance with `new`.
//
// GENERIC CONSTRAINT — WHY THE SCARY SIGNATURE:
//
// The inner function is a generic function parameterized over T,
// constrained to shapes that can be constructed:
//
//   <T extends { new (...args: any[]): { name: string } }>
//
// Reading this left to right:
//   - `T extends { ... }`   — T must satisfy the shape on the right
//   - `new (...args: any[])` — T must be "newable" (a constructor
//                              signature); rest args accept anything
//   - `: { name: string }`   — instances produced by that constructor
//                              must have a `name: string` property
//
// This constraint is what allows `this.name` to typecheck inside the
// replacement class below. Without the `{ name: string }` part,
// TypeScript would not know the instance has a name property and
// would flag the access as an error. It also means this decorator
// can only be attached to classes that produce objects with a `name`
// — attaching it to a class without `name` produces a compile error.
function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  // T is the type of the original constructor; returning a class that
  // `extends originalConstructor` preserves all properties and methods
  // from the decorated class while letting us add new behavior on top.
  return function<T extends { new (...args: any[]): {name: string} }>(
    originalConstructor: T
  ) {
    // Returning an anonymous class — syntactic sugar for returning a
    // constructor function. This replacement class inherits everything
    // from the original (via extends), then overrides its constructor
    // to insert extra logic.
    return class extends originalConstructor {
      // `..._` is a rest parameter named "_" to signal "I know I get
      // arguments, but I don't use them" — TypeScript's noUnusedParameters
      // rule accepts underscore-prefixed names as intentional. The rest
      // signature `...args: any[]` matches the generic constraint above,
      // so the replacement constructor is compatible with any arguments
      // the original constructor accepts.
      constructor(..._: any[]) {
        // super() runs the ORIGINAL constructor, so the decorated
        // class's initialization logic still executes. Without this,
        // properties like `name` would never be assigned.
        super();
        // This rendering now runs per INSTANCE — not at class
        // definition. Creating a new Person triggers the constructor,
        // which triggers this block. Removing `new Person()` below
        // means the template never renders, proving the decorator's
        // rendering is now deferred.
        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          // `this.name` is safe because the generic constraint
          // guarantees the instance has a `name: string` property.
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
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

// Instantiation is now REQUIRED for the template to render. With the
// new WithTemplate, the rendering logic lives inside the replacement
// constructor — commenting this line out would leave the hook element
// empty even though the decorator factory and the inner decorator
// still both run at class definition.
const pers = new Person();

console.log(pers);

// ---

// (Log, Log2, Log3, Log4 and the Product class from lesson 152.
// Included for context; none of these return replacement values in
// this lesson — that pattern for methods/accessors comes next.)
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

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

function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

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

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 29);
