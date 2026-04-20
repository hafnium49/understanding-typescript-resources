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

import type { FormEvent } from 'react';

export default function NewGoal() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Extraction of the submitted form data is covered in the next lesson.
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="goal">Your goal</label>
        <input id="goal" type="text" />
      </p>
      <p>
        <label htmlFor="summary">Short summary</label>
        <input id="summary" type="text" />
      </p>
      <p>
        <button>Add Goal</button>
      </p>
    </form>
  );
}
