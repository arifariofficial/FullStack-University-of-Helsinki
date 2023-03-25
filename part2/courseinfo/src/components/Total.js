import React from "react";

const Total = ({ parts }) => {
  return (
    <h4>
      total of{" "}
      {parts.reduce((sum, part) => {
        sum += part.exercises;
        return sum;
      }, 0)}{" "}
      exercises
    </h4>
  );
};

export default Total;
