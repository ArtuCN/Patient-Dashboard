import React, { useState, useEffect } from "react";
import type { Patient } from "../models/Patient";
import { ApiService } from "../services/Api";
import { renderCellValue, sortByKey } from "../utils/tableUtils";
import AlarmIndicator from "./AlarmIndicator.tsx";
import FullPatientInfo from "./FullPatientInfo.tsx";

export default function TableComponent()
{
    const apiService = new ApiService();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
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

    console.log("selectedPatientId:", selectedPatientId);

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
            <div>Table:</div>
            <table>
                <thead>
                    <tr>
                        {columns.map((col) =>
                        (
                            <th key={col}>
                                {col}{" "}
                                <button onClick={() => handleOrderByColumn(col)}>
                                    {sortKey === col ? (sortAsc ? "↑" : "↓") : "↕"}
                                </button>
                            </th>
                        ))}
                        <th>Alarm</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPatients.map((patient, i) =>
                    (
                        <tr key={i}>
                            {columns.map((col) =>
                            (
                                <td key={col}>{renderCellValue((patient as any)[col])}</td>
                            ))}
                            <AlarmIndicator parameters={patient.parameters} />
                            <td>
                                <button onClick={() => setSelectedPatientId(patient.id)}>Show Parameters</button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedPatientId && <FullPatientInfo id={selectedPatientId} />}
        </>
    );
}
