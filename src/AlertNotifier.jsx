// src/components/AlertNotifier.jsx
import React, { useEffect, useState } from 'react';

const SSE_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AlertNotifier = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`${SSE_BASE_URL}/subscribe/alert`);

    eventSource.addEventListener('connect', () => {
      console.log('✅ Alert SSE connected');
    });

    eventSource.addEventListener('alert_event', (e) => {
      try {
        const alert = JSON.parse(e.data);
        console.warn('🚨 ALERT:', alert);

        setAlerts(prev => [...prev, alert]);

        // 5초 후 자동 제거
        setTimeout(() => {
          setAlerts(prev => prev.slice(1));
        }, 5000);
      } catch (err) {
        console.error('❌ Alert parse error:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('❌ Alert SSE error', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={notifierContainerStyle}>
      {alerts.map((alert, idx) => (
        <div key={idx} style={alertBoxStyle}>
          <strong>🚨 {alert.type}</strong>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            {new Date(alert.timestamp).toLocaleString()}
          </div>
          <pre style={{ fontSize: '11px', marginTop: '4px' }}>
            {JSON.stringify(alert.details, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
};

const notifierContainerStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const alertBoxStyle = {
  backgroundColor: '#ffe3e3',
  border: '1px solid #ff6b6b',
  padding: '10px',
  borderRadius: '8px',
  minWidth: '250px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
};

export default AlertNotifier;
