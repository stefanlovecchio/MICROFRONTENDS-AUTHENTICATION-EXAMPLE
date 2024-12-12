import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const ADD_EMERGENCY_ALERT = gql`
  mutation AddEmergencyAlert($patientName: String!, $type: String!, $description: String) {
    addEmergencyAlert(patientName: $patientName, type: $type, description: $description) {
      id
      patientName
      type
      description
      timestamp
    }
  }
`;

function EmergencyAlertForm() {
  const [formData, setFormData] = useState({
    patientName: '',
    type: '',
    description: '',
  });

  const [addEmergencyAlert] = useMutation(ADD_EMERGENCY_ALERT);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmergencyAlert({ variables: formData });
      alert('Emergency alert sent successfully!');
      setFormData({ patientName: '', type: '', description: '' });
    } catch (error) {
      console.error('Error sending alert:', error);
      alert('Failed to send alert.');
    }
  };*/

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await addEmergencyAlert({ variables: formData });
    if (data && data.addEmergencyAlert) {
      alert('Emergency alert sent successfully!');
      setFormData({ patientName: '', type: '', description: '' });
    } else {
      console.error('Error sending alert: Unexpected response from server');
      alert('Failed to send alert. Please try again later.');
    }
  } catch (error) {
    console.error('Error sending alert:', error);
    alert('Failed to send alert. Please check your connection and try again.');
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Patient Name</label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Type of Emergency</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Send Alert</button>
    </form>
  );
}

export default EmergencyAlertForm;
