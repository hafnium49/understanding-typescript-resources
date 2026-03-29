import fs from 'node:fs';

// fs.readFileSync()

let userName: string;

userName = 'Max';

console.log(userName);

// With "strict: true" in tsconfig.json, the "noImplicitAny" rule is
// active. This means parameters without a type annotation produce a
// compile error instead of silently defaulting to "any". If you truly
// want "any" (not recommended), you must write it explicitly — as done
// here — so TypeScript knows it was intentional, not an oversight.
function add(a: any, b: any) {
  return a + b;
}

console.log(add(1, 2));