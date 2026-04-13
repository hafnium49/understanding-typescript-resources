// LESSON 187 — Each file imports exactly what it needs via ES modules.
// Same-folder imports use "./" prefix; parent-folder imports use "../".
// Multiple exports from one file can be imported in a single statement
// (e.g., { Validatable, validate } from the same validation.js file).
//
// LESSON 189 — IMPORT/EXPORT VARIATIONS:
//
// 1. GROUPED IMPORTS (star import):
//    Instead of importing individual named exports with curly braces,
//    you can import everything from a file as a single object:
//      import * as Validation from '../util/validation.js';
//    Then access members via dot notation: Validation.validate(...),
//    Validation.Validatable, etc. Useful for avoiding name clashes or
//    making it clear which "package" a function belongs to.
//
// 2. ALIASED IMPORTS (as keyword):
//    Inside curly braces, rename an import for use in this file only:
//      import { autobind as Autobind } from '../decorators/autobind.js';
//    The original export name is unchanged — the alias applies only in
//    the importing file. Useful for avoiding name clashes with local
//    identifiers or enforcing different naming conventions.
//
// 3. DEFAULT EXPORTS:
//    A file can mark one export as "default" using "export default":
//      export default class Component { ... }
//    The default export is imported WITHOUT curly braces and can be
//    given any name by the importer:
//      import Cmp from './base-component.js';
//    Only ONE default export is allowed per file. Named exports can
//    coexist with a default export in the same file.
//
// RECOMMENDATION: Named exports are generally preferred because they
// enforce consistent naming across the codebase, provide better IDE
// autocompletion, and make it clear what is being imported. Default
// exports are convenient for files with a single export but sacrifice
// naming consistency.
import { Component } from './base-component.js';
import { Validatable, validate } from '../util/validation.js';
import { autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
