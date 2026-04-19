// LESSON 228 — FETCHING COORDINATES WITH AXIOS.
//
// This lesson sends the entered address to Google's Geocoding API and
// extracts the returned latitude/longitude. The next lesson feeds those
// coordinates into Google Maps to render the location on screen.
//
// WHY AXIOS (AND NOT fetch)?
//
// Modern browsers ship the built-in fetch() API for HTTP requests. It
// works perfectly well, but its error handling can feel clunky — a
// failed response (e.g., 500 status) does NOT reject the fetch promise;
// you have to inspect response.ok yourself and throw manually.
//
// axios is a very popular third-party library that wraps the details
// and gives you a cleaner API. This project uses it partly for practice
// with third-party libraries in TypeScript.
//
// INSTALLATION (already done for this project):
//
//   npm install --save axios
//
// "--save" adds axios to the "dependencies" block of package.json so
// the project can be reinstalled later with the same dependency set.
//
// BUILT-IN TYPE DEFINITIONS:
//
// Inside node_modules/axios there is an index.d.ts file shipped by the
// axios authors themselves. That file describes every method, option,
// and return type to TypeScript — giving us autocompletion and type
// checking without a separate @types/axios install. If a library does
// NOT ship its own .d.ts, you typically install "@types/<library>"
// from DefinitelyTyped. With axios, no extra install is needed.

// Default import — brings in the axios object whose methods (.get,
// .post, etc.) send HTTP requests. Because axios ships its own types,
// TypeScript knows the shape of this object immediately.
import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

// GOOGLE API KEY — loaded from the workspace-root .env file at build
// time by the dotenv-webpack plugin (see webpack.config.js). The plugin
// replaces this expression with a literal string during bundling, so
// no `process` object exists at runtime in the browser.
// The ambient augmentation in env.d.ts types this as a plain string.
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// RESPONSE SHAPE — described as a named type alias for readability.
//
// axios's .get() is a GENERIC method: axios.get<ResponseType>(...).
// Passing a type argument tells TypeScript the shape of the response
// body BEFORE the request is sent, so the compiler can check property
// access against that shape and IDEs can offer autocompletion.
//
// TypeScript cannot infer the shape automatically because doing so
// would require actually calling the API at compile time. Declaring
// an explicit type lets you write safe code against any external API.
//
// The fields below cover only what we need:
//   - results: array of hits from Google; we use the first
//     (results[0].geometry.location contains lat/lng).
//   - status: a string that Google sets to "OK" on success and
//     "ZERO_RESULTS" (or others) when it cannot resolve the address.
// Google returns additional fields we do not care about here — the
// compiler is fine with extra fields, only the ones we access matter.
type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // BUILDING THE REQUEST URL.
  //
  // The template literal (backticks) lets us splice dynamic values —
  // the encoded address and the API key — directly into the URL.
  //
  // encodeURI() is a standard JavaScript function that turns arbitrary
  // text into a URL-safe form. User input may contain spaces, commas,
  // and other characters that have special meaning inside a URL; this
  // function percent-encodes them so the URL stays valid.
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    // .get() returns a Promise because HTTP requests are asynchronous.
    // .then() receives the successful response, .catch() receives any
    // error — both network-level errors and any Error we throw inside
    // the .then() block.
    .then(response => {
      // Google can return a 200 HTTP status while still signaling
      // failure in its body (e.g., an invalid address). Checking the
      // logical "status" field ensures we only proceed on real success.
      // Throwing inside .then() routes execution to the .catch() below.
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      // Drill into the payload to extract latitude/longitude.
      // Thanks to the generic <GoogleGeocodingResponse>, TypeScript
      // autocompletes each step and flags any typos at compile time.
      const coordinates = response.data.results[0].geometry.location;

      // Placeholder output — confirms the coordinates were parsed.
      // The next lesson replaces this with a Google Maps render call.
      console.log(coordinates);
    })
    .catch(err => {
      // Basic feedback for the user: show the error text in a browser
      // alert. A production app would render this more gracefully.
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
