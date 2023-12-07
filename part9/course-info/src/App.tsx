interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescription {
  kind: "special";
  requirements: string[];
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic",
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group",
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic",
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background",
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special",
  },
];

const Header = ({ courseName }: { courseName: string }) => {
  return <h1>{courseName}</h1>;
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  const assertNever = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
  };
  switch (coursePart.kind) {
    case "basic":
      return (
        <div>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <p>{coursePart.description}</p>
        </div>
      );
      break;
    case "group":
      return (
        <div>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <p>group project: {coursePart.groupProjectCount}</p>
        </div>
      );
      break;
    case "background":
      return (
        <div>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <p>{coursePart.description}</p>
          <p>submit to {coursePart.backgroundMaterial}</p>
        </div>
      );
      break;
    case "special":
      return (
        <div>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <p>{coursePart.description}</p>
          <p>
            required skills: {coursePart.requirements[0]}, {coursePart.requirements[1]}
          </p>
        </div>
      );
    default:
      return assertNever(coursePart);
      break;
  }
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map((coursePart) => (
        <Part key={coursePart.name} coursePart={coursePart} />
      ))}
    </div>
  );
};

const Total = ({ totalExercises }: { totalExercises: number }) => {
  return <p>Number of exercises {totalExercises}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
