import express from "express";
import { NewEntry, NewPatient } from "../types";
import { toNewEntry, toNewPatient } from "../utils";
import {
  addNewEntry,
  createPatient,
  getNonSensitivePatientData,
  getPatientById,
} from "../services/patientService";

const patientRouter = express.Router();

patientRouter.get("/", (_req, res) => {
  res.send(getNonSensitivePatientData());
});

patientRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  const patient = getPatientById(id);
  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

patientRouter.post("/", (req, res) => {
  try {
    const newPatientEntry: NewPatient = toNewPatient(req.body);
    const newPatient = createPatient(newPatientEntry);
    res.send(newPatient);
  } catch (error: unknown) {
    let errorMessage = "Somthing bad happened";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

patientRouter.post("/:id/entries", (req, res) => {
  try {
    const id = req.params.id;
    const newEntry: NewEntry = toNewEntry(req.body);
    const entry = addNewEntry(newEntry, id);
    res.send(entry);
  } catch (error: unknown) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default patientRouter;
