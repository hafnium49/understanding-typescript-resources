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

// =====================================================================
// LESSON 159: FIXING THE VALIDATOR BUG.
// =====================================================================
//
// The registry writers from lesson 158 have a subtle bug: when more
// than one validator decorator is applied to the SAME property, the
// second decorator overwrites the first one's entry instead of
// appending to it.
//
// Example: suppose you want a title to be both required AND short:
//
//   class Course {
//     @Required
//     @Maxlength        // hypothetical second validator
//     title: string;
//   }
//
// The lesson 158 code would first register ['maxlength'] for title,
// then immediately replace it with ['required'] when @Required runs.
// The final registry only remembers 'required' — the 'maxlength' rule
// is lost. The last decorator silently wins.
//
// ROOT CAUSE:
//   [propName]: ['required']   ← always produces a fresh one-element
//                                 array, ignoring any existing array
//                                 for this property.
//
// THE FIX:
//   [propName]: [
//     ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
//     'required'
//   ]
//
// Read the bracketed value left to right:
//   1. registeredValidators[target.constructor.name]
//        → the inner map for this class, or undefined if not yet set
//   2. ?.[propName]
//        → optional chaining reaches through step 1 only if it exists,
//          returning the existing array for this property, or undefined
//   3. ?? []
//        → nullish coalescing substitutes an empty array when step 2
//          is null/undefined
//   4. ...spread into a new array, then append the new validator key
//
// Result: existing validators are preserved, and the new one is added
// at the end. Stacking @Required, @Maxlength, @Positive, etc., now
// accumulates all their keys on the same property instead of trampling
// each other.

// PROPERTY DECORATOR: @Required
//
// Remember the signature: a property decorator gets (target, propName)
// — there is no descriptor for plain property positions. "target" for
// an instance property is the CLASS PROTOTYPE, and every prototype in
// JavaScript carries a `.constructor` property pointing at the class
// itself. From that constructor we can read its `.name` to get the
// class name as a string ("Course" here).
//
// The OUTER spread (`...registeredValidators[target.constructor.name]`)
// still preserves validators on OTHER properties of the same class.
// The INNER spread + optional chaining pattern (new in this lesson)
// additionally preserves existing validators on the SAME property.
function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      'required'
    ]
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
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      'positive'
    ]
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

// =====================================================================
// LESSON 160: DECORATORS IN THE REAL WORLD.
// =====================================================================
//
// The tiny validator built in lessons 157–159 is an intentionally
// naive version of something that already exists as a robust library.
// A quick survey of popular decorator-based tools in the TypeScript
// ecosystem shows the same ideas at a much larger scale.
//
// CLASS-VALIDATOR (npm: class-validator)
//
// A mature validation library that does exactly what we just built,
// but with dozens of built-in rules (IsEmail, IsUrl, Length, Min, Max,
// Matches, IsDate, ...) plus message customization, async validators,
// and nested object support. You import decorators from the package,
// attach them to class properties, and call validate(obj). The
// internal registry and per-class metadata tracking are all hidden
// behind the package — consumers just see the decorators and the
// validate function.
//
// ANGULAR (@Component and friends)
//
// Angular's component system is fundamentally decorator-based. The
// @Component decorator takes a configuration object with a template,
// a selector, styles, and more — very similar in spirit to the
// WithTemplate factory we wrote, but vastly more elaborate. Other
// Angular decorators like @Injectable, @Input, @Output, @NgModule,
// and @HostListener use the same class/property/method positions to
// register components, services, DI bindings, and event handlers
// with the framework runtime.
//
// NESTJS (server-side Node.js framework)
//
// NestJS is a server framework built around TypeScript decorators.
// @Controller registers a class as an HTTP controller, @Get / @Post /
// @Put / @Delete declare route handlers, @Body / @Param / @Query
// extract request data into method parameters, and @UseGuards /
// @UseInterceptors hook middleware into specific routes. The
// framework walks the decorator metadata at startup to wire up the
// entire HTTP routing table — again, the same "decorators register,
// framework reads" pattern established in our validation example.
//
// COMMON THREAD
//
// In every case, the decorator itself does not DO the work at the
// moment it runs. It records metadata, and a framework (or a
// separate validate/compile/bootstrap step) acts on that metadata
// later. Internalizing this pattern is the single most important
// takeaway from this section — once you see it, the decorators used
// by any library start to make sense as a configuration language
// rather than as magic.
