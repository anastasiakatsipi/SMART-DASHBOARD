// src/widgets/maps/SchoolMap.jsx

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MetricRow from "@/widgets/tables/MetricRow";
import { createRange } from "@/utils/dateRanges";
import { fetchHistoricData } from "@/services/snap/history";
import HistoricPanel from "@/widgets/panels/HistoricPanel"; // <-- σωστό import

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function SchoolMap({ schools }) {
  const [selected, setSelected] = useState(schools.map((s) => s.name));
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [historicData, setHistoricData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [loadingHistoric, setLoadingHistoric] = useState(false);

  const toggleSchool = (name) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  const handleRangeSelect = async (building, rangeKey, metric) => {
    setLoadingHistoric(true);
    setSelectedBuilding(building);
    setSelectedMetric(metric);

    const { from, to } = createRange(rangeKey);

    const data = await fetchHistoricData(
      building.serviceUri,
      metric,
      `${from}`,
      `${to}`
    );

    setHistoricData(data);
    setLoadingHistoric(false);
  };

  const filtered = schools.filter((s) => selected.includes(s.name));

  return (
    <div className="w-full h-full flex flex-col gap-4">

      {/* ROW: Sidebar + Map */}
      <div className="flex w-full gap-4">

        {/* Sidebar */}
        <div
          className="w-64 bg-white rounded-xl shadow-md border border-blue-gray-100 p-4 flex-shrink-0"
          style={{ height: "450px", overflowY: "auto" }}
        >
          <h4 className="text-sm font-bold text-blue-gray-700 mt-4 mb-2">
            Select Schools
          </h4>

          <div className="space-y-2">
            {schools.map((s) => (
              <label
                key={s.name}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(s.name)}
                  onChange={() => toggleSchool(s.name)}
                  className="w-4 h-4 accent-blue-gray-700"
                />
                <span className="text-blue-gray-700 text-sm">{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Map */}
        <div
          className="flex-1 rounded-xl overflow-hidden border border-blue-gray-100 shadow-md"
          style={{ height: "450px" }}
        >
          <MapContainer
            center={[36.44, 28.22]}
            zoom={11}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filtered.map((s, i) => (
              <Marker 
                key={i}
                position={[s.lat, s.lng]}
                eventHandlers={{ click: () => setSelectedBuilding(s) }}
              >
                <Popup>
                  <strong>{s.name}</strong> <br />

                  <MetricRow
                    label="CO₂"
                    value={s.co2}
                    unit="ppm"
                    metric="co2"
                    building={s}
                    onRangeSelect={handleRangeSelect}
                  />

                  <MetricRow
                    label="Temperature"
                    value={s.temperature}
                    unit="°C"
                    metric="temperature"
                    building={s}
                    onRangeSelect={handleRangeSelect}
                  />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>

      {/* FULL WIDTH CHART BELOW BOTH */}
      <HistoricPanel
        metric={selectedMetric}
        data={historicData}
        building={selectedBuilding}
        loading={loadingHistoric}
      />

    </div>
  );

}

export default SchoolMap;
