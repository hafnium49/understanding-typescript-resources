// LESSON 185 — Moved from app.ts into decorators/ subfolder.
// Renamed from "autobind-decorator.ts" to just "autobind.ts" because
// the folder name already indicates it contains decorators — no need
// for a redundant prefix.
namespace App {
  export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      }
    };
    return adjDescriptor;
  }
}
