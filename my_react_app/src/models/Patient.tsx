export interface Parameter {
  id: number;
  name: string;
  value: number;
  alarm: boolean;
}

export interface Patient {
  id: number;
  familyName: string;
  givenName: string;
  birthDate: string;
  sex: string;
  parameters: Parameter[];
}

export interface CreationPatient {
  familyName: string;
  givenName: string;
  birthDate: string;
  sex: string;
  parameters: Parameter[];
}

export interface Filters {
  text: string;
  sex: string;
  minAge: number | null;
  maxAge: number | null;
}