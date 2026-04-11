// =====================================================================
// LESSON 163: STARTING SETUP — DRAG & DROP PROJECT MANAGER
// =====================================================================
//
// GOAL OF THE SECTION:
// Build a small project-management web app that lets the user enter
// project details (title, description, number of people) via a form,
// display those projects in two lists (Active and Finished), and move
// items between the lists via drag-and-drop.
//
// The goal is not the app itself but to apply what has been learned so
// far in the course: classes, interfaces, generics, decorators, etc.
//
// ONE-FILE APPROACH:
// Throughout this section, ALL code is written in this single app.ts
// file. The file will grow large — that is intentional. A later section
// introduces modules and namespaces for splitting code across files.
// For now, keep everything here to avoid distractions.
//
// STARTING SETUP (performed in this lesson):
//   1. index.html has been replaced with a new version that includes:
//      - A link to app.css for styling
//      - Three <template> tags defining the markup for the input form,
//        a single project list item, and a project list section
//      - An empty <div id="app"> where TypeScript will render content
//   2. app.css has been added with the finished visual styling. It is
//      pure CSS — unrelated to TypeScript — so it is not discussed here.
//
// WHY <template> TAGS?
// A <template> element holds inline HTML that the browser does NOT
// render. Its contents live in the DOM but are inert until JavaScript
// (or TypeScript) explicitly clones them and inserts them elsewhere.
// This gives us a clean way to store reusable chunks of markup inside
// the HTML file while keeping the visible page empty until our code
// decides what to show.
//
// APPLICATION RENDER FLOW (to be implemented in upcoming lessons):
//   1. Render the input form (cloned from the #project-input template)
//      into the #app container.
//   2. Listen for form submission, read the entered values, and
//      validate them.
//   3. Create a new project object and store it in an array.
//   4. Render the array as list items (cloned from the #single-project
//      template) inside a project-list section (cloned from the
//      #project-list template).
//   5. Render two project-list sections — one for Active, one for
//      Finished — and allow drag-and-drop between them.
//
// No TypeScript code is written in this lesson. Implementation begins
// in the next lesson.

// Code goes here!
