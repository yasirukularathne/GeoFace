import React, { useEffect, useState } from "react";

interface GeofenceCheckProps {
  onCheck: (inside: boolean) => void;
  employeeId: string;
}

const GeofenceCheck: React.FC<GeofenceCheckProps> = ({
  onCheck,
  employeeId,
}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [inside, setInside] = useState<boolean | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        // TODO: Replace with actual API call
        // Simulate geofence check
        const isInside = true; // Replace with API response
        setInside(isInside);
        onCheck(isInside);
      },
      () => setError("Unable to get location")
    );
  }, [employeeId, onCheck]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (inside === null) return <div>Checking location...</div>;
  return <div>{inside ? "Inside geofence" : "Outside geofence"}</div>;
};

export default GeofenceCheck;
