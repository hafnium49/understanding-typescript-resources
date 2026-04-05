// =====================================================================
// CLASSES & GENERICS PRACTICE — building a linked list data structure.
// =====================================================================
//
// This section applies classes and generic types together in a practical
// project: implementing a linked list.
//
// WHAT IS A LINKED LIST?
//
// A linked list is a data structure made up of NODES. Each node holds a
// value and a LINK (reference) to the next node in the sequence.
//
// Conceptually:  [value|next] → [value|next] → [value|next] → null

// LISTNODE — a generic class representing a single node.
//
// Made generic with <T> so it can hold any type of value while
// preserving type safety. The type flows from LinkedList<T> → ListNode<T>
// so every node in a list holds the same kind of value.
class ListNode<T> {
  // NEXT — an optional link to the next node in the chain.
  // Typed as ListNode<T> (the same class, same generic type) so the
  // chain is type-consistent. Optional because the last node in the
  // list has no successor — its next is undefined.
  next?: ListNode<T>;

  // VALUE — the data stored in this node, created via the parameter
  // property shortcut. Public so it can be read from outside.
  constructor(public value: T) {}
}

// LINKEDLIST — a generic class managing the chain of nodes.
//
// T is the type of values stored in the list. When you instantiate
// with new LinkedList<number>(), T becomes number — the add() method
// only accepts numbers, and every ListNode holds a number.
class LinkedList<T> {
  // ROOT — the entry point to the chain. Forwarding <T> to ListNode
  // ensures the root node stores the same type as the list.
  private root?: ListNode<T>;
  private length = 0;

  // ADD — creates a new node and appends it to the end of the chain.
  add(value: T) {
    // Instantiate a new node. No need for new ListNode<T>(value) —
    // TypeScript infers T from the value parameter, which already
    // carries the concrete type from the LinkedList<T> class.
    const node = new ListNode(value);

    if (!this.root) {
      // FIRST ELEMENT: the list is empty (root is undefined).
      // The new node becomes the root — no linking needed.
      this.root = node;
    } else {
      // APPENDING: the list already has at least one node.
      // Walk the chain from root to the last node (the one whose
      // "next" is undefined). A while loop advances "current" one
      // node at a time until current.next is falsy (undefined),
      // meaning we reached the end.
      let current = this.root;
      while (current.next) {
        current = current.next;
      }
      // Link the last node to the new node — this extends the chain.
      current.next = node;
    }

    // Increment length regardless of whether it was the first or
    // a subsequent addition — one node was added either way.
    this.length++;
  }
}

// Each instantiation chooses a concrete type for T:
const numberList = new LinkedList<number>();
const nameList = new LinkedList<string>();
