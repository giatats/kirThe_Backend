"use client";

import React, { useState, useEffect } from 'react';
import { Thermometer, Activity, TrendingUp, Clock, Calendar } from 'lucide-react';
import TemperatureChart from "./components/TemperatureChart";

export default function TemperatureDashboard() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateToDDMMYY = (isoDate) => {
    if (!isoDate) return null;

    const [year, month, day] = isoDate.split("-");

    return `${day}/${month}/${year.slice(-2)}`;
  };

  const [stats, setStats] = useState({
    current: null,
    min: null,
    max: null,
    avg: null
  });

  useEffect(() => {
    fetchData(selectedDate);

    const interval = setInterval(() => {
      fetchData(selectedDate);
    }, 60000); // refresh every minute

    return () => clearInterval(interval);
  }, [selectedDate]);

  const fetchData = async (date) => {
    try {
      let url = '/api/temperature';

      if (date) {
        const formattedDate = formatDateToDDMMYY(date);
        url += `?date=${encodeURIComponent(formattedDate)}`;
      }

      console.log('🔍 Fetching URL:', url);
      console.log('🔍 Selected date:', date);

      const response = await fetch(url);
      const result = await response.json();

      console.log('📦 API Response:', result);
      console.log('📦 Data array:', result.data);
      console.log('📦 Data length:', result.data?.length);

      if (result.success && result.data) {
        const readings = result.data;

        console.log('✅ Setting data with', readings.length, 'readings');
        console.log('📊 First reading:', readings[0]);

        setData(readings);
        calculateStats(readings);
      } else {
        console.warn('⚠️ No data in response');
        setData([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setLoading(false);
      setData([]);
    }
  };

  const calculateStats = (readings) => {
    if (!readings || readings.length === 0) {
      setStats({
        current: null,
        min: null,
        max: null,
        avg: null
      });
      return;
    }

    const temps = readings.map(r => Number(r.temperature));

    setStats({
      current: readings[0],
      min: Math.min(...temps).toFixed(1),
      max: Math.max(...temps).toFixed(1),
      avg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b3d 100%)',
      fontFamily: '"DM Sans", -apple-system, sans-serif',
      color: '#e8eaf6',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
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
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap');

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '10px'
          }}>
            <Thermometer size={48} color="#ff6b6b" />

            <h1 style={{
              fontSize: '56px',
              fontFamily: '"Space Mono", monospace',
              margin: 0,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TEMP MONITOR
            </h1>
          </div>

          <p style={{ color: '#a0a4b8' }}>
            ESP32 Real-time Temperature Dashboard
          </p>
        </div>

        {/* DATE PICKER */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.04)',
            padding: '14px 18px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <Calendar size={18} color="#6bcbff" />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* DEBUG INFO */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>Selected Date: {selectedDate}</div>
          <div>Data Length: {data.length}</div>
          <div>Loading: {loading.toString()}</div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Activity size={40} color="#ff6b6b" />
            <p>Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px'
          }}>
            <Thermometer size={60} color="#666" />
            <h3>No Data for Selected Date</h3>
            <p style={{ color: '#a0a4b8' }}>Try another day.</p>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>

              <div style={{ padding: 20, background: 'rgba(255,107,107,0.1)', borderRadius: 16 }}>
                <div>Current</div>
                <div style={{ fontSize: 32, color: '#ff6b6b' }}>
                  {stats.current?.temperature}°C
                </div>
              </div>

              <div style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 16 }}>
                <div>Avg</div>
                <div style={{ fontSize: 32 }}>{stats.avg}°C</div>
              </div>

              <div style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 16 }}>
                <div>Min</div>
                <div style={{ fontSize: 32 }}>{stats.min}°C</div>
              </div>

              <div style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 16 }}>
                <div>Max</div>
                <div style={{ fontSize: 32 }}>{stats.max}°C</div>
              </div>

            </div>

            {/* GRAPH */}
            <div style={{ marginTop: 40 }}>
              <TemperatureChart data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}