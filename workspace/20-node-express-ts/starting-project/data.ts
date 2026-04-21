// LESSON 251: IN-MEMORY TODO "DATABASE".
// To keep this section focused on Node + Express + TypeScript (and not on
// wiring up a real database), all todo items live in a plain JavaScript array
// held inside this module. That means the data lives only as long as the
// running process and is shared across every request/user hitting the server.
// Good enough for a learning demo — completely unsuitable for production.

// Describing the shape of a single todo with an interface gives the rest of
// the codebase a precise contract: every todo has a numeric `id` and a
// `text` string. Using `interface` vs `type` is a stylistic pick here; both
// would work the same.
interface Todo {
  id: number;
  text: string;
}

// `let` (not `const`) because `removeTodo` rebinds this variable to a fresh
// filtered array. The `Todo[]` annotation catches typos at compile time —
// writing `tid` instead of `id` on an inserted object would fail here rather
// than silently passing through as a loosely typed array entry.
let todos: Todo[] = [];

// Appending a new todo. The caller supplies just the text; the module assigns
// an id. `Math.random()` is obviously not a production-grade identifier (no
// uniqueness guarantees), but it is convenient for a demo and easy to swap
// out later for something like a UUID library.
export function addTodo(text: string) {
  const newTodo = {
    id: Math.random(),
    text: text,
  };
  todos.push(newTodo);
  // Returning the freshly stored object lets the caller (typically a route
  // handler) know exactly which id was assigned.
  return newTodo;
}

// Lookup by id. Array.prototype.find returns `undefined` when nothing matches,
// which would bubble up as a possibly-undefined value everywhere this function
// is called. Checking here — and throwing when the todo is missing — lets us
// advertise `getTodo` as a function that always yields a real Todo (or raises
// an error). That narrows the type used by downstream callers and removes a
// pile of `if (todo) { ... }` checks elsewhere.
export function getTodo(id: number) {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    throw new Error('Todo not found');
  }
  return todo;
}

// Deletion via filter: the callback returns true for items we want to keep.
// Comparing `todo.id !== id` keeps every todo except the one whose id matches,
// producing a new array that we assign back to `todos`.
export function removeTodo(id: number) {
  todos = todos.filter((todo) => todo.id !== id);
}

// Exposing the whole array so a future route can list everything at once.
export function getTodos() {
  return todos;
}

// Updating the text of an existing todo. Because objects in JavaScript are
// passed by reference, mutating `todo.text` here also mutates the same object
// still sitting inside the `todos` array — no need to splice and re-insert.
// The call to `getTodo` doubles as the "does this id exist?" guard; if it
// doesn't, `getTodo` throws and we never reach the assignment below.
export function updateTodo(id: number, newText: string) {
  const todo = getTodo(id);
  todo.text = newText;
  return todo;
}
