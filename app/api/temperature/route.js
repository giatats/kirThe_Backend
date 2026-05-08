import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let temperature, date, time;

    console.log("📡 Incoming request received");

    if (contentType.includes("application/json")) {
      const body = await req.json();
      console.log("📦 JSON body:", body);

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
      console.log("📦 Raw text:", text);

      const parts = text.split("|");

      temperature = parseFloat(parts[0]);
      date = parts[1];
      time = parts[2];
    }

    const entry = { temperature, date, time };

    console.log("🧪 Parsed entry:", entry);

    const { data, error } = await supabase
      .from("temperature")
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Insert successful:", data);

    return Response.json({ success: true, entry: data });

  } catch (err) {
    console.error("🔥 Server error:", err);

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("temperature")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("❌ GET error:", error);

      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    console.error("🔥 GET server error:", err);

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}