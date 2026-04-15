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
//
// LESSON 197 — INTRODUCING VITE.
//
// Vite (https://vite.dev/) is a build tool and dev server designed for
// modern frontend projects. Rather than replacing Webpack or esbuild,
// Vite WRAPS one of them (typically esbuild under the hood for dev,
// and Rollup-based tooling for production builds) and exposes a
// cohesive, pre-configured experience on top.
//
// What Vite gives you out of the box:
//   - TypeScript support — no manual tsc invocation needed
//   - HTML, CSS, images, fonts, and other assets handled automatically
//   - Instant dev server with hot module replacement (changes appear
//     in the browser immediately on save, no full page reload)
//   - Optimized production builds with tree-shaking and minification
//   - Templates (presets) for common frameworks: React, Vue, Svelte,
//     Solid, Preact, Lit, and plain vanilla-TS projects
//
// The intent: you should not have to configure esbuild, Webpack, or
// Rollup directly as a TypeScript developer. Vite does that work for
// you. It is completely free and open-source.
//
// The NEXT lesson will walk through creating an actual Vite project
// (using the vanilla-ts preset) and see how it handles the HTML, CSS,
// and TypeScript files that tsc alone could not fully package.
//
// LESSON 198 — SCAFFOLDING A VITE VANILLA-TS PROJECT.
//
// The companion folder "../vite-demo-ts" was created by running:
//
//   npm create vite@latest vite-demo-ts -- --template vanilla-ts
//   cd vite-demo-ts
//   npm install
//   npm run build
//
// The "npm create vite@latest" command downloads and runs the Vite
// project scaffolder. With the --template vanilla-ts flag, it produces
// a plain TypeScript frontend project (no React/Vue/Svelte). Omitting
// the flag makes the command interactive: it prompts for a project
// name and template choice.
//
// DIFFERENCES FROM THIS starting-project FOLDER:
//
//   - index.html lives at the PROJECT ROOT (not inside src/). Vite
//     treats index.html as the entry point, not a static asset to copy.
//   - src/ contains main.ts (entry), counter.ts, style.css, and an
//     assets/ subfolder with SVG logos. A public/ folder at the root
//     holds static assets served as-is (favicon, icons).
//   - package.json lists "typescript" and "vite" as devDependencies,
//     and defines three scripts: "dev" (start dev server), "build"
//     (produce production bundle in dist/), "preview" (serve the
//     built output locally to verify).
//   - Running "npm run build" now produces a dist/ folder with
//     HTML, CSS, and JS — ALL assets copied and bundled, unlike
//     tsc which only produced app.js.
//
// OUTPUT STRUCTURE OF dist/ AFTER BUILD:
//   dist/index.html                    (copied & rewritten to point to hashed assets)
//   dist/assets/index-<hash>.js        (bundled + minified TypeScript output)
//   dist/assets/index-<hash>.css       (bundled + minified CSS)
//   dist/assets/<name>-<hash>.svg/png  (processed static images)
//
// The hashed filenames (e.g., "index-BZHxPfsZ.js") are Vite's cache-
// busting strategy: when you rebuild, changed files get new hashes,
// so browsers and CDNs automatically fetch the new version instead
// of serving a stale cached copy.
//
// WHY TYPESCRIPT IS STILL IN devDependencies:
//
// Vite uses esbuild (or similar) to compile TypeScript for speed,
// but the "build" script also invokes "tsc" (as `tsc && vite build`)
// to perform full TYPE CHECKING — esbuild only strips types, it does
// not check them. So TypeScript is still needed as a dev dependency
// to catch type errors before production builds ship.
//
// LESSON 199 — DEV DEPENDENCIES VS. GLOBAL INSTALLATION.
//
// A frequent question: if TypeScript is already installed globally
// (via "npm install -g typescript"), why list it as a devDependency
// in each project? Two concrete reasons:
//
//   1. PORTABILITY: The build script works on any machine without
//      a global tsc install. A CI pipeline, a new teammate's laptop,
//      or a Docker image just runs "npm install" and gets the exact
//      compiler the project expects.
//
//   2. PER-PROJECT VERSION PINNING: Different projects can pin to
//      different TypeScript versions. If one legacy project is stuck
//      on TS 4.x (upgrading would break it) while a new project
//      needs the latest, both can coexist because each reads its
//      own package.json devDependencies — not a shared global install.
//
// The global tsc is mainly useful for ad-hoc experimentation outside
// any project. Inside a project, the local devDependency wins.
// (See vite-demo-ts/package.json for the per-project devDependency
// entries and their version specifiers.)
//
// LESSON 200 — TYPESCRIPT DECLARATION FILES (.d.ts).
//
// A ".d.ts" file (DECLARATION file) contains TYPE INFORMATION ONLY —
// no executable code. It compiles to nothing. Its job is to describe
// the shape of types that live elsewhere (often in third-party
// JavaScript libraries) so TypeScript and the IDE can provide type
// checking and autocompletion.
//
// Two common forms:
//
//   1. A triple-slash reference directive at the top of a .d.ts file:
//        /// <reference types="some-package" />
//      Pulls in the type declarations from that package globally.
//
//   2. A "declare module" block that describes the types a library
//      exports, used when a package ships without its own .d.ts.
//
// You rarely write .d.ts files yourself in application code. They
// matter most when BUILDING A LIBRARY and wanting to ship types
// alongside the compiled JavaScript output.
//
// See vite-demo-ts/src/vite-env.d.ts for a live example that
// references Vite's own type declarations — enabling main.ts to
// import CSS/SVG/PNG files as modules with full type safety.
//
// LESSON 201 — NON-CODE IMPORTS ARE A VITE FEATURE, NOT TYPESCRIPT.
//
// Inside vite-demo-ts/src/main.ts you will see statements like:
//
//   import './style.css'
//   import heroImg from './assets/hero.png'
//   import { setupCounter } from './counter.ts'
//
// None of these would be legal in plain TypeScript or Node.js:
//
//   - Importing a .css file for side effects is a BUNDLER CONVENTION.
//     Vite scans the import, bundles the stylesheet, and injects a
//     <link> tag into the built HTML. The CSS never ends up in the
//     compiled JavaScript.
//   - Importing an image (.png, .svg, etc.) evaluates to a URL
//     STRING. Vite processes the asset, copies it to dist/assets/
//     with a hashed name, and gives your code the final URL to use.
//   - Including the ".ts" extension in the import path is permitted
//     because Vite (and the "allowImportingTsExtensions" compiler
//     flag) allow it; classic tsc/Node setups use ".js" instead.
//
// KEY POINT: these capabilities come from VITE, not from TypeScript.
// TypeScript's role is just to know the shape of what these imports
// evaluate to (via the vite/client type declarations). The actual
// resolution, transformation, and bundling is done by the build
// tool at compile and dev-server time.
//
// You can confirm this by inspecting the built output: searching
// "index-<hash>.js" in dist/ for ".css" finds nothing — Vite
// rewrote every non-JS import into a reference to the bundled
// asset file before writing the final JavaScript.
//
// LESSON 202 — SECTION WRAP-UP.
//
// Section 15 recap in a single paragraph:
//
// Plain tsc is sufficient only for compiling TypeScript to JavaScript.
// Real frontend projects also contain HTML, CSS, images, and other
// assets that need to be copied, transformed, or bundled — work that
// belongs to a DEDICATED BUILD TOOL. You could wire up Webpack or
// esbuild yourself, but most teams use pre-configured scaffolders
// instead. VITE is the current go-to: one command scaffolds a
// project, "npm install" pulls in dependencies, "npm run dev" gives
// you a hot-reloading dev server, and "npm run build" produces a
// hashed, minified dist/ folder ready to deploy. Vite handles
// TypeScript compilation (via esbuild), bundles CSS, processes
// image assets, and rewrites your source imports into references
// to the final built artifacts.
//
// Key takeaways to carry forward:
//   - You rarely need to configure build tools directly as a
//     TypeScript developer — pick a scaffolder, use its defaults.
//   - TypeScript stays as a devDependency even when globally
//     installed (portability + per-project version pinning).
//   - .d.ts files hold type-only declarations (no runtime output).
//   - Non-TypeScript imports (CSS, images, etc.) are a BUILD-TOOL
//     feature, not a language feature.
//
// The rest of the course will use Vite (or similar tools) where
// appropriate rather than compiling with plain tsc, matching
// real-world project setups.

const btn = document.querySelector('button')!;

btn.addEventListener('click', () => {
  console.log('Clicked!');
});
