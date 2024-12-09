import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Button, Form, Container, Nav, Spinner } from 'react-bootstrap';

const REGISTER_MUTATION = gql`
mutation Register($username: String!, $email: String!, $password: String!, $firstName: String!, $lastName: String!, $accountType: String!) {
    register(username: $username, email: $email, password: $password, firstName: $firstName, lastName: $lastName, accountType: $accountType)
  }
`;

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [accountType, setAccountType] = useState('');
    const [activeTab, setActiveTab] = useState('login');
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [register] = useMutation(REGISTER_MUTATION, {
        onCompleted: () => {
            alert("Registration successful! Please log in.");
            setActiveTab('login'); // Switch to login view
        },
        onError: (error) => setAuthError(error.message || 'Registration failed'),
    });    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAuthError('');

        if (!username || !password) {
            setAuthError('Username and password are required.');
            setIsSubmitting(false);
            return;
        }
        await register({ variables: { username, password, firstName, lastName, email, accountType } });
        setIsSubmitting(false);
    };

    return (
        <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <div className="signupForm">
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="First Name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Last Name" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Account Type</Form.Label>
                    <Form.Select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                        <option></option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Nurse</option>
                    </Form.Select>
                </Form.Group>
                </div>
                {authError && <Alert variant="danger">{authError}</Alert>}

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Register
                </Button>
            </Form>
    );
};

export default Signup;