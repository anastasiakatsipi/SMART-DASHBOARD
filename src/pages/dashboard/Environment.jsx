import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { SchoolMap } from "@/widgets/maps";
import { fetchEnvironmentData } from "@/services/snap/environment";
import { fetchWeatherStations } from "@/services/snap/weather";
import Co2Chart from "@/widgets/charts/Co2Chart";
import TemperatureChart from "@/widgets/charts/TemperatureChart";

export function Environment() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const ALLOWED_BUILDINGS = [
    "lykeio_archangelou",
    "gymnasio_kremastis",
    "venetokleio_b",
    "venetokleio_a",
    "kapnoviomichania",
    "oikokyriki",
    "kazouleio",
    "akadimia",
    "gymnasio_gennadiou",
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchEnvironmentData();
      const weather = await fetchWeatherStations();

      console.log("WEATHER STATIONS:", weather);
      console.log("BUILDINGS:", result.map(r => r.name));

      const withGeo = result.filter((d) => d.lat && d.lng);

      const filteredBuildings = withGeo.filter((item) =>
        ALLOWED_BUILDINGS.includes(item.name)
      );

      // merge buildings + weather
      const merged = [...filteredBuildings, ...weather];

      setRows(merged);
    } catch (err) {
      console.error("Environment fetch error:", err);
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

  console.log("TOTAL ROWS:", rows.length);

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full mx-auto max-w-7xl">
      <Card className="shadow-md border border-blue-gray-100">
        <CardHeader floated={false} shadow={false} className="p-4 flex items-center justify-between">
          <Typography variant="h2" color="blue-gray" className="font-bold">
            🌿 Environment Dashboard
          </Typography>
          <Button onClick={loadData} color="dark" disabled={loading}>
            {loading ? "Φόρτωση..." : "Ανανέωση"}
          </Button>
        </CardHeader>

        <CardBody className="pb-4">
          <SchoolMap schools={rows} />
        </CardBody>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-4 min-h-[300px]">
            <Co2Chart data={rows} height={260} />
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 min-h-[300px]">
            <TemperatureChart data={rows} height={260} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Environment;
