import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_EMERGENCY_ALERTS = gql`
  query GetEmergencyAlerts {
    emergencyAlerts {
      id
      patientName
      type
      description
      timestamp
    }
  }
`;

function AlertsList() {
  const { loading, error, data } = useQuery(GET_EMERGENCY_ALERTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Emergency Alerts</h2>
      <ul>
        {data.emergencyAlerts.map((alert) => (
          <li key={alert.id}>
            <p><strong>Patient:</strong> {alert.patientName}</p>
            <p><strong>Type:</strong> {alert.type}</p>
            <p><strong>Description:</strong> {alert.description}</p>
            <p><strong>Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertsList;
