// =====================================================================
// LESSON 234 — A FIRST TYPED REACT COMPONENT.
// =====================================================================
//
// A React component is just a function that returns JSX. Adding
// TypeScript changes nothing about the function itself — you only add
// TYPE ANNOTATIONS to tell TypeScript what shape the component's props
// should have.
//
// TYPING PROPS:
// React passes all the attributes you set in JSX (e.g., <Header x={1} />)
// as a single "props" OBJECT to the component function. To enforce what
// that object may contain, declare a type (or interface) that describes
// its shape, and annotate the parameter.
//
// Both "type" and "interface" work here — the choice is a matter of
// personal/team preference. The name "HeaderProps" is just a convention;
// any identifier works.
//
// OBJECT DESTRUCTURING:
// Instead of writing (props: HeaderProps) and using "props.image" inside
// the function, the parameter is destructured directly in the signature
// ({ image, children }: HeaderProps). This pulls named properties out
// of the props object into local bindings — purely a JavaScript
// feature, but very common in React components.
//
// NESTED OBJECT TYPE:
// "image" is itself an object with "src" and "alt" string properties.
// This nested shape is declared inline. You could instead define the
// inner object as its own named type and reference it here — either
// style works.
//
// =====================================================================
// LESSON 236 — THE "children" PROP AND THE ReactNode TYPE.
// =====================================================================
//
// React automatically passes any content placed between a component's
// opening and closing JSX tags (e.g., <Header>...</Header>) as a
// special "children" prop. This enables components to act as wrappers
// around arbitrary content.
//
// TypeScript does NOT know about "children" unless you declare it in
// the props type — it is not special-cased. You must add it yourself.
//
// THE ReactNode TYPE:
// The correct type for "children" is "ReactNode", imported from React.
// ReactNode covers anything a React component can render: JSX elements,
// strings, numbers, arrays of the above, null, and more.
//
// Using "import type" (instead of plain "import") tells TypeScript that
// the imported binding is only used as a type, so the import can be
// erased entirely at compile time — no runtime dependency is added.
//
// OPTIONAL PROPS:
// Adding "?" after a property name makes it optional. Without the "?",
// callers MUST pass that prop; with it, they may omit it. This works
// for any prop (including nested ones), exactly like optional function
// parameters elsewhere in TypeScript.

import type { ReactNode } from 'react';

type HeaderProps = {
  image: {
    src: string;
    alt: string;
  };
  children?: ReactNode;
};

export default function Header({ image, children }: HeaderProps) {
  // SPREADING OBJECT PROPERTIES AS JSX PROPS:
  // The <img> element expects "src" and "alt" attributes (among others).
  // Since "image" is an object with exactly those keys, spreading it
  // with {...image} passes each key-value pair as an individual prop
  // on the <img> tag. This works because the shape of the "image"
  // object matches the attributes the <img> element accepts.
  //
  // RENDERING children:
  // Placing {children} inside the JSX inserts whatever the caller put
  // between <Header> and </Header>. When "children" is optional and
  // nothing was passed, it is simply undefined — React renders nothing.
  return (
    <header>
      <img {...image} />
      {children}
    </header>
  );
}
