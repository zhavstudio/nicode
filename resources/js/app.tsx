import './bootstrap';
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './views/auth/Login';
import Otp from './views/auth/Otp';
import Panel from './views/user-panel/App';
import AdminPanel from './views/admin-panel/App';
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import "./assets/app.css"
import {ThemeProvider} from "@mui/material";
import theme from "./Custom"



console.log("Hi app")


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        const auth = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        setIsAuthenticated(auth !== null);
        setUserRole(role);
    }, [isAuthenticated]);
    console.log("app.tsx")
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 5,
                retryDelay: 3000,
                refetchInterval: 60000,
                cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/otp" element={<Otp/>}/>
                    <Route
                        path="/panel/*"
                        element={
                            isAuthenticated ? (
                                userRole === 'admin' ? (
                                    <AdminPanel/>
                                ) : (
                                    <Panel/>
                                )
                            ) : (
                                <Navigate to="/" replace/>
                            )
                        }
                    />
                    <Route path="*" element={<Navigate to={isAuthenticated ? '/panel' : '/login'} replace/>}/>
                </Routes>
            </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;
