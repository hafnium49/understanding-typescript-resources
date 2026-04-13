// LESSON 182 — MODULES & NAMESPACES: section introduction.
//
// Up to this point in the course, code lived in a single file or in
// multiple unconnected files. This section introduces two approaches
// TypeScript provides for splitting code across multiple files while
// keeping them connected — so that a function defined in File A can
// be used in File B:
//
//   1. NAMESPACES — a TypeScript-specific feature for grouping code
//      under a named wrapper, connected via /// <reference> tags.
//
//   2. ES MODULES (import/export) — the standard JavaScript module
//      system, also fully supported by TypeScript.
//
// Both approaches will be explored in this section.
//
// LESSON 183 — WHY TWO APPROACHES?
//
// Namespaces exist because ES modules were not always part of JavaScript.
// TypeScript needed its own solution for code splitting before the
// standard import/export syntax was available. Namespaces use the
// "namespace" keyword to group related code — even code stored in
// different files — under one named group. TypeScript can then BUNDLE
// these separate files into a single JavaScript output file via the
// "outFile" setting in tsconfig.json, so only one file needs to be
// served in production.
//
// ES modules are now the standard JavaScript way to split code, using
// import/export syntax. TypeScript fully supports this approach as well.
// With ES modules, you can still bundle the output into a single file,
// but you would need an external build tool (e.g., Webpack) for that —
// TypeScript's built-in "outFile" bundling only works with namespaces.
//
// PROJECT SETUP:
//   - Download the attached zip, extract, run "npm install"
//   - "npm start" starts the dev server (serves index.html)
//   - In a separate terminal, run "tsc" or "tsc -w" (watch mode)
//     to compile TypeScript whenever you save changes
//
// This starting project already uses namespaces (the code is split
// across multiple files under src/ and connected via /// <reference>
// tags and the "namespace" keyword). The tsconfig uses "outFile" to
// bundle all namespace files into a single dist/bundle.js.

/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
