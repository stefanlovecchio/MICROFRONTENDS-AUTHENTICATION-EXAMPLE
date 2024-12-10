// user-app/src/UserComponent.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Button, Form, Container, Nav, Spinner } from 'react-bootstrap';
import Login from './login';
import Signup from './signup';

// GraphQL mutations
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const REGISTER_MUTATION = gql`
mutation Register($username: String!, $email: String!, $password: String!, $firstName: String!, $lastName: String!, $accountType: String!) {
    register(username: $username, email: $email, password: $password, firstName: $firstName, lastName: $lastName, accountType: $accountType)
  }
`;



function UserComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [accountType, setAccountType] = useState('');
    const [activeTab, setActiveTab] = useState('login');
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [login] = useMutation(LOGIN_MUTATION, {
        onCompleted: () => {
            // Dispatch custom event upon successful login
            window.dispatchEvent(new CustomEvent('loginSuccess', { detail: { isLoggedIn: true } }));
        },
        onError: (error) => setAuthError(error.message || 'Login failed'),
    });

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

        if (activeTab === 'login') {
            await login({ variables: { username, password } });
        } else {
            await register({ variables: { username, password, firstName, lastName, email, accountType } });
        }
        setIsSubmitting(false);
    };

    return (
        <Container className="p-5">
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav.Item>
                    <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === 'login' && (
                <Login />
            )}
            {activeTab === 'signup' && (
                <Signup />
                )}
        </Container>
    );
}

export default UserComponent;
