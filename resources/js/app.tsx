import './bootstrap';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/auth/Login';
import Otp from './views/auth/Otp';
import Panel from './views/user-panel/App';
import AdminPanel from './views/admin-panel/App';

console.log("Hi app")



const App = () => {
    const isAuthenticated = true; // Replace this with your actual authentication check
    const userRole = 'user'; // Replace this with your actual user role check
    console.log("app.tsx")
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/otp" element={<Otp />} />
                <Route
                    path="/panel"
                    element={
                        isAuthenticated ? (
                            userRole === 'admin' ? (
                                <AdminPanel />
                            ) : (
                                <Panel />
                            )
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route path="*" element={<Navigate to={isAuthenticated ? '/panel' : '/login'} replace />} />
            </Routes>
        </Router>
    );
};

export default App;
