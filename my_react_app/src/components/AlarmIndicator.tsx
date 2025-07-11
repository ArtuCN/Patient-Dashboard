import React from "react";

import type { Parameter } from "../models/Patient";

interface AlarmIndicatorProps {
  parameters: Parameter[] | undefined;
}

const AlarmIndicator: React.FC<AlarmIndicatorProps> = ({ parameters }) =>
{
  const hasAlarm = (parameters || []).some(p => p.alarm);
  return (
    <td>
      <span title={hasAlarm ? "Critic parameter is present" : "Ok"}>
        {
          hasAlarm ? "🚨" : "✅"
        }
      </span>
    </td>
  );
};

export default AlarmIndicator;