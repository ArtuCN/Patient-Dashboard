import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from './Navbar.tsx'
interface Parameter {
  id: number;
  name: string;
  value: string | number;
  alarm: boolean;
}

interface Patient {
  id: number;
  familyName: string;
  givenName: string;
  birthDate: string; // ISO string
  sex: string;
  parameters: Parameter[];
}

interface Props {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
}

const PatientsTable: React.FC<Props> = ({ patients, onEdit }) => {
  return (
    <>
      <Navbar/>
      <TableContainer component={Paper}>
        <Table aria-label="patients table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Family Name</strong></TableCell>
              <TableCell><strong>Given Name</strong></TableCell>
              <TableCell><strong>Sex</strong></TableCell>
              <TableCell><strong>Birth Date</strong></TableCell>
              <TableCell><strong># Parameters</strong></TableCell>
              <TableCell><strong>Alarm</strong></TableCell>
              <TableCell><strong>Edit</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map(patient => {
              const hasAlarm = patient.parameters.some(p => p.alarm);
              return (
                <TableRow key={patient.id}>
                  <TableCell>{patient.familyName}</TableCell>
                  <TableCell>{patient.givenName}</TableCell>
                  <TableCell>{patient.sex}</TableCell>
                  <TableCell>{new Date(patient.birthDate).toLocaleDateString()}</TableCell>
                  <TableCell>{patient.parameters.length}</TableCell>
                  <TableCell>
                    {hasAlarm ? (
                      <Chip label="ALARM" color="error" size="small" />
                    ) : (
                      <Chip label="OK" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEdit(patient)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PatientsTable;
