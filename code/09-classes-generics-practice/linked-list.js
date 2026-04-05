"use strict";
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
class ListNode {
    value;
    // NEXT — an optional link to the next node in the chain.
    // Typed as ListNode<T> (the same class, same generic type) so the
    // chain is type-consistent. Optional because the last node in the
    // list has no successor — its next is undefined.
    next;
    // VALUE — the data stored in this node, created via the parameter
    // property shortcut. Public so it can be read from outside.
    constructor(value) {
        this.value = value;
    }
}
// LINKEDLIST — a generic class managing the chain of nodes.
//
// T is the type of values stored in the list. When you instantiate
// with new LinkedList<number>(), T becomes number — the add() method
// only accepts numbers, and every ListNode holds a number.
class LinkedList {
    root;
    // TAIL — stores the LAST node in the chain. Without this, appending
    // a new node requires walking the entire chain from root to the end
    // (O(n) time). With tail, we can jump directly to the last node and
    // link the new node in O(1) — a significant efficiency improvement
    // as the list grows.
    tail;
    length = 0;
    add(value) {
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
        }
        else {
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
    // INSERTAT — inserts a new node at a specific position in the chain.
    //
    // The logic walks node by node from root until the target position
    // is reached, then re-links the neighboring nodes to include the
    // new node between them. Returns true if successful, false if the
    // position is out of bounds.
    //
    // No new TypeScript features here — just classes, generics, and
    // private properties applied to a more complex algorithm.
    insertAt(value, pos) {
        if (pos > -1 && pos < this.length && this.root) {
            let current = this.root;
            let index = 0;
            let previous = current;
            let node = new ListNode(value);
            if (pos === 0) {
                // Inserting at the start: the new node's next points to the
                // current root, then the new node becomes the new root.
                node.next = this.root;
                this.root = node;
            }
            else {
                // Walk to the target position, tracking both the current node
                // and the one before it (previous). The new node is inserted
                // between previous and current by updating their links.
                while (index++ < pos && current.next) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true;
        }
        else {
            return false;
        }
    }
    // REMOVEAT — removes the node at a specific position and returns it.
    //
    // Similar walking logic to insertAt. The node at the target position
    // is unlinked by connecting its predecessor directly to its successor.
    // Returns the removed node (so the caller can access its value), or
    // null if the position is out of bounds.
    //
    // NOTE: "previous: ListNode<T> = current" uses an explicit type
    // annotation. This is needed because TypeScript must know the type
    // of "previous" before the while loop assigns to it — a practical
    // example of when explicit annotations help even with initialized
    // variables.
    removeAt(pos) {
        if (pos > -1 && pos < this.length && this.root) {
            let current = this.root;
            let previous = current;
            let index = 0;
            if (pos === 0) {
                // Removing the root: advance root to the next node.
                this.root = current.next;
            }
            else {
                while (index++ < pos && current.next) {
                    previous = current;
                    current = current.next;
                }
                // Skip over the current node: previous now points directly
                // to current's successor, effectively removing current.
                previous.next = current.next;
            }
            this.length--;
            return current;
        }
        else {
            return null;
        }
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
const numberList = new LinkedList();
numberList.add(10);
numberList.add(5);
numberList.add(-3);
console.log('Length: ' + numberList.getNumberOfElements());
numberList.print();
console.log('--- NOW REMOVING INDEX 1 ---');
numberList.removeAt(1);
console.log('Length: ' + numberList.getNumberOfElements());
numberList.print();
console.log('--- NOW INSERTING AT INDEX 1 ---');
numberList.insertAt(100, 1);
console.log('Length: ' + numberList.getNumberOfElements());
numberList.print();
// The same LinkedList class works with a completely different type —
// this is the power of generics in action.
const nameList = new LinkedList();
