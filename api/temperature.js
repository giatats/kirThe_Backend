// Vercel Serverless Function
// This file handles both POST (from ESP32) and GET (for frontend) requests

let temperatureData = [];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Parse ESP32 data: "21.94 C|06/05/26|14:02"
    const payload = req.body.data || req.body;
    
    let temperature, date, time;
    
    if (typeof payload === 'string') {
      const parts = payload.split('|');
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
    
    // Keep only last 1000 readings
    if (temperatureData.length > 1000) {
      temperatureData = temperatureData.slice(-1000);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Temperature recorded',
      entry 
    });
  }

  if (req.method === 'GET') {
    // Return all temperature data for frontend
    return res.status(200).json({
      success: true,
      count: temperatureData.length,
      data: temperatureData
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}