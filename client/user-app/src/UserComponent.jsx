// user-app/src/UserComponent.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Button, Form, Container, Nav, Spinner } from 'react-bootstrap';
import Login from './login';
import Signup from './signup';

function UserComponent() {
    const [activeTab, setActiveTab] = useState('login');


    return (
        <Container className="p-5">
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav.Item>
                    <Nav.Link id="login-nav" eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="sign-up-nav" eventKey="signup">Sign Up</Nav.Link>
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
