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
// The starting project was generated with Vite (https://vite.dev) using
// its React + TypeScript template. Vite handles the build pipeline,
// development server, and TypeScript compilation automatically.
//
// To run the dev server: npm run dev
// To build for production: npm run build
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
