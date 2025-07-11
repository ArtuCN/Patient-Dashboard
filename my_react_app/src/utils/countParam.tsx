import type { Patient } from "../models/Patient";

export function count_params( patient: Patient): number
{

    return patient.parameters.length;
}