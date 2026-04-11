// =====================================================================
// LESSON 170: BASIC LIST RENDERING & SINGLETON STATE MANAGEMENT
// =====================================================================
//
// Goal: connect the form (ProjectInput) to the list sections
// (ProjectList) so newly submitted projects actually appear on the
// page — without hard-coding DOM lookups inside ProjectInput.
//
// DESIGN CHOICE — centralized state with a subscription pattern:
// Instead of having ProjectInput reach directly into the DOM (via
// document.getElementById on the list's <ul>) or requiring references
// to every interested class, we introduce a ProjectState class that:
//
//   1. Holds the single source of truth for all projects.
//   2. Exposes an addProject() method that the form calls.
//   3. Exposes an addListener() method that interested classes call
//      to register a callback. Every time the state changes, every
//      registered callback is invoked with a fresh copy of the data.
//
// This is the same "observer" pattern used by state libraries like
// Redux and framework state stores in Angular or React — just written
// by hand here so the mechanics are visible.

// Project State Management

class ProjectState {
  // The list of registered listener callbacks. Every time the state
  // changes, each callback in this list is invoked with the new data.
  // Typed as "any[]" for now; a proper function type is introduced in
  // a later lesson.
  private listeners: any[] = [];
  // The single source of truth for all projects in the app. Using
  // "any[]" is a temporary placeholder — a dedicated Project type
  // arrives in a later lesson.
  private projects: any[] = [];
  // Static reference that holds the one-and-only instance of this
  // class. "static" means the property lives on the class itself,
  // not on any instance — there is only one "instance" slot for the
  // entire class.
  private static instance: ProjectState;

  // SINGLETON PATTERN — the private constructor.
  //
  // Declaring the constructor as "private" prevents outside code
  // from ever calling "new ProjectState()" directly. The only way
  // to obtain an instance is through the static getInstance() method
  // below, which enforces that at most ONE instance exists for the
  // whole application lifetime. This is the "singleton" pattern.
  //
  // Why a singleton here? Because there should only be one central
  // registry of projects. Multiple instances would fragment the state
  // and break the subscription guarantee.
  private constructor() {}

  // GET-INSTANCE — the singleton accessor.
  //
  // On the first call, "this.instance" is undefined, so we create a
  // new ProjectState and cache it. On every subsequent call, we
  // return the cached instance unchanged. The "this" inside a static
  // method refers to the CLASS itself, not an instance.
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // Register a callback to be invoked whenever the projects list
  // changes. The callback receives a COPY of the current projects,
  // so subscribers cannot accidentally mutate the authoritative list.
  //
  // Using JavaScript's built-in Function type accepts any callable.
  // A precise function type is introduced in a later lesson.
  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  // Create a new project and broadcast the change to every listener.
  //
  // Math.random().toString() is used as a quick-and-dirty unique id.
  // Collisions are theoretically possible but vanishingly unlikely at
  // the scale of this demo. A production app would use a UUID library
  // or a server-assigned id.
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople
    };
    this.projects.push(newProject);
    // Notify every subscriber. IMPORTANT: .slice() with no arguments
    // returns a shallow copy of the array. Passing this copy (instead
    // of the original reference) prevents subscribers from accidentally
    // mutating the internal projects list. Since arrays are reference
    // values in JavaScript, handing out the original would be risky.
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// Global singleton instance. Any code in this file can use this
// constant to add projects or subscribe to changes — no need to
// thread references through constructors.
const projectState = ProjectState.getInstance();

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

// ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  // NEW FIELD — the locally-cached list of projects this instance
  // should render. Gets refreshed whenever the ProjectState broadcasts
  // a change. Typed as "any[]" for now.
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    // Initialize to an empty array so the field is never "undefined".
    // Without this, TypeScript's strict property initialization rule
    // would complain, and any read before the first listener call
    // would explode at runtime.
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    // SUBSCRIBE to state changes. The arrow function is registered
    // as a listener on the global projectState. Every time a new
    // project is added anywhere in the app, the ProjectState will
    // invoke this callback with a fresh copy of all projects.
    //
    // ARROW FUNCTION + "this": Because arrow functions do NOT bind
    // their own "this" and instead inherit it from the enclosing
    // scope, "this" inside this callback refers to the ProjectList
    // instance — exactly what we need to update assignedProjects
    // and trigger a re-render. Using a regular function expression
    // here would require .bind(this) like in earlier lessons.
    //
    // TIMING NOTE: This listener does NOT fire immediately — it
    // only runs when the state changes later. So the constructor
    // code that follows (attach, renderContent) runs first, and
    // the <ul> id is in place by the time the listener eventually
    // calls renderProjects().
    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  // RENDER PROJECTS — paint the assignedProjects into the <ul>.
  //
  // We look up the list by its id (set inside renderContent), so
  // we know it is already attached to the DOM by the time this runs.
  // For each project, we create an <li>, set its textContent to the
  // project's title, and append it to the list.
  //
  // KNOWN BUG in this version: renderProjects does NOT clear existing
  // items before re-rendering. When a second project is added, the
  // first project gets appended a second time, producing duplicates.
  // This is fixed in a later lesson by clearing the list first.
  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem)
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

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
      // Hand the validated input off to the global state manager.
      // ProjectState takes care of creating the project object AND
      // notifying every subscribed ProjectList instance — so the new
      // project automatically appears on screen without this class
      // knowing anything about the DOM lists.
      projectState.addProject(title, desc, people);
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
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
