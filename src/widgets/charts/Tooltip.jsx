const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const d = payload[0].payload;

  // Metric value
  const value = payload[0].value;

  // Format date & time
  let date = "";
  let time = "";

  if (d.dateObserved || d.entry_date) {
    const iso = d.dateObserved || d.entry_date;
    const dt = new Date(iso);

    date = dt.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    time = dt.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        padding: "10px 14px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Building Name */}
      <p style={{ margin: 0, fontWeight: 600, color: "#334155" }}>
        {d.label || d.name}
      </p>

      {/* Value */}
      <p style={{ margin: "4px 0 0", color: "#475569" }}>
        Value: <strong>{value}</strong>
      </p>

      {/* Date */}
      {date && (
        <p style={{ margin: "4px 0 0", color: "#475569" }}>
          Date: {date}
        </p>
      )}

      {/* Time */}
      {time && (
        <p style={{ margin: "2px 0 0", color: "#475569" }}>
          Time: {time}
        </p>
      )}
    </div>
  );
};

export default CustomTooltip;
