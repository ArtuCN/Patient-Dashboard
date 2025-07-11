import React, { useState, useEffect, useMemo } from "react";
import type { Parameter, Patient } from "../models/Patient";
import { ApiService } from "../services/Api";

interface Props {
  id: number;
}

const FullPatientInfo: React.FC<Props> = ({ id }) => {
  const apiservice = new ApiService();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setPatient(null);
      try {
        const data = await apiservice.fetchPatientById(id);
        setPatient(data);
      } catch (error) {
        console.error("Error loading patient:", error);
      }
    }
    fetchData();
  }, [id]);

  const parameters: Parameter[] = patient?.parameters || [];
  const columns = parameters.length > 0 ? Object.keys(parameters[0]) : [];

  const sortedParams = useMemo(() => {
    if (!sortKey) return parameters;
    return [...parameters].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [parameters, sortKey, sortAsc]);

  function handleOrderByColumn(col: string) {
    if (sortKey === col) setSortAsc(!sortAsc);
    else {
      setSortKey(col);
      setSortAsc(true);
    }
  }

  const columnLabel:Record<string,string> = {
            id: "ID",
            name: "Name",
            value: "Value",
            alarm: "Alarm",
        }
  return (
    <div>
      {patient ? (
        <>
          <div className="NameInFullInfo">
            {patient.givenName} {patient.familyName}
          </div>
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
              </tr>
            </thead>
            <tbody>
              {sortedParams.map((param, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>
                      {col === "alarm"
                        ? ((param as any)[col] ? "⚠️ Alarm" : "✅ OK")
                        : (param as any)[col]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default FullPatientInfo;
