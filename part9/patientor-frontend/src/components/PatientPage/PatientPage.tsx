import { useEffect, useState } from "react";

import patients from "../../services/patients";
import { Diagnosis, Gender, NewEntry, Patient } from "../../types";
import { useParams } from "react-router-dom";
import axios from "axios";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import diagnoseService from "../../services/diagnoseService";
import EntryDetails from "./EntryDetails";
import NewEntryDetails from "./NewEntryDetails";
import {
  Alert,
  AlertTitle,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case "male":
      return <MaleIcon />;
      break;
    case "female":
      return <FemaleIcon />;
      break;
    default:
      return "other";
  }
};

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [errorMessage, setErrorMessage] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectChoice, setSelectChoice] = useState("HealthCheck");

  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const patient = await patients.getPatientById(id);
          setPatient(patient);
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && typeof error === "string") {
            setErrorMessage(error);
            setTimeout(() => {
              setErrorMessage("");
            }, 2000);
          } else {
            setErrorMessage("Unknown axios error: " + error);
          }
        }
      }
    };
    void fetchPatient();

    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getDiagnoses();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnoses();
  }, [id]);

  if (!patient) return <div>{errorMessage}</div>;
  if (!diagnoses) return <div>Loading...</div>;

  const style = {
    border: "1px solid black",
    padding: "5px",
    margin: "5px 0px",
    borderRadius: "5px",
  };

  const submitNewEntry = async (values: NewEntry) => {
    if (id) {
      try {
        const newEntry = await patients.createEntry(values, id);
        const updatePatient = { ...patient, entries: patient.entries.concat(newEntry) };
        setPatient(updatePatient);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error?.response?.data && typeof error?.response?.data === "string") {
            const message = error?.response?.data;
            setErrorMessage(message);
            setTimeout(() => {
              setErrorMessage("");
            }, 2000);
          }
        } else {
          console.log(error);
        }
      }
    }
  };

  const onCancel = () => {
    setShowEntryForm(false);
  };

  return (
    <div>
      <div>
        <h2>
          {patient.name} <GenderIcon gender={patient.gender} />
        </h2>
        <p>ssh: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
      </div>
      <div>
        {errorMessage && (
          <Alert severity="error">
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        )}
      </div>
      <div>
        <Button variant="contained" onClick={() => setShowEntryForm(true)}>
          Add new entry
        </Button>
        <FormControl fullWidth style={{ marginTop: 10 }}>
          <InputLabel>Select</InputLabel>
          <Select
            label="Select"
            value={selectChoice}
            onChange={({ target }) => setSelectChoice(target.value)}
          >
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthCare">OccupationalHealthCare</MenuItem>
          </Select>
        </FormControl>

        {showEntryForm && (
          <div style={{ border: "2px dotted gray", padding: "10px" }}>
            <NewEntryDetails
              onSubmit={submitNewEntry}
              onCancel={onCancel}
              selectedChoice={selectChoice}
            />
          </div>
        )}
      </div>
      <div>
        <h3>entries</h3>
        {patient.entries.map((entry) => (
          <div style={style} key={entry.id}>
            <EntryDetails entry={entry} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPage;
