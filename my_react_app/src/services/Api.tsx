import React from "react";
import type { Patient, Parameter, CreationPatient } from '../models/Patient';

const API_URL = 'https://mobile.digistat.it/CandidateApi/'
const AUTH_HEADER = 'Basic ' + btoa('test:TestMePlease!');

export class ApiService
{
    constructor() {this.patients = []; this.parameters = [];};

    private patients: Patient[]; 
    private parameters: Parameter[];
    private patientsNumber: Number = 0;

    private async fetchJson(endpoint: string, options: RequestInit = {})
    {
        const res = await fetch(API_URL + endpoint, {
        ...options,
        headers: {
            'Authorization': AUTH_HEADER,
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        });
        if (!res.ok)
            throw new Error(`API error ${res.status}: ${res.statusText}`);

        return res.json();
    }

    private async postJson(endpoint: string, data: any): Promise<any>
    {
        const res = await fetch(API_URL + endpoint,
        {
            method: 'POST',
            headers:
            {
                'Authorization': AUTH_HEADER,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok)
            throw new Error(`POST ${endpoint} failed: ${res.status} ${res.statusText}`);

        const text = await res.text();

        if (!text) {
        return null;
        }

        try {
        return JSON.parse(text);
        } catch (e) {
        throw new Error(`Failed to parse JSON response from ${endpoint}`);
        }
    }

    public GetPatients(): Patient[] { return this.patients; }
    public GetParameters():  Parameter[] { return this.parameters; }
    public GetPatientsNumber(): Number { return this.patientsNumber; }

    public async fetchPatientsList(): Promise<Patient[]>
    {
        const data: Patient[] = await this.fetchJson('Patient/GetList');
        this.patients = data;
        this.patientsNumber = data.length;
        this.parameters = data.flatMap(patient => patient.parameters || []);
        return data;
    }

    public async fetchPatientById( id: number ): Promise<Patient>
    {
        const data: Patient = await this.fetchJson('Patient/Get/' + id.toString());
        console.log(data);
        return data as Patient;
    }

    public async fetchAddPatient(patient: CreationPatient): Promise<Patient> {
        this.patients = await this.fetchPatientsList();
        const maxId = this.patients.length > 0 ? Math.max(...this.patients.map(p => p.id)) : 0;
        const newId = maxId + 1;
        const patientWithId = { ...patient, id: newId };
        const response = await this.postJson('Patient/Add', patientWithId);
        return response as Patient;
    }


    public async fetchUpdatePatient( patient: Patient): Promise<Patient>
    {
        console.log(" patient: ", patient);
        const response = await this.postJson('Patient/Update', patient);
        console.log("response ", response, " patient: ", patient);
        return response as Patient;
    }

}