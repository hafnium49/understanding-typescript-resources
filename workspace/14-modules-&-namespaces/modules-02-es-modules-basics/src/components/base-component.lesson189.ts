// LESSON 189 — IMPORT/EXPORT VARIATIONS: DEFAULT EXPORTS.
//
// Beyond the basic "import { Name } from ..." / "export class Name"
// pattern, ES modules offer several useful variations:
//
// 1. STAR IMPORTS (grouped imports):
//      import * as Validation from '../util/validation.js';
//    Collects every named export from the file into a single object.
//    Access members via dot notation: Validation.validate(...),
//    Validation.Validatable, etc. Useful for avoiding name clashes or
//    signalling that the functions belong to the same logical package.
//
// 2. ALIASED IMPORTS (the "as" keyword inside curly braces):
//      import { autobind as Autobind } from '../decorators/autobind.js';
//    Renames the import for use in THIS file only. The original export
//    name in the source file is unchanged. Helpful when a local name
//    already exists or when enforcing a naming convention.
//
// 3. DEFAULT EXPORTS — the focus of this file's change:
//
//    In a file with only one primary export, you can mark it as the
//    "default" export by adding the "default" keyword after "export":
//
//      export default class Component { ... }
//
//    Default exports are imported WITHOUT curly braces, and the importer
//    chooses any name they like — it does NOT need to match the exported
//    name:
//
//      import Component from './base-component.js';   // original name
//      import Cmp from './base-component.js';         // alternative name
//      import Anything from './base-component.js';    // also valid
//
//    A file may have AT MOST ONE default export. Named exports can
//    coexist alongside a default export — they are imported as usual
//    with curly braces:
//
//      import Component, { SOMETHING } from './base-component.js';
//
// RECOMMENDATION: Named exports are generally preferred over default
// exports because they enforce consistent naming across the codebase,
// provide better IDE autocompletion, and make it clear what is being
// imported. Default exports are convenient for single-export files but
// sacrifice naming consistency. This file demonstrates the syntax for
// completeness — production code typically sticks with named exports.

// Example of a named export coexisting with the default export below.
// The instructor mentions this briefly to show the two can be mixed in
// the same file — named exports still use curly braces when imported.
export const SOMETHING = 'something';

// Component Base Class — now exported as the DEFAULT export.
// Importers do not need curly braces and may choose any local name.
export default abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement
> {
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
