// =====================================================================
// LESSON 237 — LIST OF GOALS COMPONENT WITH TYPED ARRAY PROPS.
// =====================================================================
//
// TYPE + INTERFACE INTERCHANGEABLE:
// Below, "CourseGoalsProps" is declared with "interface" and "Goal" is
// declared with "type". Both work equivalently here — the choice is a
// style preference. Some teams prefer "interface" for public component
// APIs and "type" for smaller data shapes, but neither rule is required.
//
// NESTED DATA TYPES:
// Each list item in "goals" follows the "Goal" shape. Describing it as
// its own named type (rather than inline) keeps the props declaration
// readable and makes "Goal" reusable elsewhere in the app.
//
// REACT KEY PROP:
// When rendering a list with .map(), React requires each generated
// element to have a unique "key" prop. This lets React efficiently
// track which items changed, were added, or were removed between
// renders. "key" is a React rule, not a TypeScript one — but using
// a typed id field (like goal.id: number) makes it easy to satisfy.
//
// =====================================================================
// LESSON 238 — AN ALTERNATIVE WAY TO TYPE COMPONENTS (FC / FunctionComponent).
// =====================================================================
//
// You may encounter an older style in some codebases that types
// components using React's "FC" (alias for "FunctionComponent")
// generic type. It looks like this:
//
//   import { FC } from 'react';
//
//   const CourseGoals: FC<CourseGoalsProps> = ({ goals }) => {
//     return <ul>...</ul>;
//   };
//
//   export default CourseGoals;
//
// HOW IT WORKS:
//   - The component is written as a CONST holding an arrow function,
//     rather than a named function declaration.
//   - "FC" is a GENERIC TYPE: you pass the props type inside angle
//     brackets as a type parameter (FC<CourseGoalsProps>).
//   - TypeScript maps the type parameter to the component's props
//     argument, so destructuring "{ goals }" works without an explicit
//     annotation on the parameter itself.
//
// WHY IT IS NO LONGER RECOMMENDED:
//   - More verbose than annotating the parameter directly.
//   - Historically added an implicit "children" prop even for components
//     that did not accept children, which caused confusion.
//   - Modern React docs recommend the direct parameter annotation style
//     used below.
//
// This code uses the recommended direct-annotation style — no "FC"
// import needed.

type Goal = {
  id: number;
  title: string;
  description: string;
};

interface CourseGoalsProps {
  goals: Goal[];
}

export default function CourseGoals({ goals }: CourseGoalsProps) {
  return (
    <ul>
      {goals.map((goal) => (
        <li key={goal.id}>
          <article>
            <div>
              <h2>{goal.title}</h2>
              <p>{goal.description}</p>
            </div>
            {/*
              The delete button has no handler yet — it will be wired up
              in a later lesson, once we introduce state management for
              the goals list.
            */}
            <button>Delete</button>
          </article>
        </li>
      ))}
    </ul>
  );
}
