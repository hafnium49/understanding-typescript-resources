// LESSON 203 — SECTION INTRODUCTION: USING WEBPACK WITH TYPESCRIPT.
//
// CONTEXT (from the section preamble):
//
// This section was recorded several years ago, when Webpack was the
// dominant build tool in the frontend ecosystem. Since then, newer
// tools (notably Vite, covered in Section 15) have taken over much
// of that space. Webpack is still widely used in existing projects,
// but for new projects you will more often see a Vite-based setup.
//
// IN PRACTICE:
//
// Even when a project uses Webpack, you typically will NOT configure
// Webpack yourself. Framework CLIs, starter templates, and scaffolders
// (similar to how "npm create vite@latest" handles Vite) generate
// the Webpack setup for you. Day-to-day work centers on writing
// TypeScript, not tweaking webpack.config.js.
//
// WHY THIS SECTION IS STILL RELEVANT:
//
//   1. You may need to maintain or extend an existing Webpack
//      project at a real job.
//   2. Understanding how a bundler loads, transforms, and bundles
//      TypeScript gives you transferable insight into other tools
//      (Vite, esbuild, Rollup, Parcel, etc.).
//   3. Webpack's core concepts (entry, output, loaders, plugins,
//      mode) map almost 1:1 to ideas in every modern bundler.
//
// Feel free to skim or watch at 2x speed if Webpack is not part of
// your current stack. The TypeScript lessons that follow do not
// depend on Webpack-specific knowledge.
//
// ENTRY POINT: this file boots the application by importing the
// ProjectInput and ProjectList components and instantiating them.
// Subsequent lessons in this section wire Webpack up to bundle
// these imports into a single deployable JavaScript file.
//
// LESSON 204 — WHY WEBPACK? THE MULTI-FILE PROBLEM.
//
// In earlier course sections, the same project (a drag-and-drop
// task board) was built in two different ways:
//
//   - ONE GIANT FILE: all classes, state, utilities, and bootstrap
//     code lived in a single app.ts. The browser loaded one script;
//     no extra tooling was needed, but the file became unreadable
//     and unmaintainable as it grew.
//
//   - MULTIPLE FILES via NAMESPACES / ES MODULES: code was split
//     by responsibility (components/, state/, models/, util/,
//     decorators/) to stay manageable. Readability improved, but
//     this introduced a NEW problem specific to browsers: each
//     imported module becomes a SEPARATE NETWORK REQUEST when the
//     page loads. A large module graph can mean dozens of HTTP
//     requests, slowing down first-load performance noticeably.
//
// WEBPACK'S ROLE:
//
// Webpack is a BUNDLER. At build time it walks the import graph
// starting from an entry file (this app.ts), follows every import,
// and concatenates the whole module tree into a small number of
// output files (often just one). The browser then fetches that
// single bundle in one request instead of many.
//
// In addition, Webpack can:
//   - Run TypeScript through a loader (ts-loader) so the browser
//     receives plain JavaScript without a separate tsc step.
//   - Minify, tree-shake, and fingerprint the output for production.
//   - Serve a local dev server with live reload during development.
//
// The rest of this section configures Webpack step by step to
// achieve this: keep the multi-file source layout shown above,
// but ship a single bundled file to the browser.
import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
