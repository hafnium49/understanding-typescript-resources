// BUG DEMONSTRATION: This file contains an intentional type-related bug.
//
// The function below expects a numeric price so it can calculate tax.
// However, because form input values in JavaScript are ALWAYS strings,
// the arithmetic produces incorrect results via string concatenation
// instead of numeric addition.
//
// For example, entering "15" yields "1515" * 0.19 = "287.85" appended
// to the string — not the expected 15 + 2.85 = 17.85.
//
// In a TypeScript version of this file, you could add a type annotation
// (e.g., inputPrice: number) to the parameter. TypeScript would then
// flag the call site as an error, because the value extracted from the
// form is a string, not a number. That compile-time check is one of the
// core benefits TypeScript brings to JavaScript development.

// This function receives inputPrice and attempts to add 19% tax.
// Without an explicit conversion to number, JavaScript's "+" operator
// will concatenate strings instead of performing addition when the
// left operand is a string.
function deriveFinalPrice(inputPrice) {
  // BUG: If inputPrice is the string "15", this expression evaluates as:
  //   "15" + "15" * 0.19
  // Multiplication coerces "15" to 15 (= 2.85), but then "+" sees a
  // string on the left and concatenates: "15" + "2.85" = "152.85".
  // The fix would be to convert inputPrice to a number first, e.g.:
  //   const numericPrice = +inputPrice;  // or Number(inputPrice)
  const finalPrice = inputPrice + inputPrice * 0.19;
  const outputEl = document.getElementById('final-price');
  outputEl.textContent = 'Final Price: ' + finalPrice + ' €';
}

// Select the form element from the DOM.
const formEl = document.querySelector('form');

// Listen for the form's submit event to extract user input and calculate.
formEl.addEventListener('submit', function (event) {
  // Prevent the default browser behavior of reloading the page on submit.
  event.preventDefault();

  // FormData provides access to named form fields. The value returned by
  // fd.get() is always a string (or null) — never a number. This is
  // standard browser behavior and is the origin of the type mismatch bug.
  const fd = new FormData(event.currentTarget);
  const inputPrice = fd.get('price');

  // Passing a string where a number is expected — TypeScript would catch
  // this with a type annotation on deriveFinalPrice's parameter.
  deriveFinalPrice(inputPrice);
});
