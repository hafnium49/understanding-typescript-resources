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
  private root?: ListNode<T>;

  // TAIL — stores the LAST node in the chain. Without this, appending
  // a new node requires walking the entire chain from root to the end
  // (O(n) time). With tail, we can jump directly to the last node and
  // link the new node in O(1) — a significant efficiency improvement
  // as the list grows.
  private tail?: ListNode<T>;
  private length = 0;

  add(value: T) {
    const node = new ListNode(value);

    // Check both root AND tail — they should both be undefined when
    // the list is empty. The extra "|| !this.tail" check tells
    // TypeScript that tail is guaranteed to be defined in the else
    // branch, avoiding a "possibly undefined" error on this.tail.next.
    if (!this.root || !this.tail) {
      // FIRST ELEMENT: the new node is both the root (start of chain)
      // and the tail (end of chain) — it is the only node.
      this.root = node;
      this.tail = node;
    } else {
      // APPENDING WITH TAIL: instead of walking the chain with a
      // while loop (as in the previous lesson), we directly access
      // the tail node and link the new node to it.
      this.tail.next = node;

      // Update tail to point to the newly added node — it is now
      // the last node in the chain. The OLD tail's "next" property
      // was just set to point to this node (the line above), so the
      // chain is consistent.
      this.tail = node;
    }

    this.length++;
  }

  // GETNUMBEROFELEMENTS — a public method that exposes the private
  // length property. This is a common pattern: keep the property
  // private so it cannot be modified from outside the class, but
  // provide a public method that returns its value for reading.
  getNumberOfElements() {
    return this.length;
  }

  // PRINT — walks the entire chain and outputs each node's value.
  // Unlike the add method (which only needs the tail), printing
  // requires visiting every node from root to the end.
  //
  // The loop checks "current" itself (not current.next) — this way
  // the loop body runs for every node including the last one, then
  // exits when current becomes undefined after the last node's next.
  print() {
    let current = this.root;
    while (current) {
      console.log(current.value);
      current = current.next;
    }
  }
}

const numberList = new LinkedList<number>();

numberList.add(10);
numberList.add(5);
numberList.add(-3);

console.log('Length: ' + numberList.getNumberOfElements());
numberList.print();
