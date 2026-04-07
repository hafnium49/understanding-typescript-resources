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

// =====================================================================
// METHOD DECORATORS — decorating a single method instead of the class.
// =====================================================================
//
// Class decorators are not the only kind. You can also write decorators
// that target individual METHODS inside a class. The general shape is
// the same — a regular function with two parameters — but the types of
// those parameters differ.
//
// For an ECMAScript METHOD DECORATOR:
//
//   1. target — the method itself, which is just a function. You can
//      type it as the built-in "Function" type, or as an explicit
//      function type like "(...args: any[]) => any" to accept any
//      method signature.
//
//   2. ctx — a "ClassMethodDecoratorContext" object describing the
//      method being decorated. Compared to the class context, it
//      carries extra method-specific properties:
//        - kind: 'method'
//        - name: the method's name (e.g., 'greet')
//        - static: whether the method is declared with "static"
//        - private: whether the method is private
//        - access: an object exposing get/has helpers for indirect
//          access to the method on instances
//        - addInitializer: used for advanced behaviors (covered next)
// IMPLEMENTING AUTOBIND — moving the manual bind workaround into a
// reusable decorator.
//
// The previous lesson showed how to fix the "this" problem manually
// by writing "this.greet = this.greet.bind(this)" inside the class's
// constructor. This decorator moves that exact logic INTO the decorator
// itself, so the user only needs to write "@autobind" above any
// method that should have its "this" permanently bound.
//
// USING ctx.addInitializer:
//
// The context object's addInitializer method registers a callback
// that runs as part of the class's instance initialization — in
// effect, you get access to a piece of "constructor code" without
// having to add a constructor to the user's class. This is exactly
// what is needed to bind the method on each new instance.
//
// You MUST pass a regular function (declared with the "function"
// keyword) to addInitializer, NOT an arrow function. The reason is
// the same "this" rule from the previous lesson: arrow functions
// inherit "this" from their surrounding scope, which here would NOT
// be the new instance. A regular function, on the other hand, takes
// its "this" from the call site — and addInitializer calls it on the
// freshly constructed instance.
//
// Inside the initializer, "this" refers to the new instance. We use
// "ctx.name" to look up the method by its name dynamically, so the
// same decorator works for any method — not just "greet". The line
//
//   this[ctx.name] = this[ctx.name].bind(this);
//
// is the dynamic version of the manual fix from before.
//
// THE "this: any" PARAMETER:
//
// "this: any" is a TypeScript-specific syntax for declaring the type
// of "this" inside a function. It is NOT a real argument — JavaScript
// never sees it. It only tells TypeScript "treat this as type any
// inside the body". Without it, TypeScript would complain because it
// cannot infer the runtime type of "this" inside the initializer.
function autobind(
  target: (...args: any[]) => any,
  ctx: ClassMethodDecoratorContext
) {
  ctx.addInitializer(function (this: any) {
    this[ctx.name] = this[ctx.name].bind(this);
  });

  // RETURNING A REPLACEMENT FUNCTION — wrapping the original method.
  //
  // Just like a class decorator can return a new class to replace the
  // original, a method decorator can return a new function to replace
  // the original method. The returned function becomes the new "greet"
  // (or whichever method the decorator was attached to).
  //
  // The wrapper pattern lets you run code BEFORE and AFTER the
  // original method, send HTTP requests, log activity, write to files,
  // and so on — without modifying the original implementation. This is
  // exactly how cross-cutting concerns (logging, auth, caching, etc.)
  // are typically added with decorators.
  //
  // CALLING "target" CORRECTLY — apply vs. plain invocation.
  //
  // Inside the wrapper, "target" is the ORIGINAL method as captured at
  // decorator time — that is, BEFORE the addInitializer above replaced
  // it with the bound version. Calling "target()" directly would lose
  // its "this" context (the same problem the addInitializer was added
  // to solve in the first place).
  //
  // The fix is to use "target.apply(this)" instead. Function.apply is
  // a built-in JavaScript method that works like bind but executes the
  // function IMMEDIATELY, after temporarily setting "this" to the
  // value passed in as the first argument. So "target.apply(this)"
  // invokes the original method with "this" pointing to the current
  // instance — preserving the connection to "name", etc.
  //
  // (As before, "this: any" on the wrapper is a TypeScript-only hint
  // for typing "this" inside the function body.)
  return function (this: any) {
    console.log('Executing original function');
    target.apply(this);
  };
}

// =====================================================================
// FIELD DECORATORS — decorating a class property (field).
// =====================================================================
//
// Field decorators (also called property decorators) target instance
// fields like the "name" property on Person. They follow the same
// "function with two parameters" shape as class and method decorators,
// but the parameter types are different — and there is one important
// quirk to be aware of regarding "target".
//
// For an ECMAScript FIELD DECORATOR:
//
//   1. target — for fields, target is ALWAYS undefined. The decorator
//      runs BEFORE the field is initialized, so there is no value to
//      hand over yet. (Class decorators get the finished class; method
//      decorators get the method function; field decorators get
//      undefined.) That is why we type target as exactly "undefined".
//
//   2. ctx — a "ClassFieldDecoratorContext" object describing the
//      field. Like the method context, it provides:
//        - kind: 'field'
//        - name: the field's name
//        - static / private: visibility flags
//        - access: an object exposing get/set helpers for indirect
//          access to the field on instances
//        - addInitializer: useful when you want to run code in the
//          constructor's lifecycle for this field
// =====================================================================
// DECORATOR FACTORIES — functions that PRODUCE decorators.
// =====================================================================
//
// All the decorators above are used by writing "@decoratorName" — you
// REFERENCE the function and JavaScript calls it for you. You never
// invoke a decorator yourself with parentheses at the use site.
//
// But what if you want to PARAMETERIZE a decorator? For example, the
// previous "fieldLogger" hard-coded the replacement value to ''. It
// would be more flexible to choose the replacement value at the place
// where you attach the decorator — something like:
//
//   @replacer('')
//   public name = 'Max';
//
// You cannot do that directly, because "@replacer('')" calls
// "replacer" with an argument. Decorators can only be REFERENCED, not
// invoked, with @.
//
// The solution is a DECORATOR FACTORY: a regular function that takes
// any arguments you want, and RETURNS a decorator function. When you
// write "@replacer('')", JavaScript:
//   1. Calls replacer('') — the factory — passing your argument.
//   2. Receives the inner decorator function it returns.
//   3. Uses that returned function as the decorator.
//
// In other words, the factory's job is to capture configuration via
// its parameters and produce a customized decorator that closes over
// those values.
//
// The same pattern works for class, method, and field decorators —
// any kind of decorator can be wrapped in a factory.

// The OUTER function is the factory. It accepts whatever configuration
// the decorator should be customized with — here, a generic "initValue"
// of type T. Using a generic instead of a concrete type lets the same
// factory work with any value type (strings, numbers, objects, etc.).
function replacer<T>(initValue: T) {
  // The INNER function is the actual decorator. Its signature is
  // exactly the same as the standalone field decorator from before:
  // (target: undefined, ctx: ClassFieldDecoratorContext).
  return function replacerDecorator(
    target: undefined,
    ctx: ClassFieldDecoratorContext
  ) {
    console.log(target);
    console.log(ctx);

    // The initializer captures "initValue" from the surrounding
    // factory call via closure, and returns it as the new field
    // value — replacing whatever the class had originally declared.
    return (initialValue: any) => {
      console.log(initialValue);
      return initValue;
    };
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
//
// EXECUTION ORDER OBSERVATION:
//
// When this file runs, the @autobind logs appear BEFORE the @logger
// logs from the class decorator. That is because each decorator runs
// only after the thing it is attached to has finished initializing.
// Methods finish initializing before the surrounding class does — so
// method decorators fire first, then the class decorator wraps up the
// whole class definition.
// The Person class no longer needs a manual binding constructor —
// @autobind on the greet method takes care of it automatically.
@logger
class Person {
  // @replacer('') is a decorator FACTORY CALL — note the parentheses.
  // The factory runs first with the empty-string argument, returns the
  // actual field decorator, and that decorator is what gets attached.
  @replacer('')
  public name = 'Max';

  @autobind
  greet() {
    console.log('Hi, I am ' + this.name);
  }
}

// THE "this" PROBLEM — fixed automatically by @autobind.
//
// As shown previously, calling "max.greet()" works because "this"
// refers to max. But pulling the method out into a standalone variable
// and then calling "greet()" would normally lose that context — "this"
// becomes undefined.
//
// Now that @autobind is in place, the initializer it registers runs
// during instance construction and replaces "greet" with a version
// permanently bound to the new instance. As a result, the standalone
// call below runs without errors.
//
// FIELD DECORATOR EFFECT — note that "Hi, I am" is followed by an
// empty string, not "Max". The @replacer('') factory produced a
// field decorator whose initializer returns the configured empty
// string, replacing the original 'Max' value of the name field on
// every Person instance.
const max = new Person();
const greet = max.greet;
greet();

// =====================================================================
// SECTION SUMMARY — what was covered (and what comes next).
// =====================================================================
//
// This section introduced the modern, standard ECMAScript decorator
// model and worked through:
//
//   - Class decorators (logger): how to log information about a class
//     and how to return a replacement class to inject behavior into
//     every constructor call.
//   - Method decorators (autobind): how to register an initializer to
//     fix the JavaScript "this" binding problem automatically, and
//     how to return a replacement function to wrap the original.
//   - Field decorators (replacer): how to inspect and replace a
//     field's value via the returned initializer function.
//   - Decorator factories: wrapping any of the above in an outer
//     function so the decorator can be configured at the use site
//     with arguments such as @replacer('').
//
// The next section moves on to the EXPERIMENTAL (LEGACY) decorators —
// the older TypeScript-only flavor that requires the
// "experimentalDecorators" flag in tsconfig.json. Even though the
// modern ECMAScript decorators covered here are the future of the
// feature, the legacy form remains important because most existing
// TypeScript projects that use decorators today were built against it.
