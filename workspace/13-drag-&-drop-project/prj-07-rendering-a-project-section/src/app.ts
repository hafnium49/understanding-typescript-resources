// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
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

// =====================================================================
// LESSON 169: RENDERING THE PROJECT-LIST SECTION
// =====================================================================
//
// Goal of this lesson: stop logging the gathered user input to the
// console and instead render a real "Active Projects" and "Finished
// Projects" section on the page. Each section comes from the
// <template id="project-list"> element in index.html.
//
// A SINGLE CLASS, TWO INSTANCES:
// Rather than duplicating the rendering code, we write ONE ProjectList
// class and create two instances — one for "active" and one for
// "finished". The class accepts a constructor argument that tells it
// which variant to render, which is then used to build unique element
// ids and heading text.
//
// Displaying actual project items inside these sections is deferred
// to the next lessons; for now the lists are visible but empty.

// ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  // The template wraps a <section>, for which there is no dedicated
  // HTMLSectionElement type. Every DOM element still fits the generic
  // HTMLElement type, so we use that here.
  element: HTMLElement;

  // PARAMETER PROPERTY — "private type" on a constructor parameter
  // automatically creates a private field called "type" and assigns
  // the incoming argument to it, in one step.
  //
  // LITERAL-UNION TYPE — 'active' | 'finished' restricts the allowed
  // arguments to those two exact strings. Any other value (including
  // any arbitrary string) would be a compile error at the call site.
  // This pairs naturally with using the type to build element ids and
  // headings below, because the values are both the discriminator
  // (active vs finished) and the content (class names, h2 text).
  constructor(private type: 'active' | 'finished') {
    // Selecting the template and the host container follows the same
    // pattern used in ProjectInput: getElementById with a non-null
    // assertion and a type cast to the specific subtype we know about.
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    // DYNAMIC ID via a template literal. For an "active" instance
    // this produces "active-projects", for "finished" it produces
    // "finished-projects". These ids correspond to CSS rules in
    // app.css that style the two sections differently (e.g., the
    // finished section uses a blue accent color via #finished-projects).
    this.element.id = `${this.type}-projects`;

    // The order here is: first attach the element to the DOM, then
    // fill in its content. Either order works as long as both run
    // before the user sees the page.
    this.attach();
    this.renderContent();
  }

  // RENDER CONTENT — fills the blanks inside the cloned template:
  //   1. Give the <ul> a type-specific id so we can target it later.
  //   2. Set the <h2> heading text to the uppercase type plus
  //      " PROJECTS" (e.g., "ACTIVE PROJECTS").
  //
  // querySelector is used again here instead of getElementById because
  // the lookup is scoped to this.element (the cloned section), not the
  // whole document — and because tag selectors are the simplest way to
  // reach the single <ul> and single <h2> inside the template.
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';

  }

  // ATTACH — insert the rendered section into the host container.
  //
  // Position "beforeend" places the section as the LAST child of the
  // host element. This matters because the form is inserted with
  // "afterbegin" (first child), so the active and finished lists end
  // up stacked below the form in the rendered order.
  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
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

// Create the rendered instances. The form is rendered first, then the
// two project sections. Passing a string other than 'active' or
// 'finished' here would be rejected at compile time because of the
// literal-union type on ProjectList's constructor parameter.
const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
