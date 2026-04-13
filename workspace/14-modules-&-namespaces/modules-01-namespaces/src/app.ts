// LESSON 186 — NAMESPACE IMPORT BEST PRACTICE: every file should
// import its own dependencies.
//
// It might seem convenient to put ALL /// <reference> imports here in
// app.ts (the entry point), since everything ultimately gets bundled.
// That approach works initially — but it is fragile. If you later
// remove an import from app.ts that a component still depends on, you
// get NO compile-time error. Instead, you get a RUNTIME error because
// the dependency is missing from the bundle at the point where it is
// needed. TypeScript cannot catch this during compilation.
//
// The proper approach: each file imports everything IT needs via its
// own /// <reference> directives. This way, each file is self-contained
// — it declares exactly what it depends on, and removing an import from
// one file does not silently break another.
//
// app.ts only needs to import the components it directly instantiates.
// Those components, in turn, import their own dependencies (autobind,
// validation, project-state, models, base-component, etc.).

/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
