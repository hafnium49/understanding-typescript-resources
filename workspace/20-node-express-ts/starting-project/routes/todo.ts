// LESSON 252: FIRST EXPRESS ROUTE — CREATING A TODO.
// The Router helper is a tiny factory exposed by Express that returns an
// object with the same route-registration methods as the main `app`. It
// gets mounted into the real app later with `app.use(...)`, which lets each
// resource (todos, users, etc.) own its routes in a dedicated file.
import { Router } from 'express';

// LESSON 253: IMPORTS FOR THE REMAINING CRUD HELPERS.
// Each HTTP verb below delegates to one of these pure functions so the
// handlers stay thin: they translate between HTTP and the in-memory store.
//
// LESSON 254: EXTENSION CHANGES FROM .js TO .ts.
// We now rely on Node.js's native TypeScript support, so there is no .js
// output to import from — the .ts source file is what actually exists.
// Enabled by `allowImportingTsExtensions` in tsconfig.json.
import {
  addTodo,
  getTodos,
  getTodo,
  updateTodo,
  removeTodo,
} from '../data.ts';

const router = Router();

// POST /todos — create a new todo from a JSON body like { "text": "..." }.
router.post('/todos', (req, res) => {
  // `req.body` is typed `any` (see lesson 252 notes): Express can't know in
  // advance what a client might post. The `express.json()` middleware in
  // app.ts is what parses the body into this object in the first place.
  const text = req.body.text;
  const addedTodo = addTodo(text);
  res.json({ message: 'Todo added', todo: addedTodo });
});

// LESSON 253: LIST ALL TODOS.
// `getTodos` returns the whole in-memory array. Wrapping it under a `todos`
// key keeps the JSON response self-describing and leaves room for future
// metadata (e.g. `{ todos, totalCount }`) without breaking existing clients.
router.get('/todos', (req, res) => {
  const todos = getTodos();
  res.json({ todos: todos });
});

// LESSON 253: FETCH A SINGLE TODO BY ID.
// The `:id` segment is Express's placeholder syntax; Express extracts the
// actual value into `req.params.id`. TypeScript even understands the
// parameter name, so mistyping `req.params.ids` would be flagged — a nicer
// experience than the `any`-typed `req.body`.
//
// Everything inside a URL arrives as a string. Our data helper wants a
// number, so we coerce with a leading `+`. Without that conversion, the
// compiler (correctly) refuses to let a `string` pass where a `number`
// is required — a small concrete example of TypeScript catching a bug that
// would otherwise surface only at runtime.
router.get('/todos/:id', (req, res) => {
  // `getTodo` throws when the id does not exist. We deliberately let that
  // error bubble up; the global error-handling middleware in app.ts will
  // intercept it and send back a 500 response.
  const todo = getTodo(+req.params.id);
  res.json({ todo: todo });
});

// LESSON 253: UPDATE THE TEXT OF AN EXISTING TODO.
// PATCH is the semantically correct verb here because we are modifying one
// field of an existing resource rather than replacing the entire thing
// (which would be PUT). `updateTodo` returns the updated entry so the
// response can echo back the new state.
router.patch('/todos/:id', (req, res) => {
  const updatedTodo = updateTodo(+req.params.id, req.body.text);
  res.json({ message: 'Todo updated', todo: updatedTodo });
});

// LESSON 253: DELETE A TODO BY ID.
// The `delete` method on the router follows the same pattern as the others.
// The response simply confirms the operation — clients that need the list to
// reflect the change re-fetch it afterwards.
router.delete('/todos/:id', (req, res) => {
  removeTodo(+req.params.id);
  res.json({ message: 'Todo deleted' });
});

export default router;
