// src/pages/dashboard/Energy.jsx

import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";

import { fetchEnvironmentData } from "@/services/snap/environment";
import EnergyMap from "@/widgets/maps/EnergyMap";

export function Energy() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch sensor data from API
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchEnvironmentData();         // ⬅️ All data from the backend
      const withGeo = result.filter((d) => d.lat && d.lng); // Keep only devices with coordinates
      setDevices(withGeo);
    } catch (err) {
      console.error("Energy fetch error:", err);
    }
    setLoading(false);
  };

  // Load data on page load + auto-refresh every 5 minutes
  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 300000); // 300,000 ms = 5 minutes

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
