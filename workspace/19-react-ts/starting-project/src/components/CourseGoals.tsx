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
