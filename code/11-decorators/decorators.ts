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
// =====================================================================
// WHAT ARE DECORATORS?
// =====================================================================
//
// Decorators are a METAPROGRAMMING feature. Metaprogramming means
// writing code that interacts with other code — the decorator itself
// is not the application logic; it modifies or augments code that IS
// the application logic.
//
// Decorators are not unique to TypeScript. Many other programming
// languages have similar features (Python decorators, Java annotations,
// C# attributes, etc.).
//
// SYNTAX: Decorators are written with an "@" symbol followed by a name,
// placed directly above the thing they decorate. They may or may not
// take arguments. Typical examples look like:
//
//   @logger
//   class Person { ... }
//
//   @length(2, 100)
//   title: string;
//
// In the second example, "length" is a decorator from the Class
// Validator library that adds validation rules to the "title" property
// — rejecting values that are too short or too long. The decorator
// CHANGES THE BEHAVIOR of the property without modifying its declaration.
//
// Another well-known example is the Angular framework, where
// decorators turn ordinary classes into reusable HTML components and
// other framework constructs.
//
// WHAT CAN YOU ATTACH DECORATORS TO?
// Classes, methods, and properties (the specific targets covered in
// later lessons of this section). Decorators are entirely OPTIONAL —
// you can write substantial TypeScript applications without ever using
// them. But they shine for cross-cutting concerns like validation,
// logging, dependency injection, and framework integration.
//
// =====================================================================
// TWO FLAVORS OF DECORATORS IN TYPESCRIPT:
// =====================================================================
//
// TypeScript supports two distinct decorator implementations because
// the JavaScript standard for decorators evolved over time:
//
//   1. STANDARD ECMAScript DECORATORS — the modern, official version
//      that matches the JavaScript proposal currently at Stage 3 (the
//      stage just before formal inclusion in the language). Once the
//      proposal ships, you will be able to use this exact syntax in
//      plain JavaScript without TypeScript at all. Until then,
//      TypeScript already supports it and compiles it down to code
//      that works in older engines, controlled by the "target" setting
//      in tsconfig.json. This is what we cover in THIS section.
//
//   2. EXPERIMENTAL (LEGACY) DECORATORS — based on a much older version
//      of the decorator proposal that did NOT make it into the JavaScript
//      standard. Despite never becoming official JavaScript, TypeScript
//      has supported this older syntax for many years and continues to,
//      because countless existing projects (Angular, TypeORM, NestJS,
//      etc.) were built against it. Enabling them requires setting the
//      "experimentalDecorators" flag to true in tsconfig.json. They are
//      covered in a separate section of this course.
//
// The two flavors have different signatures and capabilities, which is
// why TypeScript supports both — they serve different ecosystems. The
// rest of THIS section focuses exclusively on the standard ECMAScript
// flavor.
