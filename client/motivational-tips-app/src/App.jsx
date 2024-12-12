import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css'
import MotivationalTipsComponent from './motivational-tips-component';

const client = new ApolloClient({
  uri: 'http://localhost:4003/graphql',
  cache: new InMemoryCache(), // Use InMemoryCache for local state management
  credentials: 'include' // Send cookies along with the request
})

function App(props) {

  return (
    <>
      <div className='App'>
        <ApolloProvider client={client} >
          <MotivationalTipsComponent props={props} />
        </ApolloProvider>
      </div>
    </>
  )
}

export default App
