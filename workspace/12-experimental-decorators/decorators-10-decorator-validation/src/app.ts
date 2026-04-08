function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function<T extends { new (...args: any[]): { name: string } }>(
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

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
p.showMessage();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);

// ---

// =====================================================================
// LESSON 157: VALIDATION DECORATORS — setting up the example.
// =====================================================================
//
// This lesson sketches a tiny validation framework built from property
// decorators. The motivation is common in real applications: you want
// to enforce rules on a class's data (e.g., "title must not be empty",
// "price must be positive"), and you would like those rules to live
// WITH the class rather than being duplicated at every call site.
//
// Without decorators, every piece of code that creates a Course would
// need to remember to run the same if-checks manually. With decorators,
// the rules are attached declaratively to the class, and a single
// validate() call checks them all at once.
//
// THE API WE WANT:
//   1. @Required and @PositiveNumber attached to class properties
//      register validation rules for those properties.
//   2. A validate(obj) function reads back the registered rules for
//      obj's class and returns true if everything passes, false
//      otherwise.
//   3. Callers use validate() as a gate — if it returns false, they
//      reject the input and alert the user; otherwise they proceed.
//
// IMPLEMENTATION APPROACH (the mental model):
//   The decorators run at class-definition time (per lesson 153), so
//   they cannot check values — no instances exist yet. Instead, they
//   STORE metadata in an external registry: "for this class, the
//   'title' property has a 'required' rule." Later, when validate()
//   runs, it looks up the registered rules for the instance's class
//   and applies them to the instance's actual values.
//
// NOTE: This lesson focuses on the SETUP — the Course class, the form
// wiring, and the stub decorators and validate() function that
// establish the API surface. The storage mechanism that makes
// @Required and @PositiveNumber actually do something is filled in
// by a later lesson. For now, the stubs let the code compile and run
// so you can interact with the form, and validate() simply returns
// true so that the "happy path" still works.

// Stub property decorator — establishes the API shape but does not
// yet register any rules.
function Required(_target: any, _propName: string) {
  // Implementation (storage write) comes in the next lesson.
}

// Stub property decorator for numeric positivity — same story as
// Required.
function PositiveNumber(_target: any, _propName: string) {
  // Implementation (storage write) comes in the next lesson.
}

// Stub validator — always passes. The real version will read the
// registered rules and check them against obj's values.
function validate(_obj: any) {
  return true;
}

// The Course class models the data we want to validate. Deliberately
// written WITHOUT the parameter-property shortcut (public on
// constructor params) so that the properties can carry their own
// decorators — parameter properties have no declaration site for an
// attached decorator.
class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

// A simple form in index.html collects title and price. We grab it
// via querySelector and attach a submit listener that runs whenever
// the user clicks Save.
const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
  // preventDefault stops the browser's default form submission
  // (which would make an HTTP request and reload the page). We want
  // to handle everything client-side.
  event.preventDefault();

  // Read the two input elements by their ids. The "as HTMLInputElement"
  // casts tell TypeScript that these DOM nodes have a .value property
  // (getElementById returns a generic HTMLElement, which does not).
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  // The unary plus converts the string from the input into a number.
  // Without it, price would be a string and the Course constructor
  // would refuse it (price expects number).
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  // Validation gate. Until the next lesson implements validate() for
  // real, this always returns true and the alert never fires — but
  // the call site is already correctly wired, so flipping the switch
  // later will not require changes here.
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
