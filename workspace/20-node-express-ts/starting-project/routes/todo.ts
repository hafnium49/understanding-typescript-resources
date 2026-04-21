// LESSON 252: FIRST EXPRESS ROUTE — CREATING A TODO.
// The Router helper is a tiny factory exposed by Express. The object it
// returns looks and behaves like the top-level `app` when it comes to route
// registration (`.get`, `.post`, `.patch`, etc.), but it is meant to be
// mounted into the real app later with `app.use(...)`. The payoff: each
// resource (todos, users, orders, ...) can own its routes in a dedicated
// file without `app.ts` having to know about the details.
import { Router } from 'express';

// Note on typing. When we pass an inline arrow function to `router.post` (or
// any of the HTTP-verb helpers), Express's own type definitions supply the
// `Request` and `Response` types for us — no explicit annotations needed.
// For a standalone handler function declared elsewhere, we would lose that
// inference and would have to import `Request` and `Response` from 'express'
// and annotate the parameters by hand. Both imports are available thanks to
// the `@types/express` package. `Request` is actually a generic type that
// lets you narrow `req.body`, `req.params`, etc., but in practice those
// generics are verbose, so most tutorials skip them.
import { addTodo } from '../data.js';

// One router per resource. This object collects every todo-related endpoint
// we register below, and gets mounted onto the application in `app.ts`.
const router = Router();

// Handle POST /todos. When the client sends a JSON body with a `text` field,
// we add a new todo to the in-memory store and echo the freshly created
// entry back in the response.
router.post('/todos', (req, res) => {
  // `req.body` is typed as `any` because Express cannot know ahead of time
  // what shape a body will take — that depends entirely on the client. The
  // upside is zero friction; the downside is that typos in property names
  // slip through unchecked, so read these values carefully. For the parsed
  // body to even exist, the `express.json()` middleware has to be mounted
  // on the app (done in app.ts).
  const text = req.body.text;
  const addedTodo = addTodo(text);

  // Structured JSON response. A human-readable `message` plus the created
  // entity under a `todo` key is a convenient convention that keeps the
  // response self-describing.
  res.json({ message: 'Todo added', todo: addedTodo });
});

// Exporting the router as the module's default export keeps the import on
// the consumer side ergonomic (`import todoRoutes from '...'`). A named
// export would also work — this is a style choice.
export default router;
