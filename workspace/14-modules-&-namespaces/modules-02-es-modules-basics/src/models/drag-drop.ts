// LESSON 187 — Conversion from namespaces to ES modules:
// The "namespace App { ... }" wrapper was removed. The "export" keyword
// stays — it is standard JavaScript syntax that works with both
// namespaces and ES modules. No imports are needed here because these
// interfaces have no dependencies on other files.

export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
