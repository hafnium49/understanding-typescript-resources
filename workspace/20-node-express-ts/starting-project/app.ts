// LESSON 248: ENTRY POINT FOR THE NODE.JS + TYPESCRIPT PROJECT.
// This file is the source the TypeScript compiler reads. Running
// `npm run compile` produces `dist/app.js`, which `npm start` then executes
// with Node.js.

// LESSON 250: REPLACING THE RAW HTTP SERVER WITH EXPRESS.JS.
// Express is installed alongside `@types/express` so the compiler understands
// its API. The default-import style works here thanks to `esModuleInterop`
// in tsconfig.json.
//
// LESSON 253: ALSO GRABBING REQUEST / RESPONSE / NEXTFUNCTION TYPES.
// The error-handling middleware below is declared with a plain function
// expression rather than inline inside a route helper, so Express can no
// longer infer the parameter types for us. These named imports come from
// @types/express and let us annotate the middleware explicitly.
//
// LESSON 254: TYPE-ONLY IMPORTS GET THE `type` KEYWORD.
// `Request`, `Response`, and `NextFunction` are interfaces — they exist only
// inside TypeScript and have no runtime value. With `verbatimModuleSyntax`
// turned on, every such import must be marked explicitly so Node's built-in
// type stripper can safely erase it before execution. `express` itself is a
// real runtime value (the factory function), so it stays a plain import.
import express, { type Request, type Response, type NextFunction } from 'express';

// LESSON 252: MOUNTING THE TODO ROUTES.
// LESSON 254: EXTENSION SWITCHES FROM .js TO .ts.
// Because we are no longer compiling to a `dist/` folder, the file on disk
// really is `./routes/todo.ts`. The `allowImportingTsExtensions` compiler
// option (enabled in tsconfig.json) is what lets us reference the source
// path directly.
import todoRoutes from './routes/todo.ts';

const app = express();

// LESSON 252: BODY PARSING MIDDLEWARE.
// Must run before any route that reads `req.body`. Middleware runs in
// registration order, so this line has to stay above the route mount below.
app.use(express.json());

// LESSON 252: ATTACHING THE RESOURCE ROUTES.
app.use(todoRoutes);

// LESSON 253: GLOBAL ERROR-HANDLING MIDDLEWARE.
// Express recognises a middleware as an error handler by its arity: exactly
// four declared parameters (`err, req, res, next`). Whenever a synchronous
// route handler throws — for instance when `getTodo` cannot find the
// requested id — Express skips the remaining regular middleware and hands
// the error to this function. Returning a 500 with a generic message is a
// reasonable default; a production app would branch on the error type and
// status (404 for "not found", 400 for invalid input, and so on).
//
// `next` must appear in the signature for Express to spot the error-handler
// shape, even though we don't call it here. Calling `next(err)` would forward
// the error to any subsequent error handlers; plain `next()` would resume
// the regular middleware chain.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: 'An error occurred.' });
});

app.listen(3000);
