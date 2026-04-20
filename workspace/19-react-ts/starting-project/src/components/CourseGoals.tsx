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

// =====================================================================
// LESSON 240 — FUNCTION PROPS FOR PARENT-CHILD COMMUNICATION.
// =====================================================================
//
// The delete button lives inside CourseGoals, but the goals state lives
// in App (the parent). To delete a goal, the child must notify the
// parent. In React, this is done by passing a FUNCTION DOWN as a prop.
// The child invokes that function, and the parent's handler runs —
// updating state at the correct level.
//
// TYPING A FUNCTION PROP:
// The "onDelete" prop is typed as a FUNCTION TYPE using arrow-style
// syntax in a type position:
//
//   onDelete: (id: number) => void;
//
// Left of the arrow: the parameters the function must accept.
// Right of the arrow: the return type. Here the handler is called for
// its side effect (updating state), so the return is "void".
//
// You could also make the prop optional (onDelete?: (...) => void)
// if a component can function without the callback — we do not here.

interface CourseGoalsProps {
  goals: Goal[];
  onDelete: (id: number) => void;
}

export default function CourseGoals({ goals, onDelete }: CourseGoalsProps) {
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
              The onClick handler uses an inline arrow function to
              forward goal.id to the parent's onDelete callback. We
              cannot write onClick={onDelete} directly because the
              button's click handler would pass a MouseEvent, not the
              goal id. Wrapping in an arrow function lets us control
              which argument is actually forwarded.
            */}
            <button onClick={() => onDelete(goal.id)}>Delete</button>
          </article>
        </li>
      ))}
    </ul>
  );
}
