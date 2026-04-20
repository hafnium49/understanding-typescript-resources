// =====================================================================
// LESSON 241 — FORMS AND TYPED EVENT HANDLERS.
// =====================================================================
//
// This component renders a form for adding a new goal. Two input fields
// (goal title and short summary) are collected by submitting the form,
// handled manually on the client rather than using the new React 19
// "form actions" feature — the manual approach is still the most
// common pattern and works in every React version.
//
// LINKING LABELS TO INPUTS:
// Each <label> uses "htmlFor" to reference the input's "id". This
// creates an accessible association — clicking the label focuses the
// input, and screen readers announce them together. "htmlFor" is the
// React prop name (JSX avoids the HTML attribute "for" because "for"
// is a reserved word in JavaScript).
//
// TYPING THE SUBMIT HANDLER:
// When you pass a function to the onSubmit prop of a <form>, React
// will call it with a SyntheticEvent describing the submission.
// TypeScript needs to know the exact type of that event parameter.
//
// The type is FormEvent<HTMLFormElement>, imported from React:
//   - "FormEvent" is the event class for form-related interactions.
//   - It is GENERIC: the type parameter specifies which HTML element
//     the event originated from. For a <form> submit, that is
//     HTMLFormElement.
//
// Alternatively, you can type the entire HANDLER (not the parameter)
// as FormEventHandler<HTMLFormElement>. Both styles are valid; this
// lesson uses the parameter-typed style.
//
// "import type" keeps the import compile-time only — no runtime
// dependency is added.
//
// event.preventDefault() STOPS the browser's default behavior, which
// for a <form> submission would navigate away / reload the page.
// We want to process the data in JavaScript instead.
//
// =====================================================================
// LESSON 242 — EXTRACTING FORM VALUES WITH REFS.
// =====================================================================
//
// There are two common ways to read input values in React:
//   1. Controlled inputs — useState updates on every keystroke.
//   2. Uncontrolled inputs + refs — read values only at submit time.
//
// This lesson demonstrates the ref approach. A REF is an object that
// can be attached to a JSX element; React populates its ".current"
// property with the underlying DOM element. You can then read native
// DOM properties such as ".value" on an input.
//
// useRef IS A GENERIC HOOK:
// useRef requires an initial value (we use null because the element
// is not yet attached when the component first renders). TypeScript
// infers the stored type from that initial value — which would be
// just "null". That is not useful, so we pass an EXPLICIT generic
// type parameter: useRef<HTMLInputElement>(null).
//
// This tells TypeScript: "eventually this ref will point to an
// HTML input element; initially it is null." The resulting type is
// essentially (HTMLInputElement | null), accessed via ref.current.
//
// ACCESSING .current REQUIRES A NULL CHECK:
// Because the stored value may be null, TypeScript flags direct
// property access. Inside handleSubmit we know the form has
// rendered and the refs are attached — so using the NON-NULL
// ASSERTION operator (!) is safe here:
//   goalRef.current!.value
// The "!" tells TypeScript "trust me, this is not null". If the
// assumption is wrong at runtime, a TypeError is thrown.

import { useRef } from 'react';
import type { FormEvent } from 'react';

export default function NewGoal() {
  // Refs start as null and are populated by React when the DOM element
  // mounts (see the "ref" prop on the inputs below).
  const goalRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // ".current" is the underlying DOM input element; ".value" is its
    // current text content. The "!" asserts non-null at this point.
    const enteredGoal = goalRef.current!.value;
    const enteredSummary = summaryRef.current!.value;

    // For now, we just log the values — forwarding them up to the
    // parent component is covered in the next lesson.
    console.log(enteredGoal, enteredSummary);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="goal">Your goal</label>
        {/* Attaching a ref via the special "ref" prop — React assigns
            the DOM node to ref.current once this input mounts. */}
        <input id="goal" type="text" ref={goalRef} />
      </p>
      <p>
        <label htmlFor="summary">Short summary</label>
        <input id="summary" type="text" ref={summaryRef} />
      </p>
      <p>
        <button>Add Goal</button>
      </p>
    </form>
  );
}
