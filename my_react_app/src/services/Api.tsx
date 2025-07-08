import React from "react";
import type { Patient, Parameter } from '../models/Patient';

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
        return res.json();
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
        console.log('patients: ', this.patients);
        console.log('parameters: ', this.parameters);
        return data;
    }

    public async fetchPatientById( id: number ): Promise<Patient>
    {
        const data: Patient = await this.fetchJson('Patient/Get/' + id.toString);

        return data as Patient;
    }

    public async fetchAddPatient( patient: Patient): Promise<Patient>
    {
        const response = await this.postJson('Patient/Add', patient);
        return response as Patient;
    }

    public async fetchUpdatePatient( patient: Patient): Promise<Patient>
    {
        const response = await this.postJson('Patient/Update', patient);
        return response as Patient;
    }

}