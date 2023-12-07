import {
  Diagnosis,
  Discharge,
  Gender,
  HealthCheckRating,
  NewEntry,
  NewPatient,
  Sickleave,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string";
};

const parseString = (text: unknown): string => {
  if (!isString(text)) {
    throw new Error("Incorrect or missing text: " + text);
  }
  return text;
};
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("Incorrect or missing dateOfBirth: " + dateOfBirth);
  }
  return dateOfBirth;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((item) => item.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing patient data: " + object);
  }
  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "occupation" in object &&
    "gender" in object
  ) {
    const newPatientEntry = {
      name: parseString(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
      entries: [],
    };
    return newPatientEntry;
  }
  throw new Error("Incorrect or missing patient");
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object) {
    throw new Error("Incorrect or missing diagnosis: " + object);
  }

  return object as Array<Diagnosis["code"]>;
};

const parseSickLeave = (object: unknown): Sickleave => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data" + object);
  }
  if ("startDate" in object && "endDate" in object) {
    const sickLeave = {
      startDate: parseDate(object.startDate),
      endDate: parseDate(object.endDate),
    };
    return sickLeave;
  }

  throw new Error("Incorrect or missing data");
};

const isHealthCheckRating = (param: unknown): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(Number(param));
};

const parseHealthCheckRating = (object: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(object)) {
    throw new Error("Value of healthCheckRating incorrect: " + object);
  }
  return object;
};

const parseDischarge = (object: unknown): Discharge => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing discharge" + object);
  }
  if ("date" in object && "criteria" in object) {
    const sickLeave = {
      date: parseDate(object.date),
      criteria: parseString(object.criteria),
    };
    return sickLeave;
  }
  throw new Error("Incorrect or missing discharge data");
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing newEntry" + object);
  }

  let newEntry;

  if (
    "date" in object &&
    "specialist" in object &&
    "diagnosisCodes" in object &&
    "description" in object
  ) {
    newEntry = {
      date: parseDate(object.date),
      specialist: parseString(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
      description: parseString(object.description),
    };
    if ("type" in object) {
      switch (object.type) {
        case "HealthCheck":
          if ("healthCheckRating" in object) {
            const healthCheckEntry: NewEntry = {
              ...newEntry,
              type: "HealthCheck",
              healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
            };
            return healthCheckEntry;
          }
          throw new Error("Incorrect or missing healthCheck" + object.type);
        case "OccupationalHealthcare":
          if ("employerName" in object && "sickLeave" in object) {
            const occupationalHealthcareEntry: NewEntry = {
              ...newEntry,
              type: "OccupationalHealthcare",
              employerName: parseString(object.employerName),
              sickLeave: parseSickLeave(object.sickLeave),
            };
            return occupationalHealthcareEntry;
          }
          throw new Error("Incorrect or missing occupationalHealthcareEntry: " + object.type);
        case "Hospital":
          if ("discharge" in object) {
            const hospitalEntry: NewEntry = {
              ...newEntry,
              type: "Hospital",
              discharge: parseDischarge(object.discharge),
            };
            return hospitalEntry;
          }
          throw new Error("Incorrect or missing hospitalEntry" + object.type);
        default:
          throw new Error("Incorrect switch (type)");
      }
    }
  }
  throw new Error("Incorrect or missing data");
};
