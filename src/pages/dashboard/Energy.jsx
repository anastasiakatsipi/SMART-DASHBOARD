// src/pages/dashboard/Energy.jsx

import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";

import { fetchEnvironmentData } from "@/services/snap/environment";
import EnergyMap from "@/widgets/maps/EnergyMap";

export function Energy() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Τα buildings που θέλεις να εμφανίζονται
  const ALLOWED_BUILDINGS = [
    "megaro_akadimia",
    "venetokleio_building_b",
    "venetokleio_building_a",
    "geniko_lykeio_rodou_3",
    "neo_dimotiko_archaggelou",
    "epal_rodou_1",
    "kleisto_gipedo_kalithion",
    "kleisto_gipedo_venetokleiou",
    "geniko_lykeio_rodou_2",
    "gymnasio_rodou_5",
    "gymnasio_rodou_4",
    "geniko_lykeio_rodou_4",
    "techniki_ypiresia",
    "dimarxeio",
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchEnvironmentData();
console.log("ALL DEVICE NAMES:", result.map(r => r.name));
console.log("FULL RAW JSON:", JSON.stringify(result, null, 2));
      // πάρε μόνο όσα έχουν συντεταγμένες
      const withGeo = result.filter((d) => d.lat && d.lng);

      // 🔥 κράτα ΜΟΝΟ όσα θες
      const filtered = withGeo.filter((item) =>
        ALLOWED_BUILDINGS.includes(item.name)
      );

      setDevices(filtered);

    } catch (err) {
      console.error("Energy fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <Card className="shadow-md border border-blue-gray-100">
        <CardHeader
          floated={false}
          shadow={false}
          className="p-4 flex items-center justify-between"
        >
          <Typography variant="h2" color="blue-gray" className="font-bold">
            ⚡ Energy Dashboard
          </Typography>

          <Button
            color="dark"
            onClick={loadData}
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </CardHeader>

        <CardBody className="h-[500px]">
          <EnergyMap devices={devices} />
        </CardBody>
      </Card>
    </div>
  );
}

export default Energy;
