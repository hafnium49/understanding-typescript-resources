// FLEXIBLE TYPES — when a single type is too restrictive.
//
// Sometimes a variable legitimately needs to hold more than one type of
// value. For example, a function might accept either a numeric ID or a
// string ID, or a variable might be a number or null before initialization.
//
// THE "any" TYPE — a last resort for flexibility.
//
// One option is to annotate the variable with "any" (e.g., let age: any).
// This tells TypeScript to accept every possible type of value — numbers,
// strings, booleans, objects, arrays, and anything else.
//
// The problem: using "any" effectively disables type checking for that
// variable, putting you back in plain JavaScript territory. The whole
// purpose of TypeScript is to restrict which values are allowed where,
// and "any" removes that protection entirely.
//
// BEST PRACTICE: Only use "any" as a true last resort when you genuinely
// cannot be more specific. In nearly all cases, a UNION TYPE (shown below)
// is the better choice.
//
// UNION TYPES — precise flexibility with the "|" (pipe) operator.
//
// Instead of "any", list exactly the types you want to allow, separated
// by "|". You can chain as many types as needed (e.g., string | number |
// boolean) — just add another pipe and type name for each additional type.
//
// GUIDING PRINCIPLE: Be as specific as possible. If only one type makes
// sense, use a single type. If you genuinely need multiple types, use a
// union. Only fall back to "any" when you truly cannot narrow it down.
let age: string | number = 36;

// ... imagine more application code in between ...

// Valid: '37' is a string, which the union type explicitly allows.
age = '37';

// The lines below would pass without errors if "age" were typed as "any",
// but with the union type "string | number" TypeScript flags them —
// booleans, objects, and arrays are not in the allowed set. This is
// exactly why union types are preferred over "any": they permit only
// what you intend.
age = false;
age = {};
age = [];