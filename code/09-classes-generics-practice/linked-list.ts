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

// LISTNODE — a class representing a single node (data container).
// Defined first so it can be used as a type in LinkedList below.
// The node's internal structure (properties, value, next pointer)
// will be built out in a later lesson.
class ListNode {}

// LINKEDLIST — the main class that manages the chain of nodes.
// MAKING LINKEDLIST GENERIC — the add() method needs a flexible value type.
//
// The add() method should accept any kind of value (number, string, object,
// etc.), but using "any" loses type information and using "unknown" would
// require type guards everywhere. A GENERIC class is the ideal solution:
// the type is flexible when the class is defined, but concrete and precise
// when the class is instantiated.
class LinkedList<T> {
  private root?: ListNode;
  private length = 0;

  // ADD — accepts a value of the generic type T to be stored in the list.
  // The actual logic for creating a node and linking it into the chain
  // will be implemented in the next lesson.
  add(value: T) {
    // TODO: create a ListNode, store the value, link it into the chain
  }
}

// Each instantiation chooses a concrete type for T:
const numberList = new LinkedList<number>(); // T = number
const nameList = new LinkedList<string>();   // T = string

// numberList.add() now only accepts numbers.
// nameList.add() now only accepts strings.
// Same class, different types — determined at instantiation, not definition.
