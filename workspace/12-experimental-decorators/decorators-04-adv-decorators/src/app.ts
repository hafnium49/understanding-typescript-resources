// (Logger from the previous lesson — kept for context but commented out
// at the application site below. See decorators-03 for explanation.)
function Logger(logString: string) {
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

// =====================================================================
// ADVANCED DECORATOR FACTORIES — building "metaprogramming" tools.
// =====================================================================
//
// Decorators become genuinely powerful once you realize they can do
// arbitrary work behind the scenes — including reaching into the DOM,
// inspecting the class they are attached to, and even instantiating
// the class themselves. This is the essence of METAPROGRAMMING:
// writing code (decorators) that other developers attach to their
// own code (classes) to gain extra functionality without writing it
// themselves.
//
// REAL-WORLD ANALOGY: Frameworks like Angular use decorators
// extensively. The @Component decorator in Angular accepts a config
// object with a "template" and a "selector" — and behind the scenes
// it wires the template up to the class so that the rendered output
// appears in the chosen DOM location. The decorator below is a tiny
// version of that idea.
//
// WithTemplate accepts:
//   - template: an HTML string to render
//   - hookId: the id of the DOM element where the template should appear
//
// At the application site, the developer attaches @WithTemplate(...)
// to a class. When the class is defined, the inner decorator runs,
// finds the hook element, instantiates the decorated class to read
// its data, and injects the rendered HTML into the page.
function WithTemplate(template: string, hookId: string) {
  // The inner decorator function — typed as "any" for the constructor
  // because we want to call it like "new constructor()" and read a
  // property off the resulting instance. The bare "Function" type
  // does not let TypeScript know that the value is constructable, so
  // "any" is the simplest escape hatch here. (A more precise type
  // using construct signatures is shown in a later lesson.)
  return function(constructor: any) {
    // Look up the hook element in the DOM. The corresponding markup
    // is in index.html — a <div id="app"></div> placeholder waiting
    // to receive content.
    const hookEl = document.getElementById(hookId);

    // Instantiate the decorated class so we can read its properties.
    // The decorator runs at class-definition time (before the user's
    // own "new Person()" line below), so this is the first instance
    // ever created. Its only purpose here is to expose the .name
    // value for use inside the rendered template.
    const p = new constructor();

    if (hookEl) {
      // Replace the hook element's contents with the template HTML.
      hookEl.innerHTML = template;
      // Then locate the <h1> inside the freshly rendered template
      // and overwrite its text with the instance's name. The "!"
      // is a non-null assertion — for demo purposes we assume the
      // template always contains exactly one <h1>.
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  }
}

// Multiple decorators can be applied to the same class. Here, the
// Logger line is commented out so only WithTemplate runs. Both
// would work simultaneously if uncommented — decorator stacking
// behavior (and execution order) is covered in a later lesson.
// @Logger('LOGGING - PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

// Note: at this point the page has already updated. WithTemplate
// instantiated Person internally during class definition and injected
// the rendered HTML before this line ever executed. The "pers"
// instantiation below is a SECOND, independent instance.
const pers = new Person();

console.log(pers);
