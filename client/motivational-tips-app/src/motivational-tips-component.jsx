import { format } from 'date-fns';
import React, { useEffect, useState, props } from 'react';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import PatientTips from './patientTips.jsx';

const ADD_MOTIVATIONAL_TIP = gql`
mutation AddMotivationalTip(
    $nurseUsername: String!,
    $patientUsername: String!,
    $tip: String!    
) {
    addMotivationalTip(
        nurseUsername: $nurseUsername,
        patientUsername: $patientUsername,
        tip: $tip
    ) {
        id
        nurseUsername
        patientUsername
        tip
        nurseName
    }
}
`;

const GET_ALL_MOTIVATIONAL_TIPS = gql`
    query GetMotivationalTips {
        getMotivationalTips {
            id
            nurseUsername
            patientUsername
            tip
            nurseName
        }
    }
    `;


function MotivationalTipsComponent({props}) {
    
    const {username, userType} = props;
    console.log("props accountType", {userType});
    console.log("usertype",userType);
    
    const [formData, setFormData] = useState({
        nurseUsername: '',
        patientUsername: '',
        tip: ''
    });

    const [tips, setTips] = useState([]);
    const [fetchMotivationalTips, { loading, error, data }] = useLazyQuery(GET_ALL_MOTIVATIONAL_TIPS);

    const [addMotivationalTip] = useMutation(
        ADD_MOTIVATIONAL_TIP,
        {
          variables: formData,
        }
      );
      
    const [formState, setFormState] = useState({});
    

      const handleAddMotivationalTip = async (e) => {
        e.preventDefault();
        if (!formData.tip || !formData.patientUsername) {
            alert("Please provide a tip and the patient's username.");
            return;
        }
        try {
            await addMotivationalTip({ 
                variables: {
                    ...formData,
                    patientUsername: formData.patientUsername,
                    nurseUsername: formData.nurseUsername, 
                    tip: formData.tip,
                },
            });
            alert('Tip added successfully');
            setFormState({ nurseUsername: '', patientUsername: '', tip: '' });
        } catch (err){
            console.error("error adding tip:", err.message);
        }
      };

      const handleFetchMotivationalTips = async (e) => {
        e.preventDefault();
        await fetchMotivationalTips();
      };     
      useEffect(() => {
        if (data) {
            console.log("data updated", data);
          setTips(data.getAllMotivationalTips);
          console.log("tips:", tips);
        }
      }, [data, JSON.stringify(data)]);
    
      console.log(loading, error, data);
      return (
        <div>
          {loading && <p>Loading...</p>}
          {error && <p>Error. Please try again later.</p>}
          {data && (
            <div className='existingTips'>
          <h1>Tip Repository</h1>
          <button onClick={handleFetchMotivationalTips}>Fetch All Motivational Tips</button>
                <ul>
                {data?.getMotivationalTips?.map((tip) => (
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
          {userType =='nurse' &&(
            <div>
          <h2>Add a New Motivational Tip</h2>
          <form onSubmit={handleAddMotivationalTip}>
            <label>
              Nurse Username:
              </label>
              <input
                type="text"
                value={formData.nurseUsername}
                onChange={e => setFormData({ ...formData, nurseUsername: e.target.value})}
              />            
            <br />
            <label>
              Patient Username:
              </label>
              <input
                type="text"
                value={formData.patientUsername}
                onChange={e => setFormData({...formData, patientUsername: e.target.value})}
              />            
            <br />
            <label>
                Tip:
                <input
                  type="text"
                  value={formData.tip}
                  onChange={e => setFormData({...formData, tip: e.target.value})}
                />
            </label>
            <button type="submit">Submit</button>
          </form>
          </div>
          )}
          {userType =='patient' &&(
            <div>
                <PatientTips username={username}/>
            </div>
          )

          }
          </div>
      )
}

export default MotivationalTipsComponent;
