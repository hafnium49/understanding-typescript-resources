// =====================================================================
// LESSON 232 — REACT + TYPESCRIPT — section overview.
// =====================================================================
//
// React and TypeScript are a common pairing in modern web development.
// This section covers how to use them together:
//   - Setting up a React + TypeScript project
//   - Typing React components (props, state, events)
//   - Common types you will encounter in React code
//   - Compiling and running the project
//
// PREREQUISITE: basic React knowledge. This section does NOT teach React
// from scratch — it only covers how to layer TypeScript on top of it.
// For learning React itself, see the official docs at https://react.dev
//
// =====================================================================
// LESSON 233 — CREATING THE PROJECT WITH VITE.
// =====================================================================
//
// This project was created using Vite's project scaffolder. To create
// a similar project from scratch, run:
//
//   npm create vite@latest
//
// The scaffolder prompts you for:
//   1. A project name (e.g., "react-ts")
//   2. A framework template — choose "React"
//   3. A language variant — choose "TypeScript"
//
// Vite generates a complete project folder with:
//   - tsconfig.json (references tsconfig.app.json and tsconfig.node.json
//     for more granular settings — defaults are suitable for most
//     projects, but can be tweaked if you know what you are doing)
//   - package.json with React, React-DOM, and @types/react(-dom) as
//     dependencies (the @types packages provide TypeScript definitions
//     for the React APIs)
//   - A src/ folder with a basic demo app (this file, main.tsx, etc.)
//   - vite.config.ts, eslint.config.js, and other config files
//
// REACT VERSION: the Vite template may generate a project for an older
// React version. To upgrade to the latest (e.g., React 19), run:
//
//   npm install react@latest react-dom@latest
//   npm install -D @types/react@latest @types/react-dom@latest
//
// This project already uses React 19 — see package.json. No upgrade
// is needed.
//
// SCRIPTS (defined in package.json):
//   npm run dev    — start a development server with hot-reload.
//                    Code is compiled on the fly in the background; the
//                    browser always runs the compiled JavaScript.
//                    Default URL: http://localhost:5173
//   npm run build  — produce a production-ready bundle, including
//                    full TypeScript-to-JavaScript compilation.
//   npm run preview— serve the production build locally for testing.
//
// Counter demo below: clicking the button increments the state — a
// basic confirmation that React + TypeScript is working end-to-end.
// =====================================================================

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
