import React, { useState } from 'react';
import './index.css';

function ChecklistApp() {
  const [symptoms, setSymptoms] = useState([]);
  const [userId, setUserId] = useState('');

  const symptomOptions = ['Fever', 'Cough', 'Shortness of Breath', 'Fatigue'];

  const toggleSymptom = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    alert(`User ID: ${userId}, Symptoms: ${symptoms.join(', ')}`);
  };

  return (
    <div className="container">
      <h1>COVID-19 Symptom Checklist</h1>
      <form>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        {symptomOptions.map((symptom, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={symptom}
              onChange={() => toggleSymptom(symptom)}
              checked={symptoms.includes(symptom)}
            />
            {symptom}
          </label>
        ))}
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChecklistApp;
