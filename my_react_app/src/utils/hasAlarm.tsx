import type { Parameter } from "../models/Patient";

export function hasAlarm(parameters: Parameter[] | undefined): boolean {
  return (parameters || []).some(p => p.alarm);
}
