import patients from "../../data/patients";
import { Entry, NewEntry, NewPatient, NonSensitivePatientEntry, Patient } from "../types";
import { v1 as uuid } from "uuid";

export const getNonSensitivePatientData = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find((item) => item.id === id);
};

export const createPatient = (PatientObj: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...PatientObj,
  };
  patients.push(newPatient);
  return newPatient;
};

export const addNewEntry = (entryObj: NewEntry, PatientId: string): Entry => {
  const newEntry = {
    id: uuid(),
    ...entryObj,
  };
  patients.map((item) =>
    item.id === PatientId ? (item.entries ? item.entries.push(newEntry) : item) : item
  );
  return newEntry;
};
