import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function SimpleMap({ points = [] }) {
  return (
    <MapContainer
      center={[36.44, 28.22]}
      zoom={11}
      scrollWheelZoom={false}
      className="w-full h-full rounded-xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {points.map((p, i) => (
        <Marker key={i} position={[p.lat, p.lng]} />
      ))}
    </MapContainer>
  );
}


export default SimpleMap;