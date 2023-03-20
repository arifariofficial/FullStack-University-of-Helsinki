const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercise}
    </p>
  );
};

const Content = (props) => {
  return (
    <>
      <Part name={props.parts[0].name} exercise={props.parts[0].exercises1} />
      <Part name={props.parts[1].name} exercise={props.parts[1].exercises2} />
      <Part name={props.parts[2].name} exercise={props.parts[2].exercises3} />
    </>
  );
};

const Total = (props) => {
  return (
    <p>
      Number of exercises{" "}
      {props.parts[0].exercises1 +
        props.parts[1].exercises2 +
        props.parts[2].exercises3}
    </p>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises1: 10,
      },
      {
        name: "Using props to pass data",
        exercises2: 7,
      },
      {
        name: "State of a component",
        exercises3: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
