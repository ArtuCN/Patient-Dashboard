import type { Patient, Parameter } from "../models/Patient";
import { count_params } from "../utils/countParam.tsx";
import { hasAlarm } from "./hasAlarm.tsx";

export function renderCellValue(val: any): string {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
}

export function sortByKey(array: Patient[], key: string, asc: boolean): Patient[] {
  return [...array].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    if (key === "paramCount") {
      aVal = count_params(a);  // passa il Patient intero e ritorna numero di parametri
      bVal = count_params(b);
    } else if (key === "alarm") {
      aVal = hasAlarm(a.parameters) ? 1 : 0;  // PASSA solo a.parameters!
      bVal = hasAlarm(b.parameters) ? 1 : 0;
    } else {
      aVal = (a as any)[key];
      bVal = (b as any)[key];
    }

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal > bVal) return asc ? 1 : -1;
    if (aVal < bVal) return asc ? -1 : 1;
    return 0;
  });
}

