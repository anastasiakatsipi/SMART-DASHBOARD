// src/services/snap/buildings.js
import { apiSnap } from "@/services";

const bbox = "36.0;27.7;36.6;28.3";

export async function fetchBuildingProfiles() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: bbox,
      type: "RhodesBuildingProfile",

    },
  });

  console.log("RAW API RESPONSE:", data); // ⬅️ ΔΕΣ ΑΥΤΟ ΠΡΩΤΑ

  const features = data?.features ?? [];

  return features.map((f) => {
    const props = f.properties ?? {};
    const values = props.values ?? {};

    // Συνενώνουμε values + props για να βρίσκουμε όλα
    const v = { ...props, ...values };

    const [lng, lat] = f.geometry?.coordinates ?? [null, null];

    return {
      name: v.deviceName ?? null,
      displayName: v.building_name ?? null,

      lat,
      lng,

      serviceUri: v.serviceUri ?? null,

      // ---- Environmental ----
      LVOC: v.LVOC ?? null,
      PM1: v.PM1 ?? null,
      PM25: v.PM25 ?? null,
      acceleration: v.acceleration ?? null,
      co2: v.co2 ?? null,
      humidity: v.humidity ?? null,
      outdoor_temperature: v.outdoor_temperature ?? null,
      temperature: v.temperature ?? null,

      // ---- Metadata ----
      dateObserved: v.dateObserved ?? null,
      entry_date: v.entry_date ?? null,

      adress: v.adress ?? null,
      city: v.city ?? null,
      postal_code: v.postal_code ?? null,
      building_name: v.building_name ?? null,

      // ---- Energy / Utility ----
      power_consumption: v.power_consumption ?? null,
      water_consumption: v.water_consumption ?? null,
      fuel_tank: v.fuel_tank ?? null,
    };
  });
}
