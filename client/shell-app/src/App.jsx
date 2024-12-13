// shell-app/src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Logout from './logout';

const UserApp = lazy(() => import('userApp/App'));
const ProductApp = lazy(() => import('productApp/App'));
const PatientPortalApp = lazy(() => import('patientPortalApp/App'));
const MotivationalTipsApp = lazy(() => import('motivationalTipsApp/App'));

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

  const username = data?.currentUser?.username;
  const accountType = userType?.data?.currentUserType?.accountType;

  if (username && accountType) {
    console.log(username);
    console.log(accountType);

    return (
      <Router>
      <div className="App">
        {!isLoggedIn ? (
          // Show UserApp for login/signup when not logged in
          <Suspense fallback={<div>Loading...</div>}>
            <UserApp />
          </Suspense>
        ) : (
          <>
            <nav>
              <Link to="/patient-portal">Patient Portal</Link>
              <Link to="/product">Product</Link>
              <Link to="/motivational-tips">Motivational Tips</Link>
            </nav>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/patient-portal" element={<PatientPortalApp userType={accountType} />} />
                <Route path="/product" element={<ProductApp userType={accountType} />} />
                <Route
                  path="/motivational-tips"
                  element={<MotivationalTipsApp userType={accountType} username={username} />}
                />
              </Routes>
            </Suspense>
            <Logout />
          </>
        )}
      </div>
    </Router>
  );
  }

  return null;
}

export default App;
