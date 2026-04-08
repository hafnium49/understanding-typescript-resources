// =====================================================================
// MULTIPLE DECORATORS & EXECUTION ORDER.
// =====================================================================
//
// You can stack as many decorators as you like on a single class (and
// later, on methods, accessors, properties, and parameters too). When
// multiple decorators are present, two distinct execution phases occur,
// and they run in OPPOSITE orders. Understanding which phase runs in
// which order is important for predicting side effects.
//
// PHASE 1 — DECORATOR FACTORY EXECUTION (top → bottom):
// The factory functions themselves run in the order they appear in
// the source code. This is just normal JavaScript: each line with
// "@Factory(...)" calls the factory immediately to get back the actual
// decorator function. Because the factories appear top-to-bottom in
// the source, they are called top-to-bottom — exactly like any other
// sequence of function calls.
//
// PHASE 2 — DECORATOR FUNCTION EXECUTION (bottom → top):
// Once all factories have produced their inner decorator functions,
// those inner functions are then applied to the class. The application
// happens in REVERSE order — the decorator closest to the class runs
// first, and the one furthest from the class runs last. This bottom-up
// behavior is the standard for decorator composition (it mirrors how
// nested function calls evaluate from the inside out).
//
// To make these two phases observable, each factory below logs as soon
// as it runs (Phase 1), and each inner decorator logs again when it
// actually executes (Phase 2). Watching the console reveals the order:
//
//   1. LOGGER FACTORY        ← Phase 1 (top factory called first)
//   2. TEMPLATE FACTORY      ← Phase 1 (bottom factory called next)
//   3. Rendering template    ← Phase 2 (bottom decorator runs first)
//   4. LOGGING               ← Phase 2 (top decorator runs last)
//   5. (constructor dump)
//   6. Creating person object...   ← from "new Person()" below
//   7. (the pers object dump)

function Logger(logString: string) {
  // Runs in Phase 1 — when @Logger('LOGGING') is encountered top-to-bottom.
  console.log('LOGGER FACTORY');
  return function(constructor: Function) {
    // Runs in Phase 2 — bottom-up, so this fires AFTER WithTemplate's
    // inner decorator finishes.
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  // Runs in Phase 1 — called second because @WithTemplate sits below
  // @Logger in the source.
  console.log('TEMPLATE FACTORY');
  return function(constructor: any) {
    // Runs in Phase 2 — fires FIRST because it is the bottom-most
    // decorator (closest to the class).
    console.log('Rendering template');
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  }
}

// Two decorators stacked on the same class. The order in the source
// determines factory call order (top first), but the actual decorator
// applications happen in reverse — WithTemplate runs before Logger.
// @Logger('LOGGING - PERSON')
@Logger('LOGGING')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);
