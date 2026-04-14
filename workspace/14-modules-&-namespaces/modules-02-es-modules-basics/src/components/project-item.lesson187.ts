// LESSON 187 — Converted from namespaces to ES MODULES.
//
// ES MODULES fix the main weakness of namespaces: dependencies become
// EXPLICIT. Each file must import exactly what it uses, and missing an
// import produces a compile error — unlike namespaces, where a file
// could silently rely on something loaded by an unrelated file (fragile:
// removing the "other" file could break this one without touching it
// directly).
//
// IMPORT SYNTAX:
//
//   import { Name } from './relative/path.js';
//
// - Braces list the specific named exports you want from that file.
//   Multiple names can be imported together, separated by commas.
// - The path is relative to THIS file: "./" means the same folder,
//   "../" means one level up.
// - The ".js" extension is REQUIRED here — even though the source is
//   .ts, the imports will be resolved by the browser against the
//   compiled .js output. TypeScript leaves these specifiers unchanged.
//   (Build tools like Webpack let you omit the extension; without one,
//   you must include .js.)
//
// The "export" keyword below is standard JavaScript — it marks the
// class as importable from other files. TypeScript picks up the same
// keyword; it was also used with namespaces, but here it has its
// native JavaScript meaning (no enclosing namespace wrapper needed).
//
// TSCONFIG CHANGES for ES modules:
//   - "module" set to "es2015" (or higher) — keep imports as-is
//   - "target" at "es6" or higher
//   - "outFile" commented out (not supported with ES modules)
// INDEX.HTML: the <script> tag loading the entry file must add
//   type="module" so the browser parses import statements.

import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind.js';

// ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
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
