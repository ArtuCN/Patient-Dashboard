import React, { useState, useEffect } from "react";
import type { Patient } from "../models/Patient";
import { ApiService } from "../services/Api";

export default function TableComponent()
{
    const apiService = new ApiService();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    useEffect(() =>
    {
        async function fetchData()
        {
            try
            {
                const data = await apiService.fetchPatientsList();
                setPatients(data);
            }
            catch (error)
            {
                console.error("Error loading patients:", error);
            }
        }
        fetchData();
    }, []);

    const columns = patients.length > 0 ? Object.keys(patients[0]) : [];

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

    function renderCellValue(val: any)
    {
        if (val === null || val === undefined) return "";
        if (typeof val === "object") return JSON.stringify(val);
        return val;
    }

    const sortedPatients = React.useMemo(() =>
    {
        if (!sortKey)
        {
            return patients;
        }

        return [...patients].sort((a, b) =>
        {
            const aVal = (a as any)[sortKey];
            const bVal = (b as any)[sortKey];

            if (aVal < bVal)
            {
                return sortAsc ? -1 : 1;
            }

            if (aVal > bVal)
            {
                return sortAsc ? 1 : -1;
            }

            return 0;
        });
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
