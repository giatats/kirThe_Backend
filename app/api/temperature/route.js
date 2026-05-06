let temperatureData = [];

export async function POST(req) {
  const payload = await req.text();

  const parts = payload.split('|');
  const temperature = parseFloat(parts[0]);
  const date = parts[1];
  const time = parts[2];

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
    entry
  });
}

export async function GET() {
  return Response.json({
    success: true,
    data: temperatureData
  });
}