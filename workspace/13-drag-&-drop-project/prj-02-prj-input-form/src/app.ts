// =====================================================================
// LESSON 164: RENDERING THE PROJECT-INPUT FORM (OOP APPROACH)
// =====================================================================
//
// GOAL:
// Make the form defined inside the <template id="project-input"> tag
// visible on the page by cloning its contents and inserting them into
// the <div id="app"> container.
//
// APPROACH:
// An object-oriented design using a class. Each instance of the class
// is responsible for one rendered form. Wrapping the logic in a class
// is optional — the same thing can be done with free functions — but
// classes give us a clean place to group related state (references to
// DOM elements) and behavior (selecting, cloning, attaching).
//
// DEV WORKFLOW REMINDER (from the previous lesson):
//   Terminal 1:  npm start   → lite-server serves index.html
//   Terminal 2:  tsc -w      → recompiles on every save

class ProjectInput {
  // FIELD DECLARATIONS — required in TypeScript.
  //
  // Each instance needs three DOM references:
  //   - templateElement: the <template> tag that holds the form markup.
  //   - hostElement:     the container element to render the form into.
  //   - element:         the cloned <form> extracted from the template.
  //
  // Typing each field precisely (instead of generic HTMLElement) gives
  // us access to subtype-specific properties later — e.g., ".content"
  // on an HTMLTemplateElement is NOT available on a plain HTMLElement.
  //
  // These specific DOM types (HTMLTemplateElement, HTMLDivElement,
  // HTMLFormElement) are globally available because the "dom" library
  // is included in the tsconfig.json "lib" setting.
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    // SELECTING DOM ELEMENTS — two TypeScript concerns at once.
    //
    // document.getElementById() is typed as "HTMLElement | null":
    //   - It might return null if no element with that id exists.
    //   - It returns the generic HTMLElement, not any specific subtype.
    //
    // Two techniques are combined on each lookup below:
    //
    //   1. NON-NULL ASSERTION (!) — tells TypeScript "I guarantee this
    //      will not be null here." Used when you are confident the
    //      element exists (e.g., you control index.html). If wrong,
    //      you will get a runtime error instead of a compile error.
    //
    //   2. TYPE ASSERTION (as X) — narrows the generic HTMLElement to
    //      the specific subtype you know it is. Without this, you
    //      could not access HTMLTemplateElement-specific properties
    //      like ".content" further down.
    //
    // SAFER ALTERNATIVE (not used here because we are confident the
    // elements exist): store the result in a const, check truthiness,
    // and assign inside the if-block with a fallback in the else.
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // CLONING THE TEMPLATE CONTENT.
    //
    // A <template> tag's markup is stored in its ".content" property
    // as a DocumentFragment — an inert, off-screen DOM subtree that
    // the browser does not render until you insert it somewhere.
    //
    // document.importNode(node, deep) creates a copy that is safe to
    // attach to the live document. The second argument "true" enables
    // DEEP cloning, so all nested children are copied as well. Without
    // deep cloning, only the fragment's top-level wrapper is copied.
    //
    // TypeScript infers importedNode as DocumentFragment. A fragment
    // itself cannot be inserted as-is via insertAdjacentElement — we
    // need the concrete element inside it, which is the first (and in
    // this case only) child: the <form>.
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    // firstElementChild is typed as "Element | null" — generic, and
    // possibly null. A type assertion tells TypeScript this is the
    // form element we know it is.
    this.element = importedNode.firstElementChild as HTMLFormElement;

    // Call the private render method so the form appears immediately
    // when an instance of this class is created.
    this.attach();
  }

  // PRIVATE HELPER METHOD — keeps the rendering logic separate from
  // the selection/cloning logic in the constructor. "private" means
  // it can only be called from inside the class.
  private attach() {
    // insertAdjacentElement(position, element) is a built-in DOM
    // method for inserting an element relative to another element.
    // The position argument must be one of four string literals:
    //
    //   "beforebegin" — before the target element itself
    //   "afterbegin"  — inside the target, as its FIRST child
    //   "beforeend"   — inside the target, as its LAST child
    //   "afterend"    — after the target element itself
    //
    // "afterbegin" places the form at the top of the #app container.
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

// Creating an instance triggers the constructor, which selects the
// template, clones its contents, and attaches the form to the DOM.
// This is what actually makes the form appear on the page.
const prjInput = new ProjectInput();
