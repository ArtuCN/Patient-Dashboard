import React, { useState, useEffect } from "react";
import type { Patient } from "../models/Patient";
import { ApiService } from "../services/Api";
import { renderCellValue, sortByKey } from "../utils/tableUtils";
import AlarmIndicator from "./AlarmIndicator.tsx";
import FullPatientInfo from "./FullPatientInfo.tsx";
import { date_converter } from "../utils/convertData.tsx";
import { count_params } from "../utils/countParam.tsx";
import CreatePatient from "./CreatePatient.tsx";
export default function TableComponent()
{
    const apiService = new ApiService();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [showCreatePatient, setShowCreatePatient] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    useEffect(() =>
        {
            async function fetchData()
            {
                try
                {
                    const data = await apiService.fetchPatientsList();
                    console.log("Dati pazienti caricati:", data);  
                    setPatients(data);
                }
                catch (error)
                {
                    console.error("Error loading patients:", error);
                }
            }
            fetchData();
        }, []);
        
        const columns = patients.length > 0 
        ? Object.keys(patients[0]).filter((col) => col !== "parameters") 
        : [];
        

        const columnLabel:Record<string,string> = {
            id: "ID",
            familyName: "First Name",
            givenName: "Second Name",
            birthDate: "Birthdate",
            sex: "Sex",
        }
        
        function handleOrderByColumn(col: string)
        {
            if (sortKey === col)
                {
                    setSortAsc(!sortAsc);
                }
                else
                {
                    setSortKey(col);
                    setSortAsc(true);
                }
            }
            
            const sortedPatients = React.useMemo(() =>
                {
                    if (!sortKey)
                        {
                            return patients;
                        }
                        return sortByKey(patients, sortKey, sortAsc);
                    }, [patients, sortKey, sortAsc]);
                    return (
        <>
        <div className="Patient Table">

            <table>
                <thead>
                    
                    <tr>
                        {columns.map((col) => (
                        <th key={col}>
                            {columnLabel[col] || col}{" "}
                            <button onClick={() => handleOrderByColumn(col)}>
                            {sortKey === col ? (sortAsc ? "↑" : "↓") : "↕"}
                            </button>
                        </th>
                        ))}
                        <th>
                            Alarm
                        </th>
                        <th>
                            Number of Parameters
                        </th>
                        

                    </tr>
                        
                </thead>
                
                <tbody>
                    {sortedPatients.map((patient, i) =>
                    (
                        <tr key={i}>
                            {columns.map((col) =>
                            (
                                <td key={col}>
                                    {col === "birthDate" 
                                        ? date_converter((patient as any)[col]) 
                                        : renderCellValue((patient as any)[col])
                                    }
                                </td>
                            ))}
                            
                            <AlarmIndicator parameters={patient.parameters} />
                            
                            <td>{count_params(patient)}</td>

                            
                            <td> 
                                <button onClick={() =>
                                    {
                                        setSelectedPatientId(patient.id);
                                    }}>Show Parameters</button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {selectedPatientId !== null && <FullPatientInfo id={selectedPatientId} />}
        <div className="add_patient">
            <button className="OpenCreation"onClick={() => setShowCreatePatient(!showCreatePatient)}>
                Add a new patient
            </button>
            {showCreatePatient && <CreatePatient />}
        </div>
        </>
    );
}
