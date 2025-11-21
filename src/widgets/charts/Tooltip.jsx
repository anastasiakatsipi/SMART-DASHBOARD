const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
    //console.log("TOOLTIP PAYLOAD:", payload[0]?.payload);

 const d = payload[0].payload;

  // Τιμή του metric
  const value = payload[0].value;

  // Format ημερομηνίας & ώρας
  let date = "";
  let time = "";

  if (d.dateObserved || d.entry_date) {
    const iso = d.dateObserved || d.entry_date;

    const dt = new Date(iso);

    date = dt.toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    time = dt.toLocaleTimeString("el-GR", {
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
      {/* Όνομα Σχολείου */}
      <p style={{ margin: 0, fontWeight: 600, color: "#334155" }}>
        {d.label || d.name}
      </p>

      {/* Τιμή */}
      <p style={{ margin: "4px 0 0", color: "#475569" }}>
        Τιμή: <strong>{value}</strong>
      </p>

      {/* Ημερομηνία */}
      {date && (
        <p style={{ margin: "4px 0 0", color: "#475569" }}>
          Ημερομηνία: {date}
        </p>
      )}

      {/* Ώρα */}
      {time && (
        <p style={{ margin: "2px 0 0", color: "#475569" }}>
          Ώρα: {time}
        </p>
      )}
    </div>
  );
};


export default CustomTooltip;