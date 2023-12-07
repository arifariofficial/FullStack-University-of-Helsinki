import express from "express";
import { parseQueryAndCalculateBmi } from "./bmiCalculator";
import { parseReqAndCalculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
  try {
    const { height, weight } = req.query;

    const bmi = parseQueryAndCalculateBmi(Number(height), Number(weight));

    const obj = { height: height, weight: weight, bmi: bmi };

    res.status(200).send(JSON.stringify(obj));
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = { error: error.message };
      res.status(400).send(errorMessage);
    }
  }
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const exerciseHours: number[] = daily_exercises.map(Number);

  try {
    if (!target || !daily_exercises) throw new Error("parameter missing");
    res
      .status(200)
      .send(
        JSON.stringify(
          parseReqAndCalculateExercises(Number(target), exerciseHours)
        )
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = { error: error.message };
      res.status(400).send(errorMessage);
    }
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
