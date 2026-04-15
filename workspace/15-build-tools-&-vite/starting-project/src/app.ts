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
//
// LESSON 196 — SOLUTIONS LANDSCAPE: FROM MANUAL SCRIPTS TO BUILD TOOLS.
//
// There are several ways to solve the "tsc doesn't copy HTML/CSS" gap:
//
// 1. A CUSTOM BUILD SCRIPT (JavaScript or shell) invoked alongside tsc
//    from the package.json "build" script. The script would copy HTML,
//    CSS, and other non-TS assets from ./src to ./dist. This works for
//    small projects but becomes brittle as projects grow.
//
// 2. WEBPACK — a long-established bundler that handles every asset type
//    (TS, JS, CSS, images, fonts, etc.), transforming and optimizing
//    them into a deployable output folder. Configuring Webpack is an
//    entire discipline on its own, but as a TypeScript developer you
//    typically work with a pre-configured setup rather than writing it
//    from scratch.
//
// 3. ESBUILD — a newer alternative to Webpack, written in Go, known
//    for dramatic build-speed improvements. It also handles TypeScript
//    compilation directly, so it can replace tsc as part of the build
//    pipeline. Popular as the engine inside modern meta-tools.
//
// The recurring theme: you rarely configure these tools yourself.
// Instead, you use project scaffolds that set them up for you. The
// next lesson introduces Vite — a widely used, pre-configured build
// tool that takes care of this entire pipeline in one package.

const btn = document.querySelector('button')!;

btn.addEventListener('click', () => {
  console.log('Clicked!');
});
