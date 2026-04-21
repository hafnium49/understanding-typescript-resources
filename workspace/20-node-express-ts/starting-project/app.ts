// LESSON 248: ENTRY POINT FOR THE NODE.JS + TYPESCRIPT PROJECT.
// This file is the source the TypeScript compiler reads. Running
// `npm run compile` produces `dist/app.js`, which `npm start` then executes
// with Node.js.

// LESSON 250: REPLACING THE RAW HTTP SERVER WITH EXPRESS.JS.
// Express is installed alongside `@types/express` so the compiler understands
// its API. The default-import style works here thanks to `esModuleInterop`
// in tsconfig.json.
import express from 'express';

// LESSON 252: MOUNTING THE TODO ROUTES.
// The router from routes/todo.ts collects every todo endpoint. Importing it
// here lets the application layer hand off matching requests to that module.
//
// Notice the `.js` extension in the import path even though the source file
// is a .ts file. With `module: NodeNext`, TypeScript follows Node's ESM
// resolution rules, which require a concrete file extension — and it expects
// the extension of the *emitted* JavaScript, not the TypeScript input.
// Forgetting this (or writing `.ts`) is a classic early mistake.
import todoRoutes from './routes/todo.js';

const app = express();

// LESSON 252: BODY PARSING MIDDLEWARE.
// Express does not read request bodies by default. `express.json()` returns
// a middleware function that, for every incoming request, checks for a JSON
// Content-Type, reads and parses the payload, and exposes the result on
// `req.body`. It must be registered *before* any route that expects
// `req.body` to be populated — middleware runs in the order it is added.
app.use(express.json());

// LESSON 252: ATTACHING THE RESOURCE ROUTES.
// `app.use(todoRoutes)` makes every route registered on the todo router a
// real route on the application. We could also pass a path prefix here
// (e.g. `app.use('/api', todoRoutes)`) to namespace the endpoints; omitting
// the prefix mounts them at the root.
app.use(todoRoutes);

app.listen(3000);
