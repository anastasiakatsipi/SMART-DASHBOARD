import { createClient } from "jsr:@supabase/supabase-js@2";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  });
}
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization"
};
Deno.serve(async (req)=>{
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }
    const url = new URL(req.url);
    let path = url.pathname;
    // Accept both /api/* and /functions/v1/api/* prefixes
    const prefixes = [
      "/functions/v1/api",
      "/api",
      "/functions/v1/api/",
      "/api/"
    ];
    for (const p of prefixes){
      if (path === p) {
        path = '/';
        break;
      }
      if (path.startsWith(p)) {
        path = path.slice(p.length);
        break;
      }
    }
    if (path === "") path = "/";
    console.log("METHOD:", req.method, "PATH:", path);
    if (req.method === "GET" && path === "/health") {
      return json({
        ok: true,
        message: "API is running"
      }, 200, CORS_HEADERS);
    }
    if (req.method === "GET" && path === "/buildings") {
      const { data, error } = await supabase.from("building_data").select("payload").limit(20);
      if (error) {
        console.error("DB Error (GET /buildings):", error);
        return json({
          error: "Internal server error"
        }, 500, CORS_HEADERS);
      }
      return json({
        buildings: data
      }, 200, CORS_HEADERS);
    }
    if (req.method === "GET" && path === "/traffic_lights") {
      const { data, error } = await supabase.from("traffic_lights_data").select("*").limit(50);
      if (error) {
        console.error("DB Error (GET /traffic_lights):", error);
        return json({
          error: "Internal server error"
        }, 500, CORS_HEADERS);
      }
      return json({
        traffic_lights: data
      }, 200, CORS_HEADERS);
    }
    if (req.method === "GET" && path === "/traffic_sensors") {
      const { data, error } = await supabase.from("traffic_sensors_data").select("*").limit(50);
      if (error) {
        console.error("DB Error (GET /traffic_sensors):", error);
        return json({
          error: "Internal server error"
        }, 500, CORS_HEADERS);
      }
      return json({
        traffic_sensors: data
      }, 200, CORS_HEADERS);
    }
    // GET /latest
    if (req.method === "GET" && path === "/latest") {
      // Fetch latest buildings
      const { data: buildings, error: bErr } = await supabase.from("building_data_latest").select("*");
      // Fetch latest traffic lights
      const { data: lights, error: lErr } = await supabase.from("traffic_lights_data_latest").select("*");
      // Fetch latest traffic sensors
      const { data: sensors, error: sErr } = await supabase.from("traffic_sensors_data_latest").select("*");
      // Error handling
      if (bErr || lErr || sErr) {
        console.error("Error fetching latest data", {
          buildingsError: bErr,
          lightsError: lErr,
          sensorsError: sErr
        });
        return json({
          error: "Internal server error"
        }, 500, CORS_HEADERS);
      }
      // Success response
      return json({
        latest: {
          buildings,
          traffic_lights: lights,
          traffic_sensors: sensors
        }
      }, 200, CORS_HEADERS);
    }
    // GET /history
    if (req.method === "GET" && path === "/history") {
      const deviceName = url.searchParams.get("deviceName");
      // Query base
      let buildingsQuery = supabase.from("building_data").select("*").order("created_at", {
        ascending: false
      });
      let lightsQuery = supabase.from("traffic_lights_data").select("*").order("created_at", {
        ascending: false
      });
      let sensorsQuery = supabase.from("traffic_sensors_data").select("*").order("created_at", {
        ascending: false
      });
      // If deviceName is given → filter by deviceName
      if (deviceName) {
        buildingsQuery = buildingsQuery.eq("payload->>deviceName", deviceName);
        lightsQuery = lightsQuery.eq("payload->>deviceName", deviceName);
        sensorsQuery = sensorsQuery.eq("payload->>deviceName", deviceName);
      }
      const [{ data: buildings, error: bErr }, { data: lights, error: lErr }, { data: sensors, error: sErr }] = await Promise.all([
        buildingsQuery,
        lightsQuery,
        sensorsQuery
      ]);
      // Error handling
      if (bErr || lErr || sErr) {
        console.error("Error fetching history", {
          buildingsError: bErr,
          lightsError: lErr,
          sensorsError: sErr
        });
        return json({
          error: "Internal server error"
        }, 500, CORS_HEADERS);
      }
      // Success response
      return json({
        history: {
          buildings,
          traffic_lights: lights,
          traffic_sensors: sensors
        }
      }, 200, CORS_HEADERS);
    }
    if (req.method === "POST" && path === "/insert") {
      let body;
      try {
        body = await req.json();
      } catch (e) {
        return json({
          error: "Invalid JSON body"
        }, 400, CORS_HEADERS);
      }
      if (!body || Object.keys(body).length === 0) {
        return json({
          error: "Empty payload"
        }, 400, CORS_HEADERS);
      }
      const { error } = await supabase.from("building_data").insert([
        {
          payload: body
        }
      ]);
      if (error) {
        console.error("DB Error (POST /insert):", error);
        return json({
          error: "Internal server error"
        }, 500, CORS_HEADERS);
      }
      return json({
        success: true
      }, 201, CORS_HEADERS);
    }
    return json({
      error: "Route not found"
    }, 404, CORS_HEADERS);
  } catch (err) {
    console.error("Unhandled error in Edge Function:", err);
    return json({
      error: "Internal server error"
    }, 500, CORS_HEADERS);
  }
});
