// LESSON 198 — Vite's entry module. Plain tsc would reject most of
// these imports because they reference non-TypeScript files (CSS,
// SVG, PNG). Vite understands them: it bundles the CSS, inlines or
// copies images into dist/assets/ with hashed filenames, and gives
// each import a URL string the bundled code can use at runtime.
// This file-type flexibility is exactly what tsc lacked in the
// starting-project folder.
//
// LESSON 201 — A CLOSER LOOK AT THE VITE IMPORT SYNTAX.
//
// Four things worth noticing in the import block below:
//
//   1. SIDE-EFFECT CSS IMPORT — "import './style.css'" has no names
//      after "import" and no "from" clause with bindings. It runs
//      the file purely for its side effects. At build time, Vite
//      scans this, bundles the CSS, and links the bundled output
//      from the generated index.html. The CSS itself never appears
//      in the compiled JavaScript.
//
//   2. ASSET IMPORTS (SVG/PNG) — "import heroImg from './...png'"
//      looks like importing a module but is actually how Vite
//      exposes static assets. At build time the file is processed
//      (possibly resized, optimized, or inlined for small files)
//      and the import evaluates to a URL STRING pointing at the
//      final hashed asset under dist/assets/. You use heroImg
//      anywhere a URL is expected (img src, CSS background, etc.).
//
//   3. ".ts" EXTENSION IN THE IMPORT PATH — "./counter.ts" works
//      because Vite (and tsconfig's allowImportingTsExtensions)
//      accept the TypeScript extension. In a plain Node/tsc setup
//      you would typically write "./counter.js" (the compiled
//      output name) instead.
//
//   4. INSPECTABILITY — none of these import paths survive into
//      the compiled dist/assets/index-<hash>.js. Vite rewrites them
//      into direct references to the bundled/hashed files. This is
//      pure build-tool magic, not a TypeScript language feature.
import './style.css'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src=${viteLogo} class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>
  <button id="counter" type="button" class="counter"></button>
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank">
          <img class="logo" src=${viteLogo} alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img class="button-icon" src="${typescriptLogo}" alt="">
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
      <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
      <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
