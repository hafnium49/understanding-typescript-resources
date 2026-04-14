import { Project, ProjectStatus } from '../models/project.js';

// LESSON 190 — ES MODULE EXECUTION: a file's top-level code runs
// ONCE, the first time ANY file imports it.
//
// This file exports the projectState constant (created at the bottom).
// Multiple files import it — both project-input.ts and project-list.ts.
// You might expect the code here to execute once per import statement,
// creating two separate instances. But that is NOT how ES modules work.
//
// The JavaScript runtime evaluates a module's top-level code exactly
// once, on the first import. All subsequent imports from other files
// receive a reference to the SAME already-evaluated exports. This means
// the ProjectState singleton is created only once, and every file that
// imports projectState gets the same shared instance.
//
// This behavior is essential for patterns like shared state management:
// if each import created a new instance, project-input and project-list
// would be working with separate, disconnected state objects.
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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

console.log('ProjectState module evaluated. Singleton instance created.');

export const projectState = ProjectState.getInstance();
