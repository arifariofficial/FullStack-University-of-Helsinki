import { NewEntry } from "../../types";
import HealthChecForm from "./HealthCheckForm";
import HospitalForm from "./HospitalForm";
import OccupationalHealthCareForm from "./OccupationHealthCareForm";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  selectedChoice: string;
}

const NewEntryDetails = ({ onSubmit, onCancel, selectedChoice }: Props) => {
  switch (selectedChoice) {
    case "HealthCheck":
      return <HealthChecForm onSubmit={onSubmit} onCancel={onCancel} />;
    case "Hospital":
      return <HospitalForm onSubmit={onSubmit} onCancel={onCancel} />;
    case "OccupationalHealthCare":
      return <OccupationalHealthCareForm onSubmit={onSubmit} onCancel={onCancel} />;
  }
};

export default NewEntryDetails;
