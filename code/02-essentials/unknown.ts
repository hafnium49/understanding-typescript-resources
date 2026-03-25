// THE "unknown" TYPE — a safer alternative to "any" for untyped values.
//
// When a function receives data from an unpredictable source (a database,
// an API, a file, user input), you may not know the shape of the value
// at development time. Two options exist:
//
//   "any"     — disables all type checking. You can access any property
//               or call any method without TypeScript complaining. This
//               is convenient but dangerous: if the value is not what you
//               assumed, you get a silent runtime error.
//
//   "unknown" — accepts any value (like "any") but BLOCKS you from using
//               it until you prove what it actually is. Attempting to
//               access a property or call a method on an unknown value
//               produces a compile error until you add runtime checks
//               that narrow the type.
//
// This makes "unknown" the safe counterpart to "any": both accept all
// values, but "unknown" forces you to verify before you act. Prefer
// "unknown" over "any" whenever you genuinely do not know the type.
//
// "unknown" is especially common in library and framework code, where
// authors cannot predict what types consumers will pass in.
function process(val: unknown) {
  // TYPE NARROWING with runtime checks — required for "unknown" values.
  //
  // Each condition progressively narrows val's type so that TypeScript
  // eventually permits the method call. All operators used here are
  // standard JavaScript (not TypeScript-specific):
  //
  //   typeof val === 'object'  — confirms val is an object (or null)
  //   !!val                    — excludes null (which typeof reports
  //                              as 'object' — a well-known JS quirk)
  //   'log' in val             — confirms a "log" property exists
  //   typeof val.log === 'function' — confirms "log" is callable
  //
  // Only after all four checks pass does TypeScript allow val.log().
  // With "any" instead of "unknown", none of these checks would be
  // required — but you would also lose all protection against calling
  // a method that does not exist at runtime.
  if (
    typeof val === 'object' &&
    !!val &&
    'log' in val &&
    typeof val.log === 'function'
  ) {
    val.log();
  }
}
