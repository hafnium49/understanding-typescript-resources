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
