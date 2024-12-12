import React, { useEffect, useState, props } from 'react';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';

const GET_PATIENT_MOTIVATIONAL_TIPS = gql`
    query GetPatientMotivationalTips($patientUsername: String!) {
        getPatientMotivationalTips(patientUsername: $patientUsername) {
            id
            nurseUsername
            patientUsername
            tip
            nurseName            
        }
    }
    `;
    function PatientTips({ username }) {
        
        console.log("username**: "+ username);
                
        const [ fetchMotivationalTips, {loading, error, data }] = useLazyQuery(GET_PATIENT_MOTIVATIONAL_TIPS, {
            variables: { patientUsername: username },
          });
          
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <div>Error: {error.message}</div>;
          }
        
          const handleFetchMotivationalTips = async (e) => {
            e.preventDefault();
            await fetchMotivationalTips(username);
          };   
          if (data) {
            console.log(data);
            // render the list here
          }
          return (
            <div>
              <h1>Patient Tips</h1>
              <button onClick={handleFetchMotivationalTips}>Fetch All Motivational Tips</button>
              {loading && <p>Loading...</p>}
              {error && <p>Error. Please try again later.</p>}
              {data && (
                <div className='existingTips'>
                    <ul>
                    {data?.getPatientMotivationalTips?.map((tip) => (
                        <li key={tip.id}>
                        <p>Nurse: {tip.nurseName}</p>
                        <br />
                        <p>Patient: {tip.patientUsername}</p>
                        <br />
                        <p>Tip: {tip.tip}</p>
                        </li>
                    ))}
                    </ul>
                </div>
              )}
              </div>
          )
        
    }
    

    export default PatientTips;