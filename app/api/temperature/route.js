let temperatureData = [];

// GET → frontend fetch
export async function GET() {
  return Response.json({
    success: true,
    count: temperatureData.length,
    data: temperatureData
  });
}

// POST → ESP32 sends data
export async function POST(req) {
  const body = await req.json();

  const payload = body.data || body;

  let temperature, date, time;

  if (typeof payload === "string") {
    const parts = payload.split("|");
    temperature = parseFloat(parts[0]);
    date = parts[1];
    time = parts[2];
  } else {
    temperature = payload.temperature;
    date = payload.date;
    time = payload.time;
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

  return Response.json({
    success: true,
    message: "Temperature recorded",
    entry
  });
}

// OPTIONS (CORS preflight)
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}