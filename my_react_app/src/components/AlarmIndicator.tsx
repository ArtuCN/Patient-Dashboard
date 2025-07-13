import React from "react";
import type { Parameter } from "../models/Patient";
import { hasAlarm } from "../utils/hasAlarm";

interface AlarmIndicatorProps {
  parameters: Parameter[] | undefined;
}

const AlarmIndicator: React.FC<AlarmIndicatorProps> = ({ parameters }) => {
  const alarm = hasAlarm(parameters);
  return (
    <td>
      <span title={alarm ? "Critic parameter is present" : "Ok"}>
        {alarm ? "🚨" : "✅"}
      </span>
    </td>
  );
};

export default AlarmIndicator;
