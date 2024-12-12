import { format } from 'date-fns';
import React, { useState } from 'react';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';

const ADD_VITAL_SIGN = gql `
mutation AddVitalSign(
  $username: String!,
  $heartRate: Int!,
  $bloodPressure: Int!,
  $temperature: Float!
) {
  addVitalSign(
    username: $username,
    heartRate: $heartRate,
    bloodPressure: $bloodPressure,
    temperature: $temperature
  ) {
    id
    heartRate
    bloodPressure
    temperature
    createdAt
  }
}
`;

const GET_VITAL_SIGNS = gql `
    query GetVitalSigns($username: String) {
        getVitalSigns(username: $username) {
            id
            userId
            heartRate
            bloodPressure
            temperature
            createdAt
        }
    }
`;

const UPDATE_VITAL_SIGN = gql `
    mutation updateVitalSign(
      $id: ID!,
      $heartRate: Int,
      $bloodPressure: Int,
      $temperature: Float
    ) {
      updateVitalSign(
        id: $id,
        heartRate: $heartRate,
        bloodPressure: $bloodPressure,
        temperature: $temperature
      ) {
        id
        heartRate
        bloodPressure
        temperature
        createdAt
      }
    }
`;

function VitalSignsComponent() {

    const [formData, setFormData] = useState({
        username: '',
        heartRate: '',
        bloodPressure: '',
        temperature: ''
    });

    const [fetchVitalSigns, { loading, error, data }] = useLazyQuery(GET_VITAL_SIGNS);
    const [addVitalSign] = useMutation(ADD_VITAL_SIGN, {
        refetchQueries: [GET_VITAL_SIGNS],
    });
    const [updateVitalSign] = useMutation(UPDATE_VITAL_SIGN);
    const [formState, setFormState] = useState({});

    // TODO: Automatically fetch vital signs for logged-in user*********************
    //need to get user data from shell app? 

    /*useEffect(() => {
    if (user.userType === 'patient') {
      fetchVitalSigns({ variables: { userId: user.id } });
}
  }, [user, fetchVitalSigns]);*/

    const handleInputChange = (id, field, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [field]: value,
            },
        }));
    };

    const handleUpdateVitalSign = async(id) => {
        const { heartRate, bloodPressure, temperature } = formState[id] || {};
        try {
            await updateVitalSign({
                variables: {
                    id,
                    heartRate: heartRate ? parseInt(heartRate, 10) : data.getVitalSigns.find((vs) => vs.id === id).heartRate,
                    bloodPressure: bloodPressure ? parseInt(bloodPressure, 10) : data.getVitalSigns.find((vs) => vs.id === id).bloodPressure,
                    temperature: temperature ? parseFloat(temperature, 10) : data.getVitalSigns.find((vs) => vs.id === id).temperature,
                },
            });
            alert('Vital Sign updated successfully!');

        } catch (err) {
            console.error('Update Vital Sign error:', err.message);
        }
    };

    const handleFetchVitalSigns = () => {
        fetchVitalSigns({ variables: { username: formData.username } });
    };

    const handleAddVitalSign = async() => {
        if (!formData.username || !formData.heartRate || !formData.bloodPressure || !formData.temperature) {
            alert('Please fill out all fields');
            return;
        }

        try {
            await addVitalSign({
                variables: {
                    ...formData,
                    username: formData.username,
                    heartRate: parseInt(formData.heartRate),
                    bloodPressure: parseInt(formData.bloodPressure),
                    temperature: parseFloat(formData.temperature),
                    createdAt: new Date().toISOString(),
                },
            });
            alert('Vital Sign added successfully!');
            handleFetchVitalSigns();
        } catch (err) {
            console.error('Add Vital Sign error:', err.message);
        }
    };

    return ( <
        div >
        <
        h2 > Vital Signs < /h2>

        <
        input type = "number"
        placeholder = "Heart Rate"
        value = { formData.heartRate }
        onChange = { e => setFormData({...formData, heartRate: e.target.value }) }
        /> <
        input type = "number"
        placeholder = "Blood Pressure"
        value = { formData.bloodPressure }
        onChange = { e => setFormData({...formData, bloodPressure: e.target.value }) }
        /> <
        input type = "number"
        placeholder = "Temperature"
        value = { formData.temperature }
        onChange = { e => setFormData({...formData, temperature: e.target.value }) }
        /> <
        input type = "text"
        placeholder = "Username"
        value = { formData.username }
        onChange = { e => setFormData({...formData, username: e.target.value }) }
        /> <
        button onClick = { handleAddVitalSign } > Add Vital Sign < /button> <
        button onClick = { handleFetchVitalSigns } > Fetch Vital Signs < /button>

        <
        h3 > Existing Vital Signs < /h3> {
        loading && < p > Loading vital signs... < /p>} {
        error && < p > Error fetching vital signs: { error.message } < /p>} <
        ul > {
            data ? .getVitalSigns ? .map((vs) => {
                    const timestamp = vs.createdAt.toString().length > 10 ? vs.createdAt / 1000 : vs.createdAt;
                    const date = new Date(timestamp * 1000); // Convert to milliseconds if needed const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
                    const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
                }

                return ( <
                    li key = { vs.id } >
                    <
                    form onSubmit = {
                        (e) => {
                            e.preventDefault();
                            handleUpdateVitalSign(vs.id);
                        } >
                        <
                        div >
                        <
                        label > Heart Rate: < /label> <
                        input type = "number"
                        value = { formState[vs.id] ? .heartRate ? ? vs.heartRate }
                        onChange = {
                            (e) =>
                            handleInputChange(vs.id, 'heartRate', e.target.value)
                        }
                        /> < /
                        div > <
                        div >
                        <
                        label > Blood Pressure: < /label> <
                        input type = "number"
                        value = { formState[vs.id] ? .bloodPressure ? ? vs.bloodPressure }
                        onChange = {
                            (e) =>
                            handleInputChange(vs.id, 'bloodPressure', e.target.value)
                        }
                        /> < /
                        div > <
                        div >
                        <
                        label > Temperature: < /label> <
                        input type = "number"
                        step = "0.1"
                        value = { formState[vs.id] ? .temperature ? ? vs.temperature }
                        onChange = {
                            (e) =>
                            handleInputChange(vs.id, 'temperature', e.target.value)
                        }
                        /> < /
                        div > <
                        div >
                        <
                        label > Visit Date: < /label> <
                        p > { formattedDate } < /p> < /
                        div > <
                        button type = "submit" > Update < /button> < /
                        form > <
                        /li>
                    );
                })
        } <
        /ul>

        <
        /div>
    );
};

export default VitalSignsComponent;