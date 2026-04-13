// LESSON 184 — First file extracted from app.ts using namespaces.
//
// The "namespace" keyword wraps this code in a named group. It is a
// TypeScript-only feature — there is no JavaScript equivalent. Under
// the hood, TypeScript compiles it to an object whose exported members
// become properties.
//
// The namespace name MUST match across all files that need to share
// code. Here it is "App" — the same name used in app.ts and
// project-model.ts. Namespaces with the same name are merged by
// TypeScript during compilation, allowing exported features to be
// used seamlessly across files.
//
// The "export" keyword inside a namespace makes a feature available
// to other files in the same namespace. Without export, the feature
// is private to this namespace block. You can export interfaces,
// classes, functions, constants — anything.
namespace App {
  export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }

  export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
  }
}
