// =====================================================================
// LESSON 171: PROJECT AND LISTENER TYPES
// =====================================================================
//
// In the previous lesson, projects were stored as loose object literals
// and both "listeners" and "projects" were typed as "any[]". This lesson
// replaces the loose typing with:
//
//   1. A Project class that models a single project with a fixed shape.
//   2. An enum ProjectStatus that represents the two allowed states
//      an active/finished project can be in.
//   3. A Listener type alias that captures the shape of a subscriber
//      callback using a function type.
//
// The upgrade eliminates accidental property-name typos (e.g., "Desc"
// vs "description"), enables editor autocompletion on project items,
// and gives us a clean way to filter by status in the next lesson.

// Project Type

// PROJECTSTATUS — an ENUM with two allowed values.
//
// An enum is a perfect fit for a fixed set of identifiers that have no
// meaning to humans beyond "which one is it?". The alternative would be
// a literal union type like 'active' | 'finished', but enums pair more
// naturally with object-oriented state modeling and give each option
// a stable, automatically-assigned numeric value under the hood
// (Active = 0, Finished = 1 by default).
enum ProjectStatus {
  Active,
  Finished
}

// PROJECT — a class that serves as the canonical shape of a project.
//
// Why a class instead of an interface or type alias?
// - A class can be INSTANTIATED with "new Project(...)". Interfaces and
//   type aliases describe shapes but cannot be called at runtime.
// - The parameter property shortcut (public id: string, ...) keeps the
//   entire definition in a single constructor, with no separate field
//   declarations needed.
//
// This replaces the object literal that was previously built inline
// inside ProjectState.addProject().
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management

// LISTENER — a TYPE ALIAS describing the shape of a subscriber callback.
//
// This is a FUNCTION TYPE (not a class and not an interface). The
// syntax "(args) => returnType" describes a callable that accepts
// certain arguments and returns a given type. Here, a listener is
// any function that accepts a Project[] and does not return anything
// the caller cares about (void).
//
// Wrapping this in a type alias lets us write "Listener" in many
// places instead of repeating the full "(items: Project[]) => void"
// expression, and any future change to the listener signature only
// needs to happen in one spot.
type Listener = (items: Project[]) => void;

class ProjectState {
  // Strongly-typed arrays. "Listener[]" means every element is a
  // function matching the Listener type alias above, and "Project[]"
  // means every element is an instance of the Project class. Both
  // replace the loose "any[]" from the previous lesson.
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // listenerFn is now typed as Listener, so callers get editor help
  // on what arguments their callback will receive, and passing an
  // incompatible function is a compile error instead of a runtime bug.
  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    // Instantiate a real Project rather than building an object
    // literal. This guarantees every new project has the exact shape
    // declared on the Project class — no missing fields, no typos in
    // property names. Every newly created project starts with status
    // ProjectStatus.Active; the status can be changed later when
    // the user drags the project to the finished list.
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

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
  // Previously typed as "any[]". Using Project[] here means the
  // renderProjects loop below gets full autocompletion on prjItem
  // (title, description, people, status, id) and TypeScript catches
  // any attempt to access a property the Project class does not have.
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    // The callback parameter is now typed as Project[] so the rest of
    // the function body (assignedProjects assignment, renderProjects)
    // benefits from full type awareness. TypeScript would also infer
    // this automatically from the Listener type on addListener, but
    // the explicit annotation makes the contract obvious at a glance.
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
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
