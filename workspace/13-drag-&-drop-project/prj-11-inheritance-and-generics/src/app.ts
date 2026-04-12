// Project Type
enum ProjectStatus {
  Active,
  Finished
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// =====================================================================
// LESSON 173: INHERITANCE, GENERICS, AND A BASE STATE CLASS
// =====================================================================
//
// Up to this point, several classes have been duplicating the same
// boilerplate: selecting a template, cloning its content, and
// attaching it to a host element. ProjectState also hand-rolls a
// listener array and an addListener method that would look identical
// in any other state class.
//
// This lesson pulls those shared pieces into two base classes:
//
//   1. State<T>       — a generic base that owns the listeners array
//                       and exposes addListener. Concrete state
//                       classes extend State<SomeSpecificType>.
//
//   2. Component<T, U> — a generic, abstract base that owns the
//                        template/host/element selection and the
//                        attachment logic. Concrete components
//                        extend Component<HostType, ElementType>.
//
// Both are generic so subclasses can still reason about specific
// types (e.g., HTMLDivElement instead of plain HTMLElement) without
// losing precision.

// Project State Management

// LISTENER — generic function type.
//
// The previous lesson hard-coded the parameter as Project[]. That
// worked for ProjectState but would not fit a future UserState or
// CartState. The solution is to parameterize the type: Listener<T>
// accepts a placeholder T and plugs it into the callback signature.
// When someone writes Listener<Project>, they get back
// "(items: Project[]) => void" — exactly what we had before, but now
// reusable for any item type.
type Listener<T> = (items: T[]) => void;

// STATE<T> — generic base class that manages a subscription list.
//
// Any concrete state class inherits the listeners array and the
// addListener method by extending State<SomeType>. The type argument
// flows through to Listener<T>, so subscribers always receive the
// correct item type in their callback.
//
// "protected" on listeners makes the array accessible from subclasses
// but still hidden from outside code. A subclass needs to loop over
// the listeners to notify them of changes — private would block that,
// public would leak internal state to the rest of the application.
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// PROJECTSTATE — the concrete project state now EXTENDS State<Project>.
//
// Passing "Project" as the type argument locks every listener's
// parameter type to Project[], while the subscription machinery is
// fully inherited from the base class — no duplicated code.
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  // Subclasses must call super() before they can use "this".
  // State's constructor has no parameters, so this call is empty.
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    // "this.listeners" is inherited from State<Project>. Because the
    // field was declared as "protected" (not private) in the base
    // class, this subclass can read it here. The rest of the app
    // outside the inheritance chain cannot.
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

// COMPONENT BASE CLASS — a generic, abstract class for any UI component
// that clones markup from a <template> and attaches it to a host.
//
// The "Component" name is borrowed from frameworks like React and
// Angular, where a component is a self-contained renderable unit.
// Any subclass gets the shared select + clone + attach behavior
// for free and only has to implement its specific configuration
// and content rendering.
//
// TWO GENERIC PARAMETERS with constraints:
//   T extends HTMLElement — the TYPE of the host container. Different
//                           subclasses host into different kinds of
//                           elements (a <div id="app"> for top-level
//                           components, a <ul> for list items). The
//                           constraint ensures T is always some flavor
//                           of HTMLElement.
//   U extends HTMLElement — the TYPE of the cloned element that
//                           will actually be inserted. ProjectInput
//                           renders an HTMLFormElement; ProjectList
//                           renders a plain HTMLElement (a <section>).
//
// Without generics, both would have to be typed as the broadest
// HTMLElement type, and subclasses would lose access to subtype-
// specific properties (like .value on HTMLInputElement).
//
// ABSTRACT CLASS — declared with the "abstract" keyword.
//
// "abstract" marks a class as a base that CANNOT be instantiated on
// its own — "new Component(...)" is a compile error. Only subclasses
// can be instantiated. This prevents callers from accidentally using
// the half-built base class as a usable component.
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  // CONSTRUCTOR PARAMETERS are intentionally generic so subclasses can
  // feed in the specific ids and insertion options their instance
  // needs. Required parameters come first; the optional newElementId
  // is last because TypeScript does not allow a required parameter
  // after an optional one.
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    // The cast "as T" uses the generic type parameter to say "trust
    // me, the host element at this id really is the subtype the
    // subclass declared." The compiler cannot verify this at the
    // base-class level, but subclasses know what they are doing.
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    // Same idea for the cloned element: cast to U, the element type
    // chosen by the subclass.
    this.element = importedNode.firstElementChild as U;
    // Optional id — skip the assignment entirely if the subclass
    // chose not to supply one.
    if (newElementId) {
      this.element.id = newElementId;
    }

    // The base class handles attachment automatically — subclasses
    // never need to call attach() themselves. The insertAtStart flag
    // controls whether the element becomes the first or last child.
    this.attach(insertAtStart);
  }

  // "private" is fine here because this method is only used inside
  // the base class. Subclasses never call attach() directly; they
  // just receive attachment as a side effect of calling super().
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  // ABSTRACT METHODS — declared without an implementation.
  //
  // Any class that extends Component MUST provide its own configure()
  // and renderContent() methods, or TypeScript raises a compile error.
  // This gives the base class a way to communicate "I handle the
  // boilerplate, but here is what every subclass still has to fill in."
  //
  // Side note: abstract methods cannot be "private" — that restriction
  // is enforced by TypeScript. So both methods are effectively public
  // and subclasses must declare them as public (or simply omit an
  // access modifier, which defaults to public).
  //
  // WHY are configure() and renderContent() NOT called automatically
  // in this constructor? Because the subclass constructor typically
  // initializes its own fields AFTER super() runs, and those fields
  // might be exactly what configure() or renderContent() relies on.
  // Calling them too early would read uninitialized values. Leaving
  // the calls to the subclass ensures they only fire once the
  // subclass has finished its own setup.
  abstract configure(): void;
  abstract renderContent(): void;
}

// ProjectList Class
//
// REFACTORED to extend the Component base class. The generic type
// arguments nail down the specific DOM types this component deals
// with: its host is the top-level <div id="app"> (HTMLDivElement)
// and the cloned element is the <section> from the project-list
// template, which has no dedicated subtype so we use HTMLElement.
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    // super() forwards the template id, the host element id, the
    // insert-at-start flag (false = append at the end), and the id
    // to assign to the newly cloned element. The base class takes
    // care of selecting, cloning, id-assigning, and attaching.
    //
    // IMPORTANT: You cannot use "this" before super() has run, so
    // the parameter "type" is referenced directly (not "this.type")
    // when building the template literal here.
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    // The base class deliberately does NOT call these for us (see
    // the Component class comment above). Each subclass decides when
    // its own setup runs, after its own fields are initialized.
    this.configure();
    this.renderContent();
  }

  // The Component base class declared configure() as abstract, so
  // every subclass is forced to provide an implementation. For
  // ProjectList, configuration means subscribing to the global
  // project state and filtering the broadcast down to the projects
  // that match this instance's type.
  //
  // Note: public by necessity — abstract methods cannot be private,
  // so subclasses cannot make their implementation private either.
  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  // The second abstract method. For ProjectList, "render content"
  // means filling the static bits of the cloned section: the list's
  // id and the heading text.
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

// ProjectInput Class
//
// REFACTORED to extend the Component base class. The type arguments
// tell TypeScript this component's host is the top-level div
// (HTMLDivElement) and its cloned element is a form (HTMLFormElement).
// Using HTMLFormElement instead of the broader HTMLElement means
// this.element exposes form-specific properties (e.g., being a valid
// target for the submit event listener below).
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // Forward the template id, host id, insertAtStart=true (the form
    // is rendered as the first child of the app container so it
    // appears above the two list sections), and the id to assign to
    // the cloned form element.
    super('project-input', 'app', true, 'user-input');

    // Query the three inputs AFTER super() has populated this.element.
    // The selection happens in the constructor (not in configure())
    // so that strict property initialization sees these fields being
    // assigned during construction. Moving them to configure() would
    // technically behave the same at runtime, but TypeScript's strict
    // rule would complain that the fields are never assigned directly
    // in the constructor.
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
    this.renderContent();
  }

  // CONFIGURE — subscribe to the form's submit event. The abstract
  // contract on Component requires this method to exist, and this is
  // where wiring up event listeners belongs for ProjectInput.
  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  // RENDERCONTENT — the abstract contract also requires this method.
  // ProjectInput has nothing extra to fill in (the form's markup is
  // already complete in index.html), so the body is empty. The method
  // still has to exist because the base class declares it abstract.
  renderContent() {}

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
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
