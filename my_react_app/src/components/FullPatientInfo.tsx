import React,  { useState, useEffect } from "react";

import type { Parameter, Patient } from "../models/Patient";
import { ApiService } from "../services/Api";

interface Props {
  id: number;
}
const FullPatientInfo: React.FC<Props> = ({ id }) =>
{
    console.log('oh ma porcodio stampa roba');
    const apiservice = new ApiService();

    
    const [patient, setPatient] = useState<Patient | null>(null);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    
    useEffect(() =>
    {
        async function fetchData()
        {
            setPatient(null);
            try
            {
                console.log("useEffect fetchData called with id:", id);
                const data = await apiservice.fetchPatientById(id);
                console.log('post chiamata');
                setPatient(data);
            }
            catch (error)
            {
                console.error("Error loading patient:", error);
            }
        }
        fetchData();
    },[id]);
    
    //if (!patient)
    //    return <div>loading...</div>;
    const parameters = patient.parameters || [];
    const columns = parameters.length > 0 ? Object.keys(parameters[0]) : [];

    function handleOrderByColumn(col: string) {
        if (sortKey === col) 
            setSortAsc(!sortAsc);
        else
        {
            setSortKey(col);
            setSortAsc(true);
        }
    }
    const sortedParams = React.useMemo(() => {
        if (!sortKey) return parameters;
            return [...parameters].sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
        });
    }, [parameters, sortKey, sortAsc]);
    return (
    <div>
      <h2>{`oh shit ${patient.givenName} ${patient.familyName}`}</h2>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
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
          {sortedParams.map((param, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{(param as any)[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <a>oh bro</a>
    </div>
  );

};

export default FullPatientInfo;
