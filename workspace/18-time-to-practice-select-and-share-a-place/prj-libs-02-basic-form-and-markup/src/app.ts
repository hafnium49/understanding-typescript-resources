// LESSON 226 — HANDLING THE FORM SUBMISSION.
//
// This lesson wires up the HTML form (added in lesson 225) to a
// TypeScript handler. By the end of this lesson, submitting the form
// captures the entered address but does NOT yet call any external API —
// that arrives in a later lesson with axios + the Google Geocoding API.

// =====================================================================
// LESSON 227 — GOOGLE GEOCODING API KEY.
// =====================================================================
//
// The Google Geocoding API converts an address string into a pair of
// latitude/longitude coordinates (or vice versa). We will use the
// "forward geocoding" direction: address → coordinates. Later lessons
// feed those coordinates into Google Maps to render the location.
//
// REQUEST URL (for reference, used in the next lesson):
//   https://maps.googleapis.com/maps/api/geocode/json?address=...&key=...
//
// MANUAL SETUP (must be done BEFORE the next lesson's code can succeed):
//
//   1. Sign in to a Google account.
//   2. Visit the Google Maps Platform "Get Started" page:
//      https://developers.google.com/maps/documentation/javascript/get-api-key
//   3. Enable the "Places" product (for the Geocoding API) and the
//      "Maps" product (for the Maps JavaScript SDK — needed later).
//   4. Select or create a Google Cloud project.
//   5. Set up a billing account (a credit card is required, but the free
//      tier is generous — this demo will not exceed it).
//   6. Copy the generated API key.
//   7. OPTIONAL: restrict the key to a specific app/domain in the
//      developer console for safety.
//   8. Replace the placeholder below with the copied key.
//
// The API key is a SECRET. Do NOT commit a real key to a public
// repository. For learning purposes we embed it here; production apps
// should load it from environment variables or a backend proxy.

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

// GOOGLE API KEY (lesson 227).
//
// Stored as a module-level constant so the next lesson can reference
// it when building the request URL. Keep this placeholder until you
// complete the manual setup above.
const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';

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

  // Placeholder output — confirms both the captured address and that
  // the API key constant is wired up. The next lesson replaces this
  // with a real request to the Geocoding API that uses both values.
  console.log(enteredAddress, GOOGLE_API_KEY);
}

// WIRING UP THE HANDLER.
//
// The 'submit' event fires when the <button type="submit"> is clicked
// (or when Enter is pressed inside the input). We pass the handler
// by reference — no parentheses — so the listener invokes it each time
// submission happens, not just once at registration.
form.addEventListener('submit', searchAddressHandler);
