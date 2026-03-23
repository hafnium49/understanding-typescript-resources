// TYPESCRIPT VERSION: This file fixes the type bug from calculator.js.
//
// By adding a type annotation (: number) to the inputPrice parameter,
// TypeScript enforces that only numeric values can be passed in.
// Any attempt to pass a string triggers a compile-time error, catching
// the bug before the code ever runs in a browser.

// The ": number" after inputPrice is a TYPE ANNOTATION — a core
// TypeScript feature that explicitly declares what kind of value a
// parameter must receive. TypeScript will reject any call that passes
// a value of a different type.
function deriveFinalPrice(inputPrice: number) {
  // Because inputPrice is guaranteed to be a number at compile time,
  // the "+" operator here always performs numeric addition, never
  // string concatenation. The calculation is now correct.
  const finalPrice = inputPrice + inputPrice * 0.19;

  // The "!" after getElementById is a non-null assertion. It tells
  // TypeScript that we are certain this element exists in the DOM.
  // Without it, TypeScript would warn that outputEl could be null.
  const outputEl = document.getElementById('final-price')!;
  outputEl.textContent = 'Final Price: ' + finalPrice + ' €';
}

const formEl = document.querySelector('form')!;

formEl.addEventListener('submit', function (event) {
  event.preventDefault();

  // event.currentTarget is typed as EventTarget | null by default.
  // Casting it to HTMLFormElement tells TypeScript the exact DOM type,
  // which is required for the FormData constructor to accept it.
  const fd = new FormData(event.currentTarget as HTMLFormElement);

  // fd.get() returns FormDataEntryValue | null (effectively string | File | null).
  // We must convert it to a number before passing it to deriveFinalPrice.
  // The unary "+" operator converts the string to a number.
  // This conversion is exactly what was missing in calculator.js and is
  // what caused the original bug. Here, TypeScript forces us to do it —
  // omitting the "+" would produce a compile-time error because a string
  // is not assignable to the parameter type "number".
  const inputPrice = +fd.get('price')!;

  deriveFinalPrice(inputPrice);
});
