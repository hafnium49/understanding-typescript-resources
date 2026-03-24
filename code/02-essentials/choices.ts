// ENUMS — a fixed set of named options, provided by TypeScript.
//
// When a variable should only accept values from a predefined list (e.g.,
// user roles like admin, editor, guest), raw numbers or strings are
// problematic: numbers are meaningless without comments, and strings are
// easy to mistype. Enums solve both issues.
//
// The "enum" keyword creates a custom type with named constants. Under
// the hood, TypeScript assigns auto-incrementing numbers starting from 0:
//   Admin = 0, Editor = 1, Guest = 2
//
// You can override the starting number (e.g., Admin = 1 makes Editor = 2,
// Guest = 3). You can also assign string values to each option, but then
// every option must have an explicit string — TypeScript cannot auto-
// increment strings the way it does numbers.
//
// Unlike most TypeScript features (which are erased during compilation),
// standard enums produce an actual JavaScript object in the output that
// maps names to values. (A variant called "const enum" can inline values
// instead, but that is covered later.)
//
// NOTE: To follow along with the enums lesson, uncomment the enum below.
// Later lessons in this file introduce type aliases and literal unions as
// an alternative approach to the same "fixed set of choices" problem.

// enum Role {
//   Admin,
//   Editor,
//   Guest,
// }

// TYPE ALIASES — reusable custom type names with the "type" keyword.
//
// A type alias lets you give a name to any type definition so you can
// reuse it in multiple places without repeating the full definition.
// The syntax is: type AliasName = <any type expression>;
//
// You can alias primitives (type MyNumber = number), unions, object
// types, or any other TypeScript type.

// LITERAL TYPES + UNION = a lightweight alternative to enums.
//
// Instead of an enum, you can define a union of specific string literals.
// Each literal (e.g., 'admin') is a LITERAL TYPE — a type that accepts
// only that exact value. Combining them with "|" creates a fixed set of
// allowed values, similar to an enum but without generating extra runtime
// code. This approach is widely preferred in modern TypeScript.
// Example: type MyNumber = number;  (not used — just illustrates the syntax)
type Role = 'admin' | 'editor' | 'guest' | 'reader';

// Type aliases also work with object shapes, letting you define a
// reusable "blueprint" for objects that can be used as a type annotation
// in multiple places (variables, function parameters, return types, etc.).
type User = {
  name: string;
  age: number;
  role: Role;
  permissions: string[];
};

// Using the Role type alias: only 'admin', 'editor', 'guest', or
// 'reader' are accepted. Any other string would produce a compile error.
let userRole: Role = 'admin';

// ...

userRole = 'guest';

// LITERAL TYPES IN TUPLES — restricting values beyond just their type.
//
// A tuple like [number, number] accepts any numbers. You can be more
// precise by using literal types: "1 | -1" means only the exact values
// 1 or -1 are allowed — no other numbers. Each position is independent,
// so this tuple permits four combinations: [1,1], [1,-1], [-1,1], [-1,-1].
let possibleResults: [1 | -1, 1 | -1];

possibleResults = [1, -1];

// Type aliases can be used anywhere a type is expected, including
// function parameters. This ensures all callers pass a valid Role.
function access(role: Role) {
  // ...
}