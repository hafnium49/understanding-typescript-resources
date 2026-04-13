// LESSON 185 — COMPLETED NAMESPACE SPLIT with subfolder organization.
//
// All code has been moved out of this file into focused, single-purpose
// files organized in subfolders:
//
//   src/
//   ├── app.ts                    ← this file (entry point only)
//   ├── models/
//   │   ├── drag-drop.ts          ← Draggable & DragTarget interfaces
//   │   └── project.ts            ← ProjectStatus enum & Project class
//   ├── state/
//   │   └── project-state.ts      ← ProjectState class & instance
//   ├── util/
//   │   └── validation.ts         ← Validatable interface & validate()
//   ├── decorators/
//   │   └── autobind.ts           ← autobind decorator
//   └── components/
//       ├── base-component.ts     ← abstract Component base class
//       ├── project-input.ts      ← ProjectInput class
//       ├── project-item.ts       ← ProjectItem class
//       └── project-list.ts       ← ProjectList class
//
// Files were renamed to drop redundant prefixes once inside descriptive
// folders (e.g., "drag-drop-interfaces.ts" → "drag-drop.ts" in models/).
//
// Each file that depends on another adds its own /// <reference> import.
// Paths are relative — same-folder imports use just the filename,
// cross-folder imports use "../folder/file.ts".
//
// app.ts only imports the components it directly instantiates. Those
// components import their own dependencies internally.

/// <reference path="models/drag-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/project-state.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
