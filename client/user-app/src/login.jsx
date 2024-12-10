import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Button, Form, Container, Nav, Spinner } from 'react-bootstrap';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const Login = ({}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const [authError, setAuthError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [login] = useMutation(LOGIN_MUTATION, {
        onCompleted: () => {
            // Dispatch custom event upon successful login
            window.dispatchEvent(new CustomEvent('loginSuccess', { detail: { isLoggedIn: true } }));
        },
        onError: (error) => setAuthError(error.message || 'Login failed'),
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
        await login({ variables: { username, password } });
        setIsSubmitting(false);
    };

   return (
       <Form onSubmit={handleSubmit}className="mt-3">           
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
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Login
                </Button>
       </Form>
   );
};

export default Login;
