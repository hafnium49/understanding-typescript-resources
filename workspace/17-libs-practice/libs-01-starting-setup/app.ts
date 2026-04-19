// =====================================================================
// LESSON 214 — USING TYPESCRIPT WITH JAVASCRIPT LIBRARIES (overview).
// =====================================================================
//
// Real TypeScript projects rarely consist of only TypeScript code. They
// typically rely on third-party npm packages — for HTTP requests, date
// formatting, UI rendering, utilities, and countless other needs.
//
// This section explores how TypeScript interacts with external libraries
// and the common challenges that arise:
//
//   1. JAVASCRIPT-ONLY LIBRARIES
//      Libraries originally written in plain JavaScript (no TypeScript
//      types built in). TypeScript does not know what functions these
//      libraries expose or what types they return — so you need TYPE
//      DECLARATION FILES (.d.ts) to bridge the gap. Often these are
//      provided by the community via the @types/* scope on npm.
//
//   2. .d.ts FILES
//      Declaration files contain ONLY type information — no runtime
//      logic. They describe the shape of existing JavaScript code so
//      TypeScript can type-check your usage of it. Understanding what
//      these files look like and how they work is important even if
//      you never write one yourself.
//
//   3. TYPESCRIPT-FIRST LIBRARIES
//      Libraries written in TypeScript (or shipped with built-in .d.ts
//      files). These integrate seamlessly — no extra @types package
//      needed. Some are so TypeScript-oriented that they exploit
//      advanced type features and are mostly useful within TS projects.
//
// No code is written in this introductory lesson. Subsequent lessons
// will install actual packages and demonstrate each scenario.
