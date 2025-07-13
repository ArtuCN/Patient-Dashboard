import React, { useState } from "react";
import type { CreationPatient } from "../models/Patient";
import { ApiService } from "../services/Api";


interface CreatePatientProps {
  onPatientCreated: () => void;
}
export default function CreatePatient({ onPatientCreated }: CreatePatientProps) {
  const apiService = new ApiService();

  const [familyName, setFamilyName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  
  
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const newPatient: CreationPatient = {
      familyName,
      givenName,
      birthDate,
      sex,
      parameters: [],
    };

    try {
      await apiService.fetchAddPatient(newPatient);
      onPatientCreated();
      setMessage("Patient created successfully!");
    } catch (error) {
      setMessage("Error");
      console.error(error);
    }
  }

  return (
    <form className="CreationForm" onSubmit={handleSubmit}>
      <div>
        <label>Family Name:</label>
        <input
          type="text"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Given Name:</label>
        <input
          type="text"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Birth Date:</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Sex:</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)} required>
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>

      <button type="submit" className="submit-button">Create Patient</button>


      {message && <p>{message}</p>}
    </form>
  );
}
