function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function<T extends { new (...args: any[]): {name: string} }>(
    originalConstructor: T
  ) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
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

const pers = new Person();

console.log(pers);

// ---

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

// =====================================================================
// LESSON 156: AUTOBIND — a real-world method decorator.
// =====================================================================
//
// This is the concrete example promised in the previous lesson:
// a method decorator that RETURNS a new PropertyDescriptor to modify
// the method's behavior.
//
// THE PROBLEM IT SOLVES — `this` loss in event handlers.
//
// When you pass a class method directly to addEventListener, the
// browser calls that method with `this` bound to the EVENT TARGET (the
// button in this case), not to the class instance that owns the method.
// Inside showMessage, `this.message` would then look up `message` on
// the button element — which does not exist — and log `undefined`.
//
// THE OLD WORKAROUND — manual .bind().
//
// The standard JavaScript fix is:
//   button.addEventListener('click', p.showMessage.bind(p));
// The `.bind(p)` call produces a new function whose `this` is
// permanently fixed to `p`, regardless of how it is later invoked.
// This works but is tedious — every caller must remember to call bind.
//
// THE DECORATOR SOLUTION — bind once at class-definition time.
//
// By attaching @Autobind to a method, we make binding automatic: no
// matter who retrieves the method or how they call it, `this` will
// always refer to the instance the method belongs to. The trick is
// to replace the method's descriptor with one that uses a GETTER
// instead of a plain value. Every time someone accesses the property,
// the getter runs, and it returns a FRESHLY BOUND version of the
// original method — bound to the object that triggered the getter.
//
// WHY A GETTER FIXES THE `this` PROBLEM:
//
// When `addEventListener` is given `p.showMessage`, JavaScript first
// has to READ the `showMessage` property off `p`. That property read
// triggers the getter we defined. Inside the getter, `this` refers to
// the object the getter is being called on — which is `p`, because
// that is what appears to the left of the dot. The getter binds the
// original method to that `this` and returns the bound function.
// addEventListener then stores the bound function (not the original),
// so when the click fires, `this` inside showMessage is already fixed
// to `p`. The getter acts as an interception layer between the event
// listener and the original function.
//
// DESCRIPTOR FIELDS USED:
//   - configurable: true  → allow further modification / deletion
//   - enumerable: false   → hide from for...in loops (methods are
//                           conventionally non-enumerable)
//   - get()               → accessor that returns the bound method
//
// Note: there is no `value` field — adding one would conflict with
// `get`, because a descriptor is either a data descriptor (value +
// writable) or an accessor descriptor (get + set), never both.
//
// The first two parameters are unused, so they are named with leading
// underscores. TypeScript's noUnusedParameters rule accepts this as
// intentional "I know I get this, I just don't need it".
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  // Pull out the original method from the existing descriptor. A
  // method's descriptor is a data descriptor whose `value` holds the
  // function itself.
  const originalMethod = descriptor.value;

  // Build the replacement descriptor. Because we return it from the
  // decorator, TypeScript uses it to override the existing descriptor
  // on the class prototype.
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    // The getter runs every time the property is ACCESSED (e.g., when
    // addEventListener reads `p.showMessage`). Inside the getter, `this`
    // refers to the object the access was made on — `p` in our case.
    get() {
      // bind returns a new function with `this` permanently set to
      // whatever was passed in. Here we pass the getter's `this`,
      // which is the owning instance. Every property access creates
      // a fresh bound function — a small cost for correct behavior.
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

// A tiny class to demonstrate the effect. Without @Autobind, clicking
// the button would log `undefined` because `this.message` inside the
// click handler would look up `message` on the <button> element.
class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
// Direct calls already have the correct `this` (the method is being
// called on `p` via the dot notation), so this line works with or
// without the decorator. It is included to confirm that @Autobind
// does not break the normal calling convention.
p.showMessage();

// The non-null assertion (!) tells TypeScript the button exists in
// the DOM — index.html contains <button>Click me</button>.
const button = document.querySelector('button')!;
// This is the line that fails WITHOUT @Autobind. addEventListener
// stores whatever function-like value it receives and calls it later
// with `this` bound to the button. Because @Autobind replaced the
// method with an accessor, reading `p.showMessage` here runs the
// getter, which returns a pre-bound function. addEventListener stores
// the pre-bound function, and the click handler correctly logs the
// message. Remove @Autobind (or remove the .bind(this) inside the
// getter) and the click output becomes `undefined`.
button.addEventListener('click', p.showMessage);