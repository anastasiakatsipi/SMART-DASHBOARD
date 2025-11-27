import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Το prefix που βλέπουμε από τα logs
  const prefix = "/functions/v1/api";

  let path = url.pathname;
  if (path.startsWith(prefix)) {
    path = path.slice(prefix.length);
  }
  if (path === "") path = "/";

  console.log("METHOD:", req.method, "PATH:", path);

  if (req.method === "GET" && path === "/health") {
    return json({ ok: true, message: "API is running" });
  }

  if (req.method === "GET" && path === "/buildings") {
    const { data, error } = await supabase
      .from("building_data")
      .select("payload")
      .limit(20);

    if (error) return json({ error: error.message }, 500);
    return json({ buildings: data });
  }

  if (req.method === "POST" && path === "/insert") {
    const body = await req.json();
    const { error } = await supabase
      .from("building_data")
      .insert([{ payload: body }]);

    if (error) return json({ error: error.message }, 500);
    return json({ success: true });
  }

  return json({ error: "Route not found" }, 404);
});
