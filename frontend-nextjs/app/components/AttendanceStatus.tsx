import React from "react";

interface AttendanceStatusProps {
  status: "recognized" | "not_recognized" | "already_marked" | null;
  name?: string;
}

const AttendanceStatus: React.FC<AttendanceStatusProps> = ({
  status,
  name,
}) => {
  if (!status) return null;
  let message = "";
  let color = "";
  switch (status) {
    case "recognized":
      message = `✅ Attendance marked${name ? " for " + name : ""}`;
      color = "green";
      break;
    case "not_recognized":
      message = "❌ Face not recognized";
      color = "red";
      break;
    case "already_marked":
      message = "ℹ️ Attendance already marked";
      color = "blue";
      break;
    default:
      message = "";
  }
  return <div style={{ color }}>{message}</div>;
};

export default AttendanceStatus;
