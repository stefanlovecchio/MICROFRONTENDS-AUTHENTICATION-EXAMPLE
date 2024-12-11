import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import EmergencyAlertForm from './components/EmergencyAlertForm';
import AlertsList from './components/AlertsList';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
  credentials: 'include',
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Patient Emergency Alerts</h1>
        <EmergencyAlertForm />
        <AlertsList />
      </div>
    </ApolloProvider>
  );
}

export default App;
