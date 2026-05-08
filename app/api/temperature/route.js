import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";

  let temperature, date, time;

  if (contentType.includes("application/json")) {
    const body = await req.json();

    if (typeof body === "string") {
      const parts = body.split("|");
      temperature = parseFloat(parts[0]);
      date = parts[1];
      time = parts[2];
    } else {
      temperature = Number(body.temperature);
      date = body.date;
      time = body.time;
    }
  } else {
    const text = await req.text();
    const parts = text.split("|");

    temperature = parseFloat(parts[0]);
    date = parts[1];
    time = parts[2];
  }

  const { data, error } = await supabase
    .from("temperature")
    .insert([{ temperature, date, time }])
    .select()
    .single();

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, entry: data });
}

export async function GET() {
  const { data, error } = await supabase
    .from("temperature")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  return Response.json({
    success: true,
    count: data.length,
    data
  });
}