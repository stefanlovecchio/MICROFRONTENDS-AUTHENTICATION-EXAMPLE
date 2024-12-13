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
    return (


        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Default route redirects to UserApp */}
                    <Route path="/" element={<Navigate to="/user" replace />} />

                    {/* Define routes for your micro-frontends */}
                    <Route path="/user/*" element={<UserApp />} />
                    <Route path="/products/*" element={<ProductApp />} />
                    <Route path="/portal/*" element={<PatientPortalApp />} />
                    <Route path="/tips/*" element={<MotivationalTipsApp />} />
                    <Route path="/checklist/*" element={<ChecklistApp />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
