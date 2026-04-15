// LESSON 194 — SECTION INTRODUCTION: BUILD TOOLS FOR TYPESCRIPT PROJECTS.
//
// Up to this point, projects in this course have been small and built
// with the TypeScript compiler (tsc) alone. Real-world projects are
// typically more complex: multiple TypeScript files, HTML, CSS, images,
// environment-specific configuration, and a need for features like
// hot-reload during development, asset bundling, and production
// optimization. These demands go beyond what tsc provides on its own.
//
// This section explores alternative BUILD TOOLS that work alongside or
// replace tsc. The primary focus will be Vite — a modern, fast build
// tool that handles TypeScript compilation plus asset bundling, dev
// server, and production builds in a single integrated workflow.
//
// LESSON 195 — THE PROBLEM WITH USING ONLY tsc FOR A FRONTEND PROJECT.
//
// This project is a FRONTEND project (runs in the browser), so its
// source files include more than TypeScript: index.html, styles.css,
// and this app.ts. The tsconfig.json is configured with rootDir "./src"
// and outDir "./dist", and package.json defines a "build" script that
// runs "tsc" (invoked via `npm run build`).
//
// The problem: running `npm run build` produces a "dist" folder
// containing ONLY the compiled app.js. The HTML and CSS files are
// NOT copied over. Deploying just the dist folder would yield a broken
// site because the entry HTML and its stylesheet would be missing.
//
// Root cause: tsc is a TypeScript compiler, not a project builder. It
// only knows how to compile .ts (and optionally .js) files. It does not
// copy, bundle, or optimize other asset types. Section 15 will address
// this gap by introducing build tools (primarily Vite) that handle the
// full project pipeline.

const btn = document.querySelector('button')!;

btn.addEventListener('click', () => {
  console.log('Clicked!');
});
