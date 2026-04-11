// =====================================================================
// LESSON 167: FETCHING USER INPUT & BASIC VALIDATION
// =====================================================================
//
// Building on the previous lesson, this lesson:
//   1. Adds a gatherUserInput() method that reads the three input
//      fields, performs a simple validation, and returns the values
//      as a TUPLE if valid.
//   2. Uses the tuple return type to express the exact shape of the
//      returned data: [string, string, number].
//   3. Handles the failure path with void and a union return type.
//   4. Adds a clearInputs() method that resets the form after a
//      successful submit.
//   5. Updates submitHandler() to actually use gatherUserInput().
//
// The validation here is deliberately simplistic — it just checks for
// empty strings. A more scalable, configurable validation approach is
// introduced in the next lesson.

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
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

  // GATHER USER INPUT — read, validate, and return the form values.
  //
  // RETURN TYPE: [string, string, number] | void
  //
  // The tuple "[string, string, number]" describes a fixed-length
  // array with EXACTLY three elements of those specific types, in
  // that specific order. This is distinct from "string[]" (an array
  // of any length holding strings). Tuples give us stronger type
  // guarantees when a function returns a known-shape collection.
  //
  // The "| void" half of the union covers the FAILURE path: when
  // validation fails, the function shows an alert and returns early
  // with no value. TypeScript requires that every return path match
  // the declared return type, so void is included to allow a bare
  // "return;" statement. Note: "void" is TypeScript's preferred
  // function-return way of saying "no value"; using "undefined" as a
  // return type is generally discouraged.
  private gatherUserInput(): [string, string, number] | void {
    // Read the current value of each input. Every input's .value is
    // always a string, regardless of the input's "type" attribute —
    // even <input type="number"> gives us a string here. The numeric
    // conversion happens later when building the return tuple.
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // TRIVIAL VALIDATION — just check for non-empty input.
    //
    // .trim() strips leading/trailing whitespace so that a value like
    // "   " does not count as valid input. The validation fails if
    // any of the three fields is empty after trimming.
    //
    // This approach has obvious limits: we cannot enforce a minimum
    // length, we cannot require that "people" be a positive number,
    // and adding more rules means stacking more conditions onto this
    // if-statement. A reusable validate() helper replaces this in
    // the next lesson.
    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert('Invalid input, please try again!');
      // Bare "return" — exits the function with no value. This is
      // the void half of the union return type. An alternative would
      // be to throw an error, but that requires error-handling logic
      // at every call site.
      return;
    } else {
      // Return the three values as a tuple matching the declared
      // return type. The UNARY PLUS (+enteredPeople) converts the
      // string from the input to a number. Without the +, TypeScript
      // would reject the return because a string is not assignable
      // to the number slot of the tuple.
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  // Reset all three form fields after a successful submission so the
  // user starts with a clean form for the next project.
  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    // RUNTIME TYPE CHECK — is userInput a tuple or void?
    //
    // TUPLES DO NOT EXIST AT RUNTIME. They are purely a TypeScript
    // compile-time concept: once the code is compiled to JavaScript,
    // a tuple is indistinguishable from a plain array. So we cannot
    // use "instanceof Tuple" or "typeof userInput === 'tuple'" —
    // neither exists.
    //
    // The trick is to check whether userInput is an array at all,
    // since void (which is undefined at runtime) is not an array.
    // Array.isArray() is a built-in JavaScript method for exactly
    // this kind of check.
    //
    // Inside the if-block, TypeScript also NARROWS the type: it
    // knows userInput must be the tuple branch of the union, so we
    // can destructure it with full type information.
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
