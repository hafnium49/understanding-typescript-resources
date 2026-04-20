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
// ({ image }: HeaderProps). This pulls the named property out of the
// props object into a local binding — purely a JavaScript feature, but
// very common in React components.
//
// NESTED OBJECT TYPE:
// "image" is itself an object with "src" and "alt" string properties.
// This nested shape is declared inline. You could instead define the
// inner object as its own named type and reference it here — either
// style works.

type HeaderProps = {
  image: {
    src: string;
    alt: string;
  };
};

export default function Header({ image }: HeaderProps) {
  // SPREADING OBJECT PROPERTIES AS JSX PROPS:
  // The <img> element expects "src" and "alt" attributes (among others).
  // Since "image" is an object with exactly those keys, spreading it
  // with {...image} passes each key-value pair as an individual prop
  // on the <img> tag. This works because the shape of the "image"
  // object matches the attributes the <img> element accepts.
  return (
    <header>
      <img {...image} />
    </header>
  );
}
