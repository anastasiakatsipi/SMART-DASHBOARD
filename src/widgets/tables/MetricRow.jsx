import React from "react";

export default function MetricRow({ label, value, unit, metric, building, onRangeSelect }) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
      gap: "10px"
    }}>
      
      {/* Left side: Value */}
      <div>
        <strong>{label}:</strong> {value ?? "N/A"} {unit}
      </div>

      {/* Right side: Buttons */}
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => onRangeSelect(building, "24h", metric)}>24H</button>
        <button onClick={() => onRangeSelect(building, "7d", metric)}>7d</button>
        <button onClick={() => onRangeSelect(building, "1m", metric)}>1m</button>
        <button onClick={() => onRangeSelect(building, "3m", metric)}>3m</button>
      </div>

    </div>
  );
}
