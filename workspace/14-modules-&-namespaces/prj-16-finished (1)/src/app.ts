// LESSON 184 — NAMESPACES: splitting code across multiple files.
//
// This file currently holds ALL the project's code in a single file.
// In this lesson, the instructor demonstrates how to split it into
// multiple files using TypeScript's NAMESPACE feature:
//
// STEP 1: Move related code (e.g., interfaces, models) into separate
//         .ts files and wrap them in a "namespace" block.
//
// STEP 2: Add the "export" keyword in front of anything inside the
//         namespace that needs to be accessible from other files.
//         Without export, features inside a namespace are private to
//         that namespace block.
//
// STEP 3: In the consuming file (e.g., app.ts), add a triple-slash
//         reference directive at the top to import the namespace file:
//           /// <reference path="drag-drop-interfaces.ts" />
//         THREE slashes are required — this is a special TypeScript
//         syntax, not a regular comment. TypeScript picks it up during
//         compilation to resolve cross-file dependencies.
//
// STEP 4: Wrap the consuming code in a namespace with the SAME NAME
//         as the one in the imported file. Namespaces with the same
//         name are merged across files, allowing exported features
//         to be used seamlessly.
//
// STEP 5: Enable "outFile" in tsconfig.json to bundle all namespace
//         files into a single JavaScript output file. Without outFile,
//         each .ts file compiles to its own .js file and the cross-file
//         references are lost at runtime (JavaScript has no namespace
//         equivalent). The "module" setting must also be changed to
//         "amd" (or "system") — CommonJS does not support outFile.
//
// STEP 6: Update index.html to import the bundled file (e.g.,
//         bundle.js) instead of individual .js files.
//
// KEY INSIGHT: Namespaces are a TypeScript-only feature. They compile
// to JavaScript objects where exported items become properties. The
// triple-slash references and namespace merging exist only during
// compilation — they are erased in the output. The outFile bundling
// is what makes everything work at runtime.
//
// NOTE ON MODULE TYPES (see supporting info for details):
// - CommonJS: synchronous, designed for Node.js (require/exports)
// - AMD: asynchronous, designed for browsers (define/require)
// - ES Modules: the modern standard (import/export)
// outFile requires AMD or System because they support concatenation
// into a single file; CommonJS and ES modules do not.
//
// The namespace-split version of this project is in:
//   workspace/14-modules-&-namespaces/modules-01-namespaces/
//
// LESSON 185 — CONTINUING THE NAMESPACE SPLIT: full project refactor.
//
// This lesson continues splitting the single app.ts into focused files,
// organized into subfolders for better readability:
//
//   src/
//   ├── app.ts                          ← entry point (only instantiation)
//   ├── models/
//   │   ├── drag-drop.ts                ← Draggable & DragTarget interfaces
//   │   └── project.ts                  ← ProjectStatus enum & Project class
//   ├── state/
//   │   └── project-state.ts            ← Listener, State, ProjectState, instance
//   ├── util/
//   │   └── validation.ts               ← Validatable interface & validate()
//   ├── decorators/
//   │   └── autobind.ts                 ← autobind decorator function
//   └── components/
//       ├── base-component.ts           ← abstract Component base class
//       ├── project-input.ts            ← ProjectInput class
//       ├── project-item.ts             ← ProjectItem class
//       └── project-list.ts             ← ProjectList class
//
// EXPORT RULES: Only export what is needed by OTHER files. For example,
// the Listener type and State base class in project-state.ts are only
// used within that file, so they do NOT need to be exported. But the
// ProjectState class and the projectState instance constant DO need
// exporting because other files reference them.
//
// IMPORT RULES: Each file that uses something from another namespace
// file must add a /// <reference path="..."> at the top. Paths are
// RELATIVE to the importing file — so project-item.ts importing
// base-component.ts (in the same folder) uses just the filename,
// not "components/base-component.ts".
//
// SUBFOLDER ORGANIZATION: Files are renamed to drop redundant prefixes
// once they are inside a descriptive folder (e.g., "autobind-decorator.ts"
// becomes just "autobind.ts" inside the "decorators/" folder).
//
// After the refactor, app.ts shrinks to just reference imports and
// instantiation code. All the actual logic lives in focused, small files.
// The result compiles to a single bundle.js via outFile — the same
// output as before, but with a much more manageable source structure.

// ── MOVES TO: models/drag-drop.ts ──────────────────────────────────
// Exported: both interfaces (needed by ProjectItem, ProjectList)
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// ── MOVES TO: models/project.ts ────────────────────────────────────
// Exported: ProjectStatus enum and Project class (used across many files)
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

// ── MOVES TO: state/project-state.ts ───────────────────────────────
// Exported: ProjectState class and projectState instance constant
// NOT exported: Listener type and State base class (only used internally)
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

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
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(prj => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// ── MOVES TO: util/validation.ts ───────────────────────────────────
// Exported: Validatable interface and validate() function
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

// ── MOVES TO: decorators/autobind.ts ───────────────────────────────
// Exported: autobind function
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

// ── MOVES TO: components/base-component.ts ─────────────────────────
// Exported: Component abstract class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// ── MOVES TO: components/project-item.ts ───────────────────────────
// Exported: ProjectItem class
// Imports: /// <reference path="base-component.ts" />
//          (relative — same folder, so no "components/" prefix needed)
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

// ── MOVES TO: components/project-list.ts ───────────────────────────
// Exported: ProjectList class
// Imports: /// <reference path="base-component.ts" />
class ProjectList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      prjId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

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
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
  }
}

// ── MOVES TO: components/project-input.ts ──────────────────────────
// Exported: ProjectInput class
// Imports: /// <reference path="base-component.ts" />
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
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
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

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

// ── STAYS IN: app.ts (entry point) ─────────────────────────────────
// After the refactor, app.ts contains ONLY these instantiation lines
// plus /// <reference> imports for all the files above. Everything
// else lives in focused, single-purpose files under subfolders.
// All code is wrapped in "namespace App { ... }" and compiled to
// a single bundle.js via outFile.
const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
