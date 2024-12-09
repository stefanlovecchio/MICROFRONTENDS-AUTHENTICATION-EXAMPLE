import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import './index.css';

// Set up the Apollo Client
const httpLink = createHttpLink({
  uri: 'http://localhost:4001/graphql', // Adjust to your auth-microservice GraphQL endpoint
  credentials: 'include', // Important for handling cookies properly
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
