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
//
// Decorators are an OBJECT-ORIENTED PROGRAMMING feature. That means
// they only work with classes and their members. Specifically, you
// can attach decorators to:
//
//   - Classes themselves
//   - Methods inside a class
//   - Fields (properties) inside a class
//   - Getters and setters inside a class
//
// You CANNOT attach decorators to standalone functions, variables,
// or any other non-class construct. There is no equivalent feature
// for those. If you want decorator-like behavior outside of classes,
// you have to wrap that code in a class first or use a different
// pattern (e.g., higher-order functions).
//
// This section covers CLASS, METHOD, and FIELD decorators in detail.
// Decorators are entirely OPTIONAL — you can write substantial
// TypeScript applications without ever using them. But they shine
// for cross-cutting concerns like validation, logging, dependency
// injection, and framework integration.
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

// =====================================================================
// BUILDING YOUR FIRST DECORATOR — a class decorator.
// =====================================================================
//
// Note on tsconfig.json: the "experimentalDecorators" setting is NOT
// enabled (it remains commented out). With that flag off, TypeScript
// builds the modern, standard ECMAScript decorators — exactly what we
// want for this section.

// DECORATORS ARE JUST FUNCTIONS.
//
// A decorator is a regular function written in a specific shape that
// allows TypeScript to call it when the thing it is attached to is
// being defined. The function name becomes the decorator name.
//
// For an ECMAScript CLASS DECORATOR, the function receives TWO arguments:
//
//   1. target — the thing the decorator is attached to. For a class
//      decorator, this is the class itself (technically the constructor
//      function).
//
//   2. ctx (the "context" object) — an object provided by the runtime
//      that describes WHAT the decorator is attached to. Its type is
//      "ClassDecoratorContext", a built-in TypeScript type. This object
//      includes useful properties such as:
//        - kind: describes the target type (e.g., 'class', 'method')
//        - name: the name of the target (e.g., 'Person')
//        - metadata: a slot for attaching extra information
//        - addInitializer: a function used in advanced scenarios (later)
//
// Without these two parameters, TypeScript would complain that the
// function does not match a valid decorator signature.

// PROPER TYPING FOR THE TARGET — using a generic constructor type.
//
// Originally we could type "target" as "any" to get the basic decorator
// working. But once a decorator RETURNS a new class to replace the
// original (see below), TypeScript needs a more precise type so the
// returned class is compatible with the original.
//
// The constraint "T extends new (...args: any[]) => any" reads as:
// "T must be something that can be called with the 'new' keyword and
// any combination of arguments." This is TypeScript's way of saying
// "T is a class constructor."
//
//   - "new" tells TypeScript it must be constructible (i.e., a class)
//   - "(...args: any[])" allows any number of constructor parameters
//     of any types — we do not care which class we are decorating
//   - "=> any" says the constructor produces any kind of instance
//
// Using a generic T (instead of "any") preserves the connection
// between the input class and the output class, so TypeScript can
// verify that the replacement class is compatible.
function logger<T extends new (...args: any[]) => any>(
  target: T,
  ctx: ClassDecoratorContext
) {
  console.log('logger decorator');
  console.log(target);
  console.log(ctx);

  // RETURNING A REPLACEMENT CLASS — how a class decorator MODIFIES
  // the class it is attached to.
  //
  // A class decorator can return a new class, and that new class will
  // REPLACE the original class wherever it is used. To preserve all
  // the original behavior while adding new pieces, return an anonymous
  // class that extends "target" — the original class.
  //
  // The "class extends target { ... }" syntax (without giving the
  // class a name) is valid JavaScript: it creates a one-off subclass
  // on the spot, just to return it from this function.
  //
  // IMPORTANT: This does not WIPE OUT the original class. Because the
  // returned class extends target, all original members (name, greet)
  // AND any additions made here end up on the final instance.
  //
  // RUNNING CODE ON EACH INSTANTIATION — adding a constructor.
  //
  // The replacement class can define its own constructor. To preserve
  // the original constructor's behavior, the first thing it must do is
  // call "super(...args)" — forwarding all incoming arguments to the
  // original class's constructor via the spread operator on the rest
  // parameter "...args". After that, you can run any extra logic that
  // should happen every time a new instance is created.
  //
  // Why this matters: the body of "logger" itself (above the return
  // statement) executes ONCE — at the moment the class is defined.
  // The replacement class's constructor, by contrast, executes EVERY
  // TIME someone writes "new Person()". This timing difference is
  // critical for a logger decorator: the outer logs describe the class
  // shape, the inner logs describe individual instances.
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      console.log('class constructor');
      console.log(this);
    }
  };
}

// ATTACHING THE DECORATOR with the @ symbol.
//
// To use a function as a decorator, place "@functionName" directly
// above (or in the same line as) the thing you want to decorate. Note
// that you do NOT call the function with parentheses here — you just
// reference it. TypeScript will invoke it for you when the class is
// being defined.
//
// Inspecting the printed context object at runtime reveals its shape:
// kind is 'class', name is 'Person', metadata is empty, and
// addInitializer is a function that becomes important in later lessons.
@logger
class Person {
  public name = 'Max';

  greet() {
    console.log('Hi, I am ' + this.name);
  }
}

// Instantiating Person multiple times to demonstrate the timing of
// the different log statements:
//
//   1. "logger decorator" + the class + the context object → printed
//      ONCE, when the class definition is parsed (decorator setup time).
//
//   2. "class constructor" + the instance → printed ONCE PER "new"
//      call (instantiation time). Two new Person() calls produce two
//      pairs of logs.
//
// This makes the timing distinction concrete: code that lives directly
// in the decorator function body runs at class-definition time, while
// code inside the returned class's constructor runs whenever an
// instance is created.
new Person();
new Person();
