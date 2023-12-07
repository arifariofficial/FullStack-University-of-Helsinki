import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { Diagnosis, HealthCheckRating, NewEntry } from "../../types";
import diagnoseService from "../../services/diagnoseService";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

interface HealthCheckRatingOption {
  value: number;
  label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = Object.values(HealthCheckRating)
  .filter((item) => typeof item === "number")
  .map((item) => ({
    value: item as number,
    label: HealthCheckRating[item as number],
  }));

const HealthCheckForm = ({ onSubmit, onCancel }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis["code"]>>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

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
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes,
    });
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent) => {
    event.preventDefault();

    const value = Number(event.target.value);

    const ratingHealthCheck = Object.values(HealthCheckRating);
    if (value && ratingHealthCheck.includes(value)) {
      setHealthCheckRating(value);
    }
  };

  const onDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();

    const value = event.target.value;
    typeof value === "string" ? setDiagnosisCodes(value.split(", ")) : setDiagnosisCodes(value);
  };

  return (
    <div>
      <h4>New HealthCheck entry</h4>
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
        <FormControl fullWidth style={{ marginTop: 10 }}>
          <InputLabel>HealthCheck rating</InputLabel>
          <Select
            onChange={onHealthCheckRatingChange}
            value={healthCheckRating.toString()}
            label="HealthCheck rating"
          >
            {healthCheckRatingOptions.map((item) => (
              <MenuItem key={item.label} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default HealthCheckForm;
