interface CommandLineValues {
  target: number;
  exerciseHours: number[];
}

const parseArguments = (arg: string[]): CommandLineValues => {
  if (arg.length < 4) throw new Error("Not enough arguments");

  const [, , target, ...params] = arg;
  const exerciseHours = params.map(Number);

  if (!isNaN(Number(target)) && !exerciseHours.includes(NaN)) {
    return {
      target: Number(target),
      exerciseHours: exerciseHours,
    };
  } else {
    throw new Error("Provided values are not numbers");
  }
};

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  target: number,
  exerciseHours: number[]
): Result => {
  const trainingDays = exerciseHours.filter((item) => item);
  const totalHours = trainingDays.reduce((acc, cur) => acc + cur);
  const average = totalHours / exerciseHours.length;
  const success = average >= target;

  const getRatings = (): number => {
    if (average >= target) {
      return 3;
    } else if (average < target && average > target - 0.5) {
      return 2;
    } else if (average <= target - 1) {
      return 1;
    } else throw new Error("not getting rating");
  };

  const getRatingDescription = (): string => {
    if (average >= target) return "Very nice, You are doing awesome";
    if (average < target && average > target - 0.5)
      return "not to bad but could be better";
    if (average < target - 1) return "bad";
    else throw new Error("can not get rating description");
  };

  return {
    periodLength: exerciseHours.length,
    trainingDays: trainingDays.length,
    success: success,
    rating: getRatings(),
    ratingDescription: getRatingDescription(),
    target: target,
    average: average,
  };
};

try {
  const { target, exerciseHours } = parseArguments(process.argv);
  console.log(calculateExercises(target, exerciseHours));
} catch (error: unknown) {
  let errorMessage = "Something bad happened";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

export const parseReqAndCalculateExercises = (
  target: number,
  excercises: number[]
) => {
  const exerciseHours = excercises.map(Number);
  if (excercises.length === 0) throw new Error("parameter missing");

  if (!isNaN(Number(target)) && !exerciseHours.includes(NaN)) {
    return calculateExercises(Number(target), exerciseHours);
  } else throw new Error("malformatted parameters");
};
