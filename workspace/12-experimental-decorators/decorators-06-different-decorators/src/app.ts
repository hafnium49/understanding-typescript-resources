// (Logger, WithTemplate, and Person from earlier lessons — kept here so
// the file still demonstrates a class decorator alongside the property
// decorator below. See decorators-02 through decorators-05 for context.)
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

// =====================================================================
// PROPERTY DECORATORS — decorators applied to class fields.
// =====================================================================
//
// Decorators are not limited to classes. They can also be attached to
// individual class members: properties, accessors (getters/setters),
// methods, and even individual function parameters. The "@" syntax is
// the same in every case, but the decorator's SIGNATURE — the arguments
// it receives — changes depending on WHERE you place it. The location
// dictates the shape, so a decorator written for one position cannot be
// reused at a different position without adjustment.
//
// PROPERTY DECORATOR SIGNATURE:
//
//   (target, propertyName) => void
//
//   - target: For an INSTANCE property (one that lives on objects
//     created with "new"), this is the prototype of that object.
//     For a STATIC property, target would be the constructor function
//     itself. Because the structure varies and is hard to type
//     precisely, "any" is the pragmatic choice here.
//   - propertyName: the name of the property the decorator is attached
//     to. It is typed as "string | Symbol" because property keys in
//     JavaScript can be either strings or symbols.
//
// A property decorator does NOT receive the property's value — only
// metadata about its location. There is also no PropertyDescriptor
// for properties (unlike accessors and methods, where one is
// available — that comes in a later lesson).
//
// EXECUTION TIMING: Just like class decorators, property decorators
// run when the class definition is processed by JavaScript — not when
// an instance is created. You will see the property decorator log
// even though no Product is instantiated below.
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

// The Product class showcases all the places where decorators can be
// attached. In this lesson only the @Log property decorator is wired
// up — the setter, method, and parameter all exist as targets for
// decorators that will be added in later lessons.
class Product {
  // The @Log decorator is attached directly above the property it
  // decorates. When this class definition is processed, Log runs once
  // and reports the prototype object plus the string 'title'.
  @Log
  title: string;

  // _price uses the underscore convention to signal it should not be
  // accessed directly from outside the class. The "private" keyword
  // enforces that at compile time. Outside code is expected to go
  // through the setter below to assign a price.
  private _price: number;

  // A SETTER lets external code use assignment syntax (instance.price = N)
  // while still funneling the assignment through validation logic. Here,
  // negative or zero prices are rejected via a thrown error.
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

  // A regular method that uses _price internally to compute a
  // tax-adjusted total. The @Log decorator above title does not
  // affect this method — different positions need their own
  // (later) decorator functions.
  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
