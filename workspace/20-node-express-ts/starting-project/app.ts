// LESSON 248: ENTRY POINT FOR THE NODE.JS + TYPESCRIPT PROJECT.
// This file is the source the TypeScript compiler reads. Running
// `npm run compile` produces `dist/app.js`, which `npm start` then executes
// with Node.js.

// LESSON 250: REPLACING THE RAW HTTP SERVER WITH EXPRESS.JS.
// The previous lesson used Node's built-in `http` module directly. While that
// works, larger applications quickly get verbose — parsing URLs, matching
// methods, and formatting responses are all hand-rolled. Express is a thin
// framework that takes care of those concerns and is still the most widely
// adopted choice in the Node ecosystem. It is not, however, authored in
// TypeScript, so the compiler cannot know its API without help: we also
// install @types/express as a dev dependency to unlock editor autocompletion
// and type checking for `req` and `res`.
//
// Note the default-import style: `express` is the package's main export (a
// factory function), and `esModuleInterop` in tsconfig.json lets us bring it
// in with ordinary ES-module syntax even though the package itself ships as
// CommonJS.
import express from 'express';

// Calling the imported function returns a fresh application instance. Think
// of it as the object that owns all the routes, middleware, and the server
// lifecycle for this app.
const app = express();

// Route registration. `app.get` attaches a handler that only fires for HTTP
// GET requests matching the given path — here, the root URL "/". Express
// provides matching helpers for the other verbs (`post`, `put`, etc.), plus
// `app.use` for middleware that should run regardless of method/path.
app.get('/', (req, res) => {
  // The request object still exposes the raw HTTP method, which is useful
  // when debugging or inspecting traffic during development.
  console.log(req.method);

  // `res.json` serializes the value to JSON, sets the Content-Type header
  // to application/json, and sends the response in one step. `res.end`
  // (seen in the previous lesson) remains available, but `res.json` is
  // what you reach for when returning structured API data.
  res.json({ message: 'Hello World' });
});

// The application object itself knows how to start an HTTP server on the
// given port — no need to construct one manually with `createServer`.
app.listen(3000);
