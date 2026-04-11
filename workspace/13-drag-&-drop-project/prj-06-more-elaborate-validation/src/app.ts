// =====================================================================
// LESSON 168: A REUSABLE, CONFIGURABLE VALIDATION FUNCTION
// =====================================================================
//
// The previous lesson used ad-hoc empty-string checks inside
// gatherUserInput(). That approach does not scale — every new rule
// grows the if-statement, and the logic cannot be reused elsewhere.
//
// This lesson introduces:
//   1. A Validatable interface describing the "shape" of a value
//      plus its validation rules.
//   2. A validate() helper that reads those rules and returns a
//      boolean indicating whether the value is valid.
//   3. Three Validatable objects (one per form field) passed to
//      validate() from gatherUserInput().

// =====================================================================
// Validation
// =====================================================================

// VALIDATABLE INTERFACE — the shape of an object that the validate
// helper knows how to check.
//
// Using an INTERFACE (rather than a type alias or class) here is a
// stylistic choice. Interfaces are especially natural when describing
// a "contract" an object must satisfy, with no runtime cost and no
// need for instantiation.
//
// Only "value" is required. Every rule property is OPTIONAL via the
// "?" suffix — callers supply only the rules they care about for a
// given field. (An equivalent alternative to "required?: boolean" is
// "required: boolean | undefined", but "?" is shorter and idiomatic.)
//
// RULE SEMANTICS:
//   required    — if true, the value must not be empty after trimming.
//   minLength   — minimum number of characters; strings only.
//   maxLength   — maximum number of characters; strings only.
//   min         — minimum numeric value; numbers only.
//   max         — maximum numeric value; numbers only.
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// VALIDATE — runs every configured rule and returns the overall result.
//
// The general pattern used below:
//   1. Start with "isValid = true" (nothing has failed yet).
//   2. For each rule that is configured, fold the rule's check into
//      isValid using the logical AND (&&) operator.
//   3. Return isValid.
//
// Because AND is short-circuit and sticky-on-false, any single failing
// rule permanently flips isValid to false, regardless of later rules.
function validate(validatableInput: Validatable) {
  let isValid = true;

  // REQUIRED CHECK.
  // value may be a string OR number, and "trim" only exists on strings.
  // Calling .toString() first normalizes both cases to a string so the
  // .trim().length check works uniformly. An equivalent approach would
  // be to narrow the type with a typeof guard, but that would be more
  // verbose for no benefit here.
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  // MIN-LENGTH CHECK — strings only.
  //
  // Why "!= null" instead of just truthiness (if (validatableInput.minLength))?
  //
  // If a caller sets minLength to 0, that is a legitimate (if odd)
  // configuration — the developer explicitly asked for "at least zero
  // characters." Using truthiness would skip the check because 0 is
  // falsy. "!= null" (with one equals sign) matches both null AND
  // undefined at once — a JavaScript quirk that is useful here. That
  // way, only "unset" skips the check; 0 runs it.
  //
  // The typeof check narrows value to string, unlocking .length.
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  // MAX-LENGTH CHECK — mirror of the above, with <= instead of >=.
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  // MIN VALUE CHECK — numbers only.
  // Same "!= null" reasoning: min could legitimately be 0.
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  // MAX VALUE CHECK — numbers only.
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

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

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // BUILD PER-FIELD VALIDATION CONFIGS.
    //
    // Each Validatable object pairs the value to check with the rules
    // that should be applied to it. Typing each constant with ": Validatable"
    // is optional (TypeScript would infer it) but gives us immediate
    // feedback if a property name is misspelled or the wrong type is
    // supplied — a nice safety net while building the object literal.
    //
    // Note the unary "+" on enteredPeople: the input value is always
    // a string, and the people field is validated as a number (min/max
    // rules only apply to numbers), so we coerce here rather than
    // passing a string to a rule it does not understand.
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    };

    // FAIL-FAST VALIDATION.
    //
    // Each validate() call returns true for valid, false for invalid.
    // The "!" in front of each call flips those booleans, and the ||
    // chain short-circuits on the first failing field — so the alert
    // fires if ANY field is invalid. Only if every call returns true
    // do we fall through to the else branch and return the tuple.
    //
    // (HTML-level constraints on <input type="number"> are easy to
    // bypass, so this JS/TS validation is the real guard.)
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
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
