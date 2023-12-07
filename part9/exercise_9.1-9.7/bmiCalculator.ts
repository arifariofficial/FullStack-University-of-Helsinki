export interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values are not numbers");
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / (height * 0.01) ** 2;
  if (bmi < 18.4) return "Under (Unhealthy weight)";
  if (bmi > 18.4 && bmi < 24.9) return "Normal (healthy weight)";
  if (bmi > 24.0) return "Over (Unhealthy weight)";
  else throw new Error("can not get bmi");
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

export const parseQueryAndCalculateBmi = (
  height: number,
  weight: number
): string => {
  if (!height || !weight) throw new Error("malformatted parameters");

  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    const bmi = calculateBmi(height, weight);
    return bmi;
  } else {
    throw new Error("malformatted parameters");
  }
};
