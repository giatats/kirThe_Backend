let temperatureData = [];

export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";

  let temperature, date, time;

  // handle JSON
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
  } 
  // handle plain text (ESP32 often sends this)
  else {
    const text = await req.text();
    const parts = text.split("|");

    temperature = parseFloat(parts[0]);
    date = parts[1];
    time = parts[2];
  }

  const entry = {
    temperature,
    date,
    time,
    timestamp: new Date().toISOString()
  };

  temperatureData.push(entry);

  if (temperatureData.length > 1000) {
    temperatureData = temperatureData.slice(-1000);
  }

  return Response.json({ success: true, entry });
}

export async function GET() {
  return Response.json({
    success: true,
    count: temperatureData.length,
    data: temperatureData
  });
}