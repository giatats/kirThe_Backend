"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Thermometer, Activity, TrendingUp, Clock } from 'lucide-react';

export default function TemperatureDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    current: null,
    min: null,
    max: null,
    avg: null
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/temperature`
      );

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setData(result.data);
        calculateStats(result.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const calculateStats = (readings) => {
    if (!readings || readings.length === 0) return;

    const temps = readings.map(r => r.temperature);

    setStats({
      current: readings[readings.length - 1],
      min: Math.min(...temps),
      max: Math.max(...temps),
      avg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)
    });
  };

  const chartData = data.slice(-50).map((item, index) => ({
    name: `${item.time}`,
    temp: item.temperature,
    index
  }));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b3d 100%)',
      fontFamily: '"DM Sans", -apple-system, sans-serif',
      color: '#e8eaf6',
      padding: '0',
      margin: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'pulse 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(107,203,255,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        animation: 'pulse 10s ease-in-out infinite 2s'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap');
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,107,107,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,107,107,0.6); }
        }

        .stat-card {
          animation: slideUp 0.6s ease-out backwards;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <Thermometer size={48} color="#ff6b6b" strokeWidth={2.5} />
            <h1 style={{
              fontSize: '56px',
              fontFamily: '"Space Mono", monospace',
              fontWeight: '700',
              margin: '0',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px'
            }}>
              TEMP MONITOR
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#a0a4b8',
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}>
            ESP32 Sensor Node • Real-time Temperature Tracking
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <Activity size={48} color="#ff6b6b" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <p style={{ marginTop: '20px', fontSize: '18px', color: '#a0a4b8' }}>Loading sensor data...</p>
          </div>
        ) : data.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '60px 40px',
            textAlign: 'center'
          }}>
            <Thermometer size={64} color="#666" strokeWidth={1.5} style={{ opacity: 0.4 }} />
            <h3 style={{ fontSize: '24px', marginTop: '20px', fontWeight: '600' }}>No Data Yet</h3>
            <p style={{ color: '#a0a4b8', fontSize: '16px', maxWidth: '500px', margin: '12px auto 24px' }}>
              Waiting for your ESP32 to send the first temperature reading...
            </p>
            <code style={{
              display: 'block',
              background: 'rgba(0,0,0,0.3)',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#6bcbff',
              fontFamily: 'monospace',
              maxWidth: '600px',
              margin: '0 auto',
              border: '1px solid rgba(107,203,255,0.2)'
            }}>
              POST https://your-app.vercel.app/api/temperature
              <br />
              Body: "21.94 C|06/05/26|14:02"
            </code>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '48px'
            }}>
              {/* Current Temperature */}
              <div className="stat-card" style={{
                background: 'rgba(255,107,107,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: '20px',
                padding: '32px 28px',
                animation: 'glow 3s ease-in-out infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Thermometer size={24} color="#ff6b6b" strokeWidth={2.5} />
                  <span style={{ fontSize: '14px', color: '#ff6b6b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Current</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '700', fontFamily: '"Space Mono", monospace', color: '#ff6b6b', lineHeight: '1' }}>
                  {stats.current?.temperature}°C
                </div>
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#a0a4b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} />
                  {stats.current?.date} • {stats.current?.time}
                </div>
              </div>

              {/* Average */}
              <div className="stat-card" style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '32px 28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Activity size={24} color="#6bcbff" strokeWidth={2.5} />
                  <span style={{ fontSize: '14px', color: '#6bcbff', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Average</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '700', fontFamily: '"Space Mono", monospace', color: '#e8eaf6', lineHeight: '1' }}>
                  {stats.avg}°C
                </div>
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#a0a4b8' }}>
                  Based on {data.length} readings
                </div>
              </div>

              {/* Min Temp */}
              <div className="stat-card" style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '32px 28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <TrendingUp size={24} color="#a0a4b8" strokeWidth={2.5} style={{ transform: 'rotate(180deg)' }} />
                  <span style={{ fontSize: '14px', color: '#a0a4b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Minimum</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '700', fontFamily: '"Space Mono", monospace', color: '#e8eaf6', lineHeight: '1' }}>
                  {stats.min}°C
                </div>
              </div>

              {/* Max Temp */}
              <div className="stat-card" style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '32px 28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <TrendingUp size={24} color="#feca57" strokeWidth={2.5} />
                  <span style={{ fontSize: '14px', color: '#feca57', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Maximum</span>
                </div>
                <div style={{ fontSize: '52px', fontWeight: '700', fontFamily: '"Space Mono", monospace', color: '#e8eaf6', lineHeight: '1' }}>
                  {stats.max}°C
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '36px 28px',
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '28px',
                color: '#e8eaf6',
                letterSpacing: '-0.5px'
              }}>
                Temperature History (Last 50 Readings)
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#5a5f7d"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#5a5f7d"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(10,14,39,0.95)',
                      border: '1px solid rgba(255,107,107,0.3)',
                      borderRadius: '12px',
                      color: '#e8eaf6',
                      fontSize: '14px'
                    }}
                    formatter={(value) => [`${value}°C`, 'Temperature']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#ff6b6b" 
                    strokeWidth={3}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Readings Table */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '36px 28px',
              overflow: 'hidden'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#e8eaf6',
                letterSpacing: '-0.5px'
              }}>
                Recent Readings
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#a0a4b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Temperature</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#a0a4b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#a0a4b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(-10).reverse().map((reading, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '16px 12px', fontSize: '18px', fontWeight: '600', fontFamily: '"Space Mono", monospace', color: '#ff6b6b' }}>
                          {reading.temperature}°C
                        </td>
                        <td style={{ padding: '16px 12px', fontSize: '15px', color: '#e8eaf6' }}>
                          {reading.date}
                        </td>
                        <td style={{ padding: '16px 12px', fontSize: '15px', color: '#e8eaf6' }}>
                          {reading.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}