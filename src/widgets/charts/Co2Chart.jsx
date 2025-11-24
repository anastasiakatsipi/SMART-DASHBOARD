import React from "react";
import MetricBarChart from "@/widgets/charts/MetricBarChart";

export function Co2Chart({ data, height = 250 }) {
  return (
    <MetricBarChart
      data={data}
      height={height}
      valueKey="co2"
      yLabel="CO₂ (ppm)"
      title="CO₂ Levels per Building"
      description="X-axis = buildings, Y-axis = CO₂ concentration in ppm."
    />
  );
}

export default Co2Chart;
