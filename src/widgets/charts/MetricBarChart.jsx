// src/components/MetricBarChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";


import CustomTooltip  from "@/widgets/charts/Tooltip";

export function MetricBarChart({
  data,
  title,
  description,
  height = 300,
  valueKey,    
  yLabel,
}) {
  const hasData = Array.isArray(data) && data.length > 0;
  
  // Φιλτράρουμε τιμές null, undefined, 0
  const cleanData = (Array.isArray(data) ? data : []).filter(
    (d) => d[valueKey] !== null && d[valueKey] !== undefined && d[valueKey] > 0
  );

  const transformedData = cleanData.map((d) => {
  const iso = d.dateObserved || d.entry_date || null;

  let date = "";
  let time = "";

  if (iso) {
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

  return {
    ...d,
    label: d.displayName || d.building_name || d.name || "Building",
    iso,   // 🔥 ΚΡΑΤΑΜΕ και το raw ISO
    date,
    time,
  };
});



  const colors = [
    "#3b82f6", // Blue 500
    "#10b981", // Green 500
    "#f59e0b", // Amber 500
    "#ef4444", // Red 500
    "#6366f1", // Indigo 500
    "#ec4899", // Pink 500
    "#14b8a6", // Teal 500
    "#8b5cf6", // Violet 500
    "#06b6d4", // Cyan 500
    "#84cc16", // Lime 500
    "#0ea5e9", // Sky 500
    "#d946ef", // Fuchsia 500
    "#f43f5e", // Rose 500
    "#22c55e", // Emerald 500
    "#eab308", // Yellow 500
    "#fb923c", // Orange 400
    "#64748b", // Slate 500
    "#a855f7", // Purple 500
    "#4ade80", // Green 400
    "#38bdf8", // Sky 400
    "#f87171", // Red 400
    "#c084fc", // Violet 400
    "#2dd4bf", // Teal 400
    "#ffa500", // Orange (custom vivid)
    "#009688", // Teal dark (custom)
  ];



  return (
    <div className="rounded-xl bg-white shadow-md p-6 space-y-4 border border-blue-gray-100">
      
      {/* ΤΙΤΛΟΣ */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* ΔΙΑΓΡΑΜΜΑ */}
      {hasData ? (
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformedData}
              margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              
              <XAxis
                dataKey="name"
                tick={false}    // κρύβει τα ticks
                axisLine={false} // κρύβει τον άξονα }}
              />

              <YAxis
                tick={{ fill: "#475569" }}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#475569" },
                }}
              />

              <Tooltip content={<CustomTooltip />} />


              <Bar dataKey={valueKey} radius={[4, 4, 0, 0]}>
                {transformedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}   // 🔥 Εδώ γίνεται η μαγεία
                  />
                ))}
              </Bar>


            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          Δεν υπάρχουν διαθέσιμα δεδομένα.
        </div>
      )}
    </div>
  );
}

export default MetricBarChart;
