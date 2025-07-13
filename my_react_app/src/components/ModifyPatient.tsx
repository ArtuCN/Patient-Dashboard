import React, { useState, useEffect, useMemo } from "react";
import type { Parameter, Patient } from "../models/Patient";
import { ApiService } from "../services/Api";
import { formatDateForInput } from "../utils/convertData";
interface Props {
  id: number;
  onClose: () => void; 
}

const ModifyPatient: React.FC<Props> = ({ id, onClose }) => {
    const apiservice = new ApiService();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [familyName, setFamilyName] = useState("");
    const [givenName, setGivenName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [sex, setSex] = useState("");
    const [initialPatient, setInitialPatient] = useState<Patient | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    
    
    useEffect(() => {
    const fetchPatient = async () => {
        const data = await apiservice.fetchPatientById(id);
        setPatient(data);
        setInitialPatient(data);
        setFamilyName(data.familyName);
        setGivenName(data.givenName);
        setBirthDate(formatDateForInput(data.birthDate));
        setSex(data.sex);
    };

    fetchPatient();
    }, [id]);
    
    let isModified = useMemo(() => {
    if (!initialPatient) return false;

    return (
        familyName !== initialPatient.familyName ||
        givenName !== initialPatient.givenName ||
        birthDate !== formatDateForInput(initialPatient.birthDate) ||
        sex !== initialPatient.sex
    );
    }, [initialPatient, familyName, givenName, birthDate, sex]);


    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!initialPatient)
            return ;
        initialPatient.birthDate = birthDate;
        initialPatient.familyName = familyName;
        initialPatient.givenName = givenName;
        initialPatient.sex = sex;
        try
        {
            await apiservice.fetchUpdatePatient(initialPatient);
            setMessage("Modified with succes");
        } catch (error) {
            setMessage("Error during modify.");
            console.error(error);
        }
      }
    
    return (
        <form className="UpdateForm" onSubmit={handleSubmit}>
        <button 
        type="button" 
        className="close-button" 
        onClick={onClose}
        aria-label="Close form"
      >
        ✖
      </button>
      <label className="ModificationTitle">Modification Form </label>
      <div>
        <label>Family Name </label>
        <input
          type="text"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Given Name </label>
        <input
          type="text"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Birthdate </label>
        <input
          type="date"
          value={initialPatient ? formatDateForInput(birthDate) : ""}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Sex </label>
        <select value={sex} onChange={(e) => setSex(e.target.value)} required>
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>

      <button type="submit" className="submit-button" disabled={!isModified}>
          Save Changes
      </button>
      {message && <p>{message}</p>}

    </form>
    );
}

export default ModifyPatient;