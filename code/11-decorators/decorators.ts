// =====================================================================
// DECORATORS — section overview.
// =====================================================================
//
// This section explores DECORATORS — a feature for attaching reusable
// behavior to classes, methods, and properties without modifying their
// source. The lessons that follow cover:
//
//   - What decorators are and why they exist
//   - How to write your own class, method, and property decorators
//   - DECORATOR FACTORIES — functions that produce decorators, useful
//     when you want to configure a decorator with arguments
//
// TWO FLAVORS OF DECORATORS IN TYPESCRIPT:
//
// TypeScript supports two distinct decorator implementations because
// the JavaScript standard for decorators evolved over time:
//
//   1. Standard ECMAScript decorators — the modern, official version
//      that follows the finalized JavaScript proposal. This is the
//      default in newer TypeScript releases.
//
//   2. Experimental (legacy) decorators — an older implementation that
//      predates the official standard. Many existing libraries (Angular,
//      TypeORM, etc.) were built against this version, so it remains
//      important to recognize. Enabled via the "experimentalDecorators"
//      compiler option in tsconfig.json.
//
// The two flavors have different signatures and capabilities. Later
// lessons in this section show how to write each kind and explain when
// to use one over the other.
