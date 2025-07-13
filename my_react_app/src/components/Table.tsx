import React, { useState, useEffect } from "react";
import type { Patient, Filters } from "../models/Patient";
import { ApiService } from "../services/Api";
import { renderCellValue, sortByKey } from "../utils/tableUtils";
import AlarmIndicator from "./AlarmIndicator.tsx";
import FullPatientInfo from "./FullPatientInfo.tsx";
import { date_converter } from "../utils/convertData.tsx";
import { count_params } from "../utils/countParam.tsx";
import CreatePatient from "./CreatePatient.tsx";
import { filterPatients } from "../utils/filterPatients.tsx";
import ModifyPatient from "./ModifyPatient.tsx";
export default function TableComponent()
{
    const apiService = new ApiService();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [showCreatePatient, setShowCreatePatient] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [filterText, setFilterText] = useState("");
    const [filterSex, setFilterSex] = useState<string>("");
    const [filterMinAge, setFilterMinAge] = useState<number | null>(null);
    const [filterMaxAge, setFilterMaxAge] = useState<number | null>(null);
    const [patientToModify, setPatientToModify] = useState<number | null> (null);
    const refreshPatients = async () => {
    try {
        const data = await apiService.fetchPatientsList();
        setPatients(data);
    } catch (error) {
        console.error("Error loading patients:", error);
    }
    };

    useEffect(() => {
    refreshPatients();
    }, []);

    type PatientKey = "id" | "familyName" | "givenName" | "birthDate" | "sex";


    const filters = {
        text: filterText,
        sex: filterSex,
        minAge: filterMinAge,
        maxAge: filterMaxAge,
        };

        
        const columns = patients.length > 0 
        ? Object.keys(patients[0]).filter((col) => col !== "parameters") 
        : [];

        const extraColumns = ["paramCount", "alarm"];

        const allColumns = [...columns, ...extraColumns];

        const columnLabel: Record<string,string> = {
            id: "ID",
            familyName: "First Name",
            givenName: "Second Name",
            birthDate: "Birthdate",
            sex: "Sex",
            paramCount: "Number of Parameters",
            alarm: "Alarm",
        };
        
        function handleOrderByColumn(col: string) {
            if (sortKey === col) {
                setSortAsc(!sortAsc);
            } else {
                setSortKey(col);
                setSortAsc(true);
            }
        }

            
            const sortedPatients = React.useMemo(() => {
                const filtered = filterPatients(patients, filters);
                if (!sortKey) return filtered;
                return sortByKey(filtered, sortKey, sortAsc);
                }, [patients, filterText, filterSex, filterMinAge, filterMaxAge, sortKey, sortAsc]);


            return (
        <>
            <div className= "filters">
                <th>Filter table:</th>
                <input
                    
                    type="text"
                    placeholder="Search by first name or family name"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />

                <select value={filterSex} onChange={(e) => setFilterSex(e.target.value)}>
                <option value="">All Sexes</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                </select>

                <input
                    type="number"
                    placeholder="Min Age"
                    value={filterMinAge ?? ""}
                    onChange={(e) => setFilterMinAge(e.target.value ? parseInt(e.target.value) : null)}
                />

                <input
                    type="number"
                    placeholder="Max Age"
                    value={filterMaxAge ?? ""}
                    onChange={(e) => setFilterMaxAge(e.target.value ? parseInt(e.target.value) : null)}
                />
            </div>

        <div className="Patient Table">
            <table>
                <thead>
                    
                    <tr>
                        {allColumns.map((col) => (
                        <th key={col}>
                            {columnLabel[col] || col}{" "}
                            <button onClick={() => handleOrderByColumn(col)}>
                            {sortKey === col ? (sortAsc ? "↑" : "↓") : "↕"}
                            </button>
                        </th>
                        ))}                        

                    </tr>
                        
                </thead>
                    <tbody>
                    {sortedPatients.map((patient, i) => (
                        <tr key={i}>
                        {allColumns.map((col) => {
                            if (col === "birthDate") {
                            return <td key={col}>{date_converter(patient[col])}</td>;
                            }
                            if (col === "paramCount") {
                            return <td key={col}>{count_params(patient)}</td>;
                            }
                            if (col === "alarm") {
                            // Qui usa direttamente il contenuto, NON AlarmIndicator perché fa già un <td>
                            const hasAlarmFlag = patient.parameters?.some(p => p.alarm) ?? false;
                            return (
                                <td key={col} title={hasAlarmFlag ? "Critic parameter is present" : "Ok"}>
                                {hasAlarmFlag ? "🚨" : "✅"}
                                </td>
                            );
                            }
                            return <td key={col}>{renderCellValue(patient[col as PatientKey])
}</td>;
                        })}

                        <td>
                            <button onClick={() => setSelectedPatientId(patient.id)}>Show Parameters</button>
                            <button onClick={() => setPatientToModify(patient.id)}>Edit Patient</button>
                        </td>
                        </tr>
                    ))}
</tbody>

            </table>
        </div>
        {selectedPatientId !== null && (
        <button className="CloseShowParameters" onClick={() => setSelectedPatientId(null)}>
            Close Show Parameters
        </button>
        )}
        {selectedPatientId !== null && <FullPatientInfo id={selectedPatientId} />}
        {patientToModify !== null && <ModifyPatient id={patientToModify}/>}
        <div className="add_patient">
            <button className="OpenCreation"onClick={() => setShowCreatePatient(!showCreatePatient)}>
                Add a new patient
            </button>
            {showCreatePatient && <CreatePatient onPatientCreated={refreshPatients} />}
        </div>
        </>
    );
}
