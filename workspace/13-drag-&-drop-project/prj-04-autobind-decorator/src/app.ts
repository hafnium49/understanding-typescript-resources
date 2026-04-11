// =====================================================================
// LESSON 166: THE AUTOBIND DECORATOR
// =====================================================================
//
// Building on the previous lesson, this lesson replaces the manual
// .bind(this) call with a method DECORATOR that binds "this"
// automatically for any method it is applied to.
//
// PREREQUISITE — tsconfig.json setting:
// Decorators are an experimental TypeScript feature and must be
// enabled by setting "experimentalDecorators": true in tsconfig.json.
// Without this flag, the compiler will reject the @autobind syntax.
// After changing the tsconfig setting, the TypeScript watch-mode
// process (tsc -w) must be restarted so it picks up the new config.

// autobind decorator
//
// A METHOD DECORATOR receives three arguments from TypeScript:
//   1. target        — the prototype of the class (or constructor for static methods)
//   2. methodName    — the name of the decorated method as a string
//   3. descriptor    — the PropertyDescriptor of the method, which
//                      contains the original function in its ".value"
//
// We only care about the descriptor here, but all three parameters
// must be declared because TypeScript requires the exact signature
// shape for a method decorator.
//
// UNUSED PARAMETER NAMES: The strict "noUnusedParameters" rule in
// tsconfig.json would normally flag "target" and "methodName" as
// errors because we never reference them. Two ways to silence this:
//
//   a) Turn off noUnusedParameters in tsconfig.json (loosens strict mode)
//   b) Prefix unused parameters with an underscore (_, _2, _3, ...)
//      — this convention signals "intentionally unused" and is
//      recognized by both TypeScript and many linting tools.
//
// The underscore-prefix approach is used below.
function autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  // Grab the function the class originally defined for this method.
  // descriptor.value holds that function when decorating a method.
  const originalMethod = descriptor.value;

  // Build a REPLACEMENT property descriptor that we will return.
  // Returning a new descriptor from a method decorator tells
  // TypeScript to install this descriptor on the class in place of
  // the original one.
  //
  // WHY A GETTER INSTEAD OF A PLAIN "value"?
  // The trick is that every time the method is accessed (e.g.,
  // this.submitHandler), the getter runs and returns a freshly
  // bound version of the original function. This happens before
  // the function is passed anywhere, so callers always receive a
  // function with "this" locked to the current instance.
  //
  // "configurable: true" keeps the descriptor mutable so other code
  // (including future decorators) can redefine it if needed.
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      // Inside this getter, "this" refers to the instance from which
      // the property is being read — exactly what we need to bind.
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  // @autobind — TypeScript calls the decorator function above when
  // the class is defined, passing in the method's descriptor. The
  // decorator returns a replacement descriptor whose getter always
  // produces a "this"-bound version of submitHandler. As a result,
  // any code that reads this.submitHandler gets a function that
  // already has the correct "this" context — so the explicit
  // .bind(this) call from the previous lesson is no longer needed.
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  // Notice there is NO .bind(this) here anymore. The @autobind
  // decorator on submitHandler handles the binding automatically
  // when the event listener accesses the method.
  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
