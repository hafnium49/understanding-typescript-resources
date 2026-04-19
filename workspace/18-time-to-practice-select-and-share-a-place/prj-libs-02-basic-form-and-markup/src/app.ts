// LESSON 226 — HANDLING THE FORM SUBMISSION.
//
// This lesson wires up the HTML form (added in lesson 225) to a
// TypeScript handler. By the end of this lesson, submitting the form
// captures the entered address but does NOT yet call any external API —
// that arrives in the next lesson with axios + the Google Geocoding API.

// FORM REFERENCE.
//
// document.querySelector('form') returns the first <form> in the DOM —
// or null if none exists. Its return type is HTMLFormElement | null.
// The trailing "!" is the non-null assertion operator: we promise
// TypeScript that a form is present (this page has exactly one), so
// the compiler may treat `form` as HTMLFormElement without a null check.
// The ! is safe here because we control the markup; if the form were
// ever removed from index.html, this would become a runtime error.
const form = document.querySelector('form')!;

// INPUT REFERENCE.
//
// document.getElementById returns HTMLElement | null — the base type
// does NOT include input-specific properties like .value. To access
// the entered text, we TYPE-CAST the result to HTMLInputElement using
// "as". TypeScript does not verify the cast at runtime; it is our
// assertion that we know the element's true type based on the markup.
//
// As with `form`, "!" strips the null possibility since we know the
// element with id="address" exists in index.html.
const addressInput = document.getElementById('address')! as HTMLInputElement;

// SUBMIT HANDLER.
//
// The explicit "event: Event" annotation lets TypeScript surface the
// methods and properties of a DOM Event (e.g., preventDefault).
// Without the type hint, the parameter would default to "any" and
// IDE autocompletion for event methods would be lost.
function searchAddressHandler(event: Event) {
  // preventDefault stops the browser's default submit behavior —
  // which would reload the page and append the form data to the URL
  // as a GET request. Since we intend to handle the input in JS/TS
  // and (later) call an API asynchronously, that full-page reload
  // must be blocked.
  event.preventDefault();

  // The "value" property of an HTMLInputElement contains whatever
  // text the user typed. Because we cast `addressInput` above,
  // TypeScript allows this access without complaint.
  const enteredAddress = addressInput.value;

  // Placeholder output — confirms the capture works end-to-end.
  // The next lesson replaces this with an axios request to Google's
  // Geocoding API to convert the address into coordinates.
  console.log(enteredAddress);
}

// WIRING UP THE HANDLER.
//
// The 'submit' event fires when the <button type="submit"> is clicked
// (or when Enter is pressed inside the input). We pass the handler
// by reference — no parentheses — so the listener invokes it each time
// submission happens, not just once at registration.
form.addEventListener('submit', searchAddressHandler);
