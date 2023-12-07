import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import diagnoseService from "../../services/diagnoseService";
import { Diagnosis, NewEntry } from "../../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const HospitalForm = ({ onSubmit, onCancel }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis["code"]>>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [dateDischarge, setDateDischarge] = useState("");
  const [criteria, setCriteria] = useState("");

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const getDiagnoses = await diagnoseService.getDiagnoses();
      setDiagnoses(getDiagnoses);
    };
    void fetchDiagnoses();
  }, []);

  if (!diagnoses) return null;

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      type: "Hospital",
      description,
      date,
      specialist,
      discharge: {
        date: dateDischarge,
        criteria: criteria,
      },
      diagnosisCodes,
    });
  };

  const onDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();

    const value = event.target.value;
    typeof value === "string" ? setDiagnosisCodes(value.split(", ")) : setDiagnosisCodes(value);
  };
  return (
    <div>
      <h4>New Hospital entry</h4>
      <form onSubmit={addEntry}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(event.target.value)
          }
        />
        <InputLabel>Date</InputLabel>
        <TextField
          type="date"
          fullWidth
          value={date}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate(event.target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSpecialist(event.target.value)
          }
        />
        <InputLabel style={{ marginTop: 10 }}>Discharge</InputLabel>
        <InputLabel style={{ marginTop: 10 }}>Date</InputLabel>
        <Input
          type="date"
          fullWidth
          value={dateDischarge}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setDateDischarge(event.target.value)
          }
        />
        <TextField
          style={{ marginTop: 10 }}
          label="Criteria"
          fullWidth
          value={criteria}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCriteria(event.target.value)}
        />

        <FormControl fullWidth style={{ marginTop: 10 }}>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            onChange={onDiagnosisChange}
            value={diagnosisCodes}
            label="Diagnosis Codes"
          >
            {diagnoses.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container justifyContent="space-between" padding="5px">
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default HospitalForm;
