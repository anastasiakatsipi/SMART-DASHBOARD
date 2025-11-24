// src/components/themes/environment/TemperatureChart.jsx
import React from "react";
import MetricBarChart from "@/widgets/charts/MetricBarChart";

export function TemperatureChart({ data, height = 250 }) {
  return (
    <MetricBarChart
      data={data}
      height={height}
      valueKey="temperature"
      yLabel="Temperature (°C)"
      title="Temperature per Building"
      description="X-axis = buildings, Y-axis = temperature in °C."
    />
  );
}

export default TemperatureChart;
