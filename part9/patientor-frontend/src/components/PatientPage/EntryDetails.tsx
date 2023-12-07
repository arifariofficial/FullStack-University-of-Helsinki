import {
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../../types";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";

const HealthCheckRate = ({ healthCheckRating }: { healthCheckRating: HealthCheckRating }) => {
  if (healthCheckRating === 0) {
    return (
      <div style={{ color: "green" }}>
        <FavoriteIcon color="inherit" />
      </div>
    );
  } else if (healthCheckRating === 1) {
    return (
      <div style={{ color: "yellow" }}>
        <FavoriteIcon color="inherit" />
      </div>
    );
  } else {
    return (
      <div style={{ color: "red" }}>
        <FavoriteIcon color="inherit" />
      </div>
    );
  }
};

const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <div>
      <div>
        {entry.date}
        <MedicalServicesIcon />
      </div>
      <div>{entry.description}</div>
      <HealthCheckRate healthCheckRating={entry.healthCheckRating} />
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};
const Hospital: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div>
      <div>
        {entry.date} <LocalHospitalIcon />
      </div>
      <div>{entry.description}</div>
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};
const OccupationalHealthCheck: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <div>
      <div>
        {entry.date} <WorkIcon />
      </div>
      <div>{entry.description}</div>
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheck entry={entry} />;
    case "Hospital":
      return <Hospital entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthCheck entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
