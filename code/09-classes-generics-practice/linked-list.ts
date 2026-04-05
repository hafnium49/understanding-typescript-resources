// =====================================================================
// CLASSES & GENERICS PRACTICE — building a linked list data structure.
// =====================================================================
//
// This section applies classes and generic types together in a practical
// project: implementing a linked list. The linked list is a classic data
// structure that will be explained in the next lesson before coding begins.
//
// Key TypeScript features used in this project:
//   - Classes with private, public, and optional properties
//   - Generic classes (parameterized by <T>)
//   - Generic type inference from usage
//
// WHAT IS A LINKED LIST?
//
// A linked list is a data structure made up of NODES. Each node is a
// container that holds a value (a string, number, object, etc.) and a
// LINK (reference) to the next node in the sequence. The list is formed
// by chaining these nodes together — each node knows about its neighbor,
// but only its immediate neighbor.
//
// Conceptually:  [value|next] → [value|next] → [value|next] → null
//
// It is similar to an array in that it stores an ordered sequence of
// values, but differs in how values are stored and accessed internally.
// Inserting or removing elements in the middle can be more efficient
// than with an array (no shifting needed), but accessing an element
// by index requires walking through the chain from the start.
//
// Building one in TypeScript is a good exercise for combining classes
// (to represent nodes and the list) with generics (to allow any value
// type without losing type safety).
