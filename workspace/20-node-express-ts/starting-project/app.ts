// LESSON 248: ENTRY POINT FOR THE NODE.JS + TYPESCRIPT PROJECT.
// This file is the source the TypeScript compiler reads. Running
// `npm run compile` produces `dist/app.js`, which `npm start` then executes
// with Node.js.

// LESSON 249: TURNING THE APP INTO A NODE.JS WEB SERVER.
// Node.js ships with a built-in `http` module, but the runtime itself is not
// written in TypeScript — so the compiler has no knowledge of its API out of
// the box. The fix is the same pattern we used with other untyped libraries
// earlier in the course: install a companion `@types/...` package as a dev
// dependency. With `@types/node` present, the editor and `tsc` can now see
// the shape of every core Node module, including `http`.
import { createServer } from 'node:http';

// `createServer` accepts a request handler. Node calls it for every incoming
// HTTP request, passing a request object (data about what the client sent)
// and a response object (what we send back). Thanks to the types we just
// installed, hovering over `req` and `res` in the editor will reveal their
// full APIs.
const server = createServer((req, res) => {
  // `req.method` is a string like "GET" or "POST". Logging it gives us a
  // simple server-side trace every time a request arrives.
  console.log(req.method);

  // `res.end(...)` finishes the response and sends the given body to the
  // client. It is distinct from `res.send()` from Express (covered later) —
  // the raw `http` module uses `end` as its built-in way to flush and close.
  res.end('Hello World');
});

// `listen` binds the server to a TCP port and starts accepting connections.
// Visiting http://localhost:3000 in a browser triggers the handler above.
server.listen(3000);
