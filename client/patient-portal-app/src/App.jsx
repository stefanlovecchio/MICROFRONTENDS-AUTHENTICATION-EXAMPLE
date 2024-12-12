import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import EmergencyAlertForm from './assets/EmergencyAlertForm';
import AlertsList from './assets/AlertsList';
import './App.css';

const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    cache: new InMemoryCache(),
    credentials: 'include',
});

function App() {
    return ( <
        ApolloProvider client = { client } >
        <div className = "App" >
        <h1> Patient Emergency Alerts </h1> 
        <EmergencyAlertForm / >
        <AlertsList / >
        </div> 
        </ApolloProvider >
    );
}

export default App;