// shell-app/src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import Cookies from 'js-cookie';

import './App.css';
import Logout from './logout';

const UserApp = lazy(() => import('userApp/App'));
const ProductApp = lazy(() => import('productApp/App'));
const PatientPortalApp = lazy(() => import('patientPortalApp/App'));
const MotivationalTipsApp = lazy(() => import('motivationalTipsApp/App'));
const ChecklistApp = lazy(() => import('checklistApp/App'));

// GraphQL queries
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

  // Fetch user authentication status
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
  });

  // Fetch user type
  const userType = useQuery(CURRENT_USER_TYPE, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
    };

    const handleLogoutSuccess = () => {
      setIsLoggedIn(false);
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('logoutSuccess', handleLogoutSuccess);

    if (!loading && !error) {
      setIsLoggedIn(!!data?.currentUser);
    }

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('logoutSuccess', handleLogoutSuccess);
    };
  }, [loading, error, data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

    return (
      <div className="App">
      
        <Suspense fallback={<div>Loading...</div>}>
          {!isLoggedIn ? 
          <UserApp />
          : null}
          {isLoggedIn && userType.data.currentUserType.accountType && userType.data.currentUserType.accountType== 'patient' ? 
            <PatientPortalApp />
            : <ProductApp />}                      
          {isLoggedIn ? 
          <Logout />
          : null          
          } 
          {isLoggedIn && userType.data.currentUserType.accountType && userType.data.currentUserType.accountType== 'checklist' ? 
            <ChecklistApp />
            : <ProductApp />}                      
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
