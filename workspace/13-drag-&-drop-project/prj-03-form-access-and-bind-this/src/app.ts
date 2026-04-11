// =====================================================================
// LESSON 165: FORM ACCESS, EVENT LISTENER, AND THE "this" BINDING PROBLEM
// =====================================================================
//
// Building on the previous lesson, this lesson adds:
//   1. An id on the rendered <form> so the existing CSS styles apply.
//   2. References to the three <input> elements inside the form so we
//      can later read the values the user enters.
//   3. A submit event listener that prevents the default page reload
//      and logs the entered title to the console.
//   4. A fix for the classic JavaScript "this" binding problem that
//      appears when a class method is passed as an event callback.

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  // THREE NEW FIELDS — references to the form's input elements.
  // Each is typed as HTMLInputElement so TypeScript knows about
  // input-specific properties like ".value" when we read them later.
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // Assign an id to the cloned <form>. The app.css file includes a
    // rule targeting "#user-input" (margin, padding, background) — so
    // setting this id here is what actually activates that styling
    // on the rendered element.
    this.element.id = 'user-input';

    // QUERYSELECTOR vs. GETELEMENTBYID.
    //
    // Inside this class, we search for inputs WITHIN this.element
    // (the cloned form), not the whole document. querySelector accepts
    // CSS-style selectors (e.g., "#title") and returns the first match.
    //
    // Its return type is "Element | null", even more generic than
    // getElementById's return type, so a type assertion is needed to
    // tell TypeScript these are input elements.
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    // Call configure() BEFORE attach() so the submit listener is
    // attached to the form element while we still hold a reference
    // to it in memory. (The order does not actually matter for the
    // listener itself, but keeping configuration before attachment
    // is a clean habit.)
    this.configure();
    this.attach();
  }

  // THE SUBMIT HANDLER — called when the form is submitted.
  //
  // event.preventDefault() cancels the browser's default behavior
  // for a form submission (an HTTP request + full-page reload), so
  // we can handle the data entirely in JavaScript.
  //
  // For now we just log the current title value to confirm everything
  // is wired up. Reading the inputs and creating a project object
  // happens in a later lesson.
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  // CONFIGURATION — wire up the submit event listener.
  //
  // THE "this" BINDING PROBLEM:
  // When a class method is passed directly as an event callback
  // (e.g., addEventListener('submit', this.submitHandler)), JavaScript
  // eventually invokes it with "this" bound to the ELEMENT that fired
  // the event — NOT the class instance. So "this.titleInputElement"
  // inside submitHandler would blow up with "Cannot read property
  // 'value' of undefined" because "this" points at the <form> element,
  // which has no such property.
  //
  // THE FIX: call .bind(this) on the method. bind() returns a new
  // function with its "this" context permanently locked to whatever
  // you pass in. Here we pass the current class instance (the "this"
  // inside configure() refers to the ProjectInput instance), so the
  // callback keeps pointing at the instance when it later executes.
  //
  // NOTE: A cleaner alternative using a custom "autobind" decorator
  // exists, and is covered in a later lesson.
  private configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
