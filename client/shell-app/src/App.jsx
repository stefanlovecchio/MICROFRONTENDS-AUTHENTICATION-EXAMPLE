// shell-app/src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import { useQuery, gql } from '@apollo/client';
import './App.css';
import Logout from './logout';
const UserApp = lazy(() => import('userApp/App'));
const ProductApp = lazy(() => import('productApp/App'));
const MotivationalTipsApp = lazy(() => import('motivationalTipsApp/App'));

// GraphQL query to check the current user's authentication status
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;
const CURRENT_USER_TYPE = gql`
query CurrentUserType {
  currentUserType {
    accountType
  }
}
`;
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userType = useQuery(CURRENT_USER_TYPE, {fetchPolicy: 'network-only',});
  
  // Use Apollo's useQuery hook to perform the authentication status check on app load
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
  });
  

  useEffect(() => {
    // Listen for the custom loginSuccess event from the UserApp
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('logoutSuccess', () => setIsLoggedIn(false));

    // Check the authentication status based on the query's result
    if (!loading && !error) {
      setIsLoggedIn(!!data.currentUser);
    }

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, [loading, error, data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;


  return (
    <div className="App">
    
      <Suspense fallback={<div>Loading...</div>}>
        {!isLoggedIn && userType.data.currentUserType.accountType ? 
        <UserApp />
        : <ProductApp userType={userType.data.currentUserType.accountType}/>            
        } 
        {isLoggedIn ? 
        <Logout />
        : null          
        } 
        {isLoggedIn && data.currentUser.username && userType.data.currentUserType.accountType ? 
        <MotivationalTipsApp 
          userType={userType.data.currentUserType.accountType} 
          username={data.currentUser?.username}  
        />
                 
      : null          
        } 
      </Suspense>
    </div>
  );
}
 


export default App;

