import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Lazy load your micro-frontends
const UserApp = lazy(() => import('userApp/App')); // Replace with your actual path
const ProductApp = lazy(() => import('productApp/App'));
const PatientPortalApp = lazy(() => import('patientPortalApp/App'));
const MotivationalTipsApp = lazy(() => import('motivationalTipsApp/App'));
const ChecklistApp = lazy(() => import('checklistApp/App'));

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
