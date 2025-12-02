// src/widgets/panels/HistoricPanel.jsx

import React from "react";
import MetricLineChart from "@/widgets/charts/MetricLineChart";

export function HistoricPanel({ metric, data, building, loading }) {
  if (!metric || !building) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-blue-gray-100 p-6">
      <h3 className="font-bold text-lg mb-4 text-blue-gray-800">
        {building.name} — {metric.toUpperCase()} History
      </h3>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px] opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-blue-gray-700 font-medium">
            Loading data, please wait...
          </p>
        </div>
      ) : (
        <div className="w-full h-[300px]">
          <MetricLineChart data={data} metric={metric} />
        </div>
      )}
    </div>
  );
}


export default HistoricPanel;
