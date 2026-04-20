// LESSON 229 — RENDERING THE LOCATION ON A GOOGLE MAP.
//
// This lesson turns the fetched coordinates into a visible interactive
// map using Google's Maps JavaScript SDK. Two things are new:
//
//   1. The SDK itself is loaded from Google's CDN (not from npm, which
//      does not publish it). It exposes a global `google.maps` object.
//   2. TypeScript cannot know about `google.maps` on its own. The lesson
//      first introduces the `declare var` escape hatch, then improves
//      the situation by installing @types/googlemaps — the proper route.
//
// Installing @types/googlemaps (already done for this project):
//
//   npm install --save-dev @types/googlemaps
//
// Once the types package is present, the `declare var google: any;`
// stopgap is no longer needed and can be removed (or commented out for
// reference, as below). TypeScript now autocompletes google.maps.*,
// catches typos at compile time, and rejects wrong-argument calls.

import axios from "axios";

// =====================================================================
// DYNAMIC SDK LOADING.
// =====================================================================
//
// The transcript pastes the SDK <script> tag directly into index.html
// with the API key embedded in its URL. This project keeps the key in
// the workspace-root .env file ONLY, so the SDK script has to be
// created here in TypeScript — where dotenv-webpack can substitute
// process.env.GOOGLE_API_KEY at build time.
//
// At runtime, this function runs once at module load, appends a
// <script> element to <head> with the resolved URL, and lets the
// browser download and evaluate the SDK asynchronously. By the time
// the user types an address and clicks "Search Address", the
// `google.maps` global is ready.
function loadGoogleMapsSdk() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`;
  // async + defer mirror the attributes used in the transcript's
  // index.html: load the script without blocking the HTML parser,
  // and run it after the document is parsed.
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}
loadGoogleMapsSdk();

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

// Loaded from the workspace-root .env file via dotenv-webpack at build time.
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Historical reference — BEFORE @types/googlemaps was installed,
// this line was needed so TypeScript would accept the global `google`
// name. `declare var` introduces an ambient value of type `any`,
// effectively saying "trust me, this exists at runtime". With the
// types package installed, removing (or commenting out) this line
// enables proper autocompletion and compile-time checking of the
// google.maps.* API.
// declare var google: any;

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then(response => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      const coordinates = response.data.results[0].geometry.location;

      // RENDERING THE MAP.
      //
      // google.maps.Map is a CONSTRUCTOR that produces an interactive
      // Google Map inside an existing DOM element. It expects:
      //   - 1st arg: the host element (here, <div id="map">). Because
      //     getElementById returns HTMLElement | null, we use `as
      //     HTMLElement` to assert non-null for the constructor.
      //   - 2nd arg: a MapOptions object. `center` takes the
      //     lat/lng from our geocoding response; `zoom` controls
      //     the initial zoom level (higher = closer; 16 is a
      //     city-block scale).
      //
      // IMPORTANT: the element id "map" here must match the id used
      // in index.html. Change one and you must change the other.
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: coordinates,
        zoom: 16
      });

      // ADDING A MARKER.
      //
      // google.maps.Marker drops a pin on the map at a given position.
      // Passing `map: map` binds it to the map instance we just created.
      // We do not need to keep a reference to the marker here — the SDK
      // retains it internally — so the `new` expression is used without
      // assignment, which is legal JavaScript / TypeScript.
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch(err => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);

// =====================================================================
// LESSON 230 — ALTERNATIVE: WORKING WITHOUT A CREDIT CARD (OpenLayers).
// =====================================================================
//
// Google Maps requires a credit card to generate an API key even for
// free-tier usage. If you cannot provide one, swap in OpenLayers
// instead — an open-source map renderer that needs no API key.
//
// QUICK START: https://openlayers.org/doc/quickstart.html
//
// MINIMAL REPLACEMENT PATTERN.
//
// 1. Add the OpenLayers CSS + script tags to index.html (from CDN),
//    replacing the dynamically-injected Google Maps SDK:
//
//      <link
//        rel="stylesheet"
//        href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.1.1/css/ol.css">
//      <script
//        src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.1.1/build/ol.js">
//      </script>
//
// 2. Because OpenLayers ships no TypeScript types in this CDN build,
//    declare the global `ol` as `any` — same escape hatch pattern we
//    saw earlier with `declare var google: any;`:
//
//      declare var ol: any;
//
// 3. Without a Google API key the geocoding request will fail, so
//    use hard-coded dummy coordinates in the submit handler. Clear
//    the placeholder <p> inside #map before constructing the map so
//    the tile layer renders cleanly:
//
//      function searchAddressHandler(event: Event) {
//        event.preventDefault();
//        const coordinates = { lat: 40.41, lng: -73.99 };
//        document.getElementById('map')!.innerHTML = '';
//        new ol.Map({
//          target: 'map',
//          layers: [ new ol.layer.Tile({ source: new ol.source.OSM() }) ],
//          view: new ol.View({
//            center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
//            zoom: 16
//          })
//        });
//      }
//
// CONCEPTS DEMONSTRATED IN THIS ALTERNATIVE.
//
//   - Map source comes from OpenStreetMap (ol.source.OSM) — community
//     tile data, no account or key required.
//   - ol.proj.fromLonLat converts [longitude, latitude] from WGS84 to
//     the Web Mercator projection that OL uses internally. Note the
//     argument order is LON, LAT — opposite of Google Maps' lat/lng
//     object form.
//   - ol.View holds the camera state (center + zoom).
//   - ol.layer.Tile is one of several layer kinds (others: VectorLayer
//     for points/lines, ImageLayer for raster overlays, etc.).
//   - The map "target" is the id of the host element as a string,
//     rather than a DOM reference like Google Maps.
//
// See the OpenLayers documentation for adding markers, popups, vector
// layers, and geocoding via alternative free services (e.g., Nominatim).
