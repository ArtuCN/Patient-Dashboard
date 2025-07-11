import type { Patient, Filters } from "../models/Patient";
import { calculateAge } from "../utils/dateUtils";

export function filterPatients(patients: Patient[], filters: Filters): Patient[] {
  return patients.filter((patient) => {
    const nameMatch =
      patient.familyName.toLowerCase().includes(filters.text.toLowerCase()) ||
      patient.givenName.toLowerCase().includes(filters.text.toLowerCase());

    const sexMatch =
      filters.sex === "" || patient.sex === filters.sex;

    const age = calculateAge(patient.birthDate);

    const ageMatch =
      (filters.minAge === null || age >= filters.minAge) &&
      (filters.maxAge === null || age <= filters.maxAge);

    return nameMatch && sexMatch && ageMatch;
  });
}
