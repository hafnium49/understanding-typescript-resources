/// <reference types="vite/client" />

// LESSON 200 — TYPESCRIPT DECLARATION FILES (.d.ts).
//
// Files ending in ".d.ts" are TypeScript DECLARATION FILES. They
// differ from regular .ts files in one key way:
//
//   - A .ts file contains EXECUTABLE code — variables, functions,
//     classes — that compiles down to JavaScript.
//   - A .d.ts file contains ONLY type information — type aliases,
//     interfaces, ambient module declarations, namespace shims.
//     It compiles to NOTHING. No JavaScript output is produced.
//
// Declaration files exist purely to inform the TypeScript compiler
// (and your editor) about types that live somewhere else — typically
// in third-party JavaScript libraries that were not written in
// TypeScript but still want to offer type safety to consumers.
//
// THE TRIPLE-SLASH REFERENCE DIRECTIVE:
//
// The "/// <reference types="..." />" line above is a special
// TypeScript directive (NOT a regular comment, despite the slashes).
// It tells TypeScript to include the ambient type declarations from
// another package — here, "vite/client" — as if they were declared
// in the current project.
//
// Opening "vite/client" (Ctrl/Cmd-click in an IDE) jumps to Vite's
// own client.d.ts inside node_modules/vite/. That file uses
// "declare module ..." statements to describe Vite-specific features
// like import.meta.env, import.meta.hot, and the ability to import
// CSS/SVG/PNG files as modules — giving main.ts type-safe access
// to those imports without runtime code.
//
// ALTERNATIVE: This project's tsconfig.json also has
// "types": ["vite/client"], which achieves the same effect via
// compiler config instead of a reference directive. You typically
// pick one approach, not both; keeping both is harmless but redundant.
//
// WHEN YOU MIGHT WRITE YOUR OWN .d.ts FILE:
//
//   1. You are building a LIBRARY and want to ship type definitions
//      alongside your compiled JavaScript so that consumers get
//      autocompletion and type checking.
//   2. You are using a third-party JavaScript library that does not
//      provide its own types (and no @types/* package exists).
//   3. You want to declare GLOBAL type augmentations (e.g., adding
//      a custom property to the Window interface).
//
// For most application code, you will never need to write a .d.ts
// file — you will just consume ones provided by your dependencies.
