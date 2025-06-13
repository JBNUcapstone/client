import React, { useEffect, useState } from 'react';

const SSE_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AlertNotifier = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`${SSE_BASE_URL}/subscribe/alert`);

    //디버기이이이이이이잉
    eventSource.addEventListener('connect', () => {
      console.log(' Alert SSE connected');
    });

    //리스너너어어어어어
    eventSource.addEventListener('alert_event', (e) => {
      try {
        const alert = JSON.parse(e.data);
        console.warn('🚨 ALERT:', alert);
        setAlerts(prev => [...prev, alert]);
        setTimeout(() => {
          setAlerts(prev => prev.slice(1));
        }, 5000);
      } catch (err) {
        console.error(' Alert parse error:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error(' Alert SSE error', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  //타입에 따라 색갈다르게하기기기기기기
  const getAlertStyleByType = (type) => {
    switch (type) {
      case 'DoS':
        return {
          backgroundColor: '#ffe3e3',
          borderColor: '#ff6b6b'
        };
      case 'Replay':
        return {
          backgroundColor: '#e3f7ff',
          borderColor: '#4dabf7'
        };
      case 'DataInjection_InvalidJSON':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffc107'
        };
      case 'UnauthorizedTopic':
        return {
          backgroundColor: '#e6e6ff',
          borderColor: '#5f5fc4'
        };
      default:
        return {
          backgroundColor: '#f4f4f4',
          borderColor: '#ccc'
        };
    }
  };

  //알람창스타일설정
  return (
    <div style={notifierContainerStyle}>
      {alerts.map((alert, idx) => {
        const alertStyle = getAlertStyleByType(alert.type);
        return (
          <div key={idx} style={{ ...alertBoxBaseStyle, ...alertStyle }}>
            <strong>🚨 {alert.type}</strong>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              {new Date(alert.timestamp).toLocaleString()}
            </div>
            <pre style={{ fontSize: '11px', marginTop: '4px' }}>
              {JSON.stringify(alert.details, null, 2)}
            </pre>
          </div>
        );
      })}
    </div>
  );
};

//css
const notifierContainerStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const alertBoxBaseStyle = {
  padding: '10px',
  borderRadius: '8px',
  minWidth: '250px',
  border: '1px solid',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
};

//익스포트~~~~~~~~~~~~~
export default AlertNotifier;
