// LESSON 192 — SECTION SUMMARY: ES modules vs namespaces, and why
// bundling matters.
//
// RECOMMENDATION: Use ES modules over namespaces for all but the
// smallest projects. ES modules provide compile-time safety (missing
// imports produce errors) and force each file to explicitly declare
// its dependencies. Namespaces are acceptable for tiny projects or
// when ES modules are not an option and no bundler is available.
//
// LIMITATION OF THE CURRENT SETUP: the browser downloads each .js
// file individually as it encounters import statements. This has two
// problems:
//
//   1. BROWSER SUPPORT — older browsers (e.g., IE9) do not support
//      ES module syntax at all. The app simply will not run there.
//
//   2. PERFORMANCE — every file is a separate HTTP request. Each
//      request has setup overhead (connection negotiation) regardless
//      of file size. Many small files can be slower than one larger
//      file due to this per-request cost. (You can observe this in the
//      browser's Network tab as a "waterfall" of sequential requests.)
//
// SOLUTION: a bundling tool like Webpack. It combines all the separate
// module files into a single JavaScript file for production. During
// development you keep the multi-file ES module experience (with full
// type checking and explicit imports). When you ship, Webpack produces
// one optimized bundle that works in all browsers and requires only a
// single HTTP request. Webpack integration is covered in the next
// course section.
//
// LESSON 193 — FURTHER READING:
// - JS module systems overview (CommonJS, AMD, ES6):
//   https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b
// - MDN guide on ES Modules (import/export, dynamic imports, etc.):
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
