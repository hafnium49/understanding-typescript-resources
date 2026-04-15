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
import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
