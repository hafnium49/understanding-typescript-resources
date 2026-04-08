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

// =====================================================================
// LESSON 158: IMPLEMENTING THE VALIDATION REGISTRY.
// =====================================================================
//
// With the API sketched in the previous lesson, the job now is to
// build the actual storage and check logic behind it.
//
// THE STORAGE SHAPE:
//
// ValidatorConfig is an index-signature type describing a nested map:
//
//   { className: { propertyName: [validatorKey, validatorKey, ...] } }
//
// The OUTER key is the class name (e.g., "Course"), and its value is
// another map from property names to lists of validator identifiers.
// Each property can carry multiple rules (e.g., a string might be both
// 'required' AND match a certain pattern), so the innermost value is
// an array of string keys rather than a single string.
interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; // e.g., ['required', 'positive']
  };
}

// The global registry. It starts empty and is populated by the
// property decorators as each class is defined. In a real library
// this would be hidden from consumers inside a module.
const registeredValidators: ValidatorConfig = {};

// PROPERTY DECORATOR: @Required
//
// Remember the signature: a property decorator gets (target, propName)
// — there is no descriptor for plain property positions. "target" for
// an instance property is the CLASS PROTOTYPE, and every prototype in
// JavaScript carries a `.constructor` property pointing at the class
// itself. From that constructor we can read its `.name` to get the
// class name as a string ("Course" here).
//
// Writing into the registry:
//   registeredValidators[className][propName] = [...existing, 'required']
//
// The SPREAD on the outer object is essential: without it, each new
// @Required or @PositiveNumber call would REPLACE the entire inner
// object for that class, wiping out any validators registered for
// other properties. The spread preserves everything already there.
function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['required']
  };
}

// PROPERTY DECORATOR: @PositiveNumber
//
// Same pattern as Required, but registers 'positive' instead. The
// validator key is an arbitrary string — validate() just has to know
// how to handle each key it encounters.
function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['positive']
  };
}

// THE VALIDATOR FUNCTION:
//
// validate(obj) looks up the registry entry for obj's class, then
// walks through every registered property and every validator key,
// accumulating an overall isValid result.
//
// WHY ACCUMULATE INSTEAD OF RETURNING EARLY:
//
// A tempting first attempt is `return !!obj[prop];` inside the switch.
// That works for the FAILURE path (the first invalid property can
// short-circuit), but it also returns `true` the instant the first
// VALID property is checked — leaving the remaining ones unverified.
// The fix is to fold the per-check result into an accumulator with
// boolean AND, and only return at the very end. Once any check fails,
// `isValid` becomes false and can never flip back to true.
function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  // If nothing was registered for this class, there is nothing to
  // check — treat it as valid by default.
  if (!objValidatorConfig) {
    return true;
  }
  let isValid = true;
  // Outer loop: iterate over each property that has validators.
  for (const prop in objValidatorConfig) {
    // Inner loop: iterate over each validator key attached to that
    // property. A property may have several.
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          // Truthy check. Empty strings, 0, null, and undefined are
          // all falsy and will fail the `required` rule. `!!` forces
          // the value into a real boolean.
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          // Strict greater-than-zero. Zero and negative values fail.
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
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

  // Validation gate. validate() consults the registry populated by the
  // @Required and @PositiveNumber decorators and returns false as
  // soon as any rule fails. On failure we alert the user and abort
  // before doing anything further with the invalid data.
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
