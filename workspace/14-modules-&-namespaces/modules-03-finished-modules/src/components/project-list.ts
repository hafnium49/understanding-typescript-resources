// LESSON 191 — TYPE-ONLY IMPORTS: annotating imports that are purely
// TypeScript constructs (interfaces, type aliases).
//
// Interfaces and types have no JavaScript equivalent — they are erased
// during compilation. You can mark such imports with the "type" keyword
// to signal this to TypeScript and any build tools:
//
//   Single item:   import { type DragTarget } from '...';
//   All items:     import type { DragTarget } from '...';
//
// The "type" keyword goes INSIDE the curly braces (per-item) or BEFORE
// the curly braces (when everything imported is a type).
//
// In most projects, this annotation is OPTIONAL — TypeScript already
// knows what is a type and what is a value. However, some build tools
// (e.g., certain Babel or SWC configurations) benefit from this hint
// because it helps them strip type-only imports without running a full
// TypeScript analysis. Some project setups may even require it.
//
// If your project needs it, the setup documentation will say so.
// Below, DragTarget is an interface (type-only), while Project and
// ProjectStatus include a class and an enum (both produce JavaScript),
// so only DragTarget gets the "type" annotation.
import { type DragTarget } from '../models/drag-drop.js';
import { Project, ProjectStatus } from '../models/project.js';
import Component from './base-component.js';
import { autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';

// ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement>
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
