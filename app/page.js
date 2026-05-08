"use client";

import React, { useState, useEffect } from 'react';
import { Thermometer, Activity, TrendingUp, Clock, Calendar } from 'lucide-react';
import TemperatureChart from "./components/TemperatureChart";

export default function TemperatureDashboard() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    current: null,
    min: null,
    max: null,
    avg: null
  });

  useEffect(() => {
    fetchData(selectedDate);

    // refresh every minute
    const interval = setInterval(() => {
      fetchData(selectedDate);
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const fetchData = async (date) => {
    try {
      let url = '/api/temperature';

      if (date) {
        url += `?date=${date}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setData(result.data || []);
        calculateStats(result.data || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
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
      avg: (
        temps.reduce((a, b) => a + b, 0) / temps.length
      ).toFixed(1)
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b3d 100%)',
      fontFamily: '"DM Sans", -apple-system, sans-serif',
      color: '#e8eaf6',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background blur effects */}
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

        .stat-card {
          transition: all 0.25s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
        }

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
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
              margin: 0,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TEMP MONITOR
            </h1>
          </div>

          <p style={{
            fontSize: '18px',
            color: '#a0a4b8'
          }}>
            ESP32 Sensor Node • Real-time Temperature Tracking
          </p>
        </div>

        {/* DATE PICKER */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '18px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <Calendar size={22} color="#6bcbff" />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e8eaf6',
                fontSize: '16px',
                fontFamily: '"DM Sans", sans-serif'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <Activity size={48} color="#ff6b6b" />
            <p style={{ marginTop: '20px', fontSize: '18px', color: '#a0a4b8' }}>
              Loading sensor data...
            </p>
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
            <Thermometer size={64} color="#666" />

            <h3 style={{
              fontSize: '24px',
              marginTop: '20px'
            }}>
              No Data Found
            </h3>

            <p style={{
              color: '#a0a4b8',
              fontSize: '16px'
            }}>
              No readings available for the selected date.
            </p>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '48px'
            }}>

              {/* Current */}
              <div className="stat-card" style={{
                background: 'rgba(255,107,107,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: '20px',
                padding: '32px 28px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <Thermometer size={24} color="#ff6b6b" />
                  <span style={{
                    fontSize: '14px',
                    color: '#ff6b6b',
                    fontWeight: '600'
                  }}>
                    CURRENT
                  </span>
                </div>

                <div style={{
                  fontSize: '52px',
                  fontWeight: '700',
                  fontFamily: '"Space Mono", monospace',
                  color: '#ff6b6b'
                }}>
                  {stats.current?.temperature}°C
                </div>

                <div style={{
                  marginTop: '12px',
                  fontSize: '13px',
                  color: '#a0a4b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Clock size={14} />
                  {stats.current?.time}
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
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <Activity size={24} color="#6bcbff" />
                  <span style={{
                    fontSize: '14px',
                    color: '#6bcbff',
                    fontWeight: '600'
                  }}>
                    AVERAGE
                  </span>
                </div>

                <div style={{
                  fontSize: '52px',
                  fontWeight: '700',
                  fontFamily: '"Space Mono", monospace'
                }}>
                  {stats.avg}°C
                </div>
              </div>

              {/* Minimum */}
              <div className="stat-card" style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '32px 28px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <TrendingUp size={24} color="#a0a4b8" style={{ transform: 'rotate(180deg)' }} />
                  <span style={{
                    fontSize: '14px',
                    color: '#a0a4b8',
                    fontWeight: '600'
                  }}>
                    MINIMUM
                  </span>
                </div>

                <div style={{
                  fontSize: '52px',
                  fontWeight: '700',
                  fontFamily: '"Space Mono", monospace'
                }}>
                  {stats.min}°C
                </div>
              </div>

              {/* Maximum */}
              <div className="stat-card" style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '32px 28px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <TrendingUp size={24} color="#feca57" />
                  <span style={{
                    fontSize: '14px',
                    color: '#feca57',
                    fontWeight: '600'
                  }}>
                    MAXIMUM
                  </span>
                </div>

                <div style={{
                  fontSize: '52px',
                  fontWeight: '700',
                  fontFamily: '"Space Mono", monospace'
                }}>
                  {stats.max}°C
                </div>
              </div>
            </div>

            {/* CHART */}
            <TemperatureChart data={data} />

            {/* TABLE */}
            <div style={{
              marginTop: '40px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '36px 28px'
            }}>
              <h3 style={{
                fontSize: '20px',
                marginBottom: '24px'
              }}>
                Readings for {selectedDate}
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Temperature</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.slice(0, 10).map((reading, idx) => (
                      <tr key={idx}>
                        <td style={{
                          padding: '16px 12px',
                          color: '#ff6b6b',
                          fontWeight: '600'
                        }}>
                          {reading.temperature}°C
                        </td>

                        <td style={{ padding: '16px 12px' }}>
                          {reading.date}
                        </td>

                        <td style={{ padding: '16px 12px' }}>
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