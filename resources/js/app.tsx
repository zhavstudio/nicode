import './bootstrap';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/auth/Login';
import Otp from './views/auth/Otp';
import Panel from './views/user-panel/App';
import AdminPanel from './views/admin-panel/App';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./assets/app.css"
import { ThemeProvider } from "@mui/material";
import theme from "./Custom"
import {useSelector} from "react-redux";

const App = () => {
    const auth1 = useSelector((state) => state.information.isAuthenticated);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role || '');
        setLoading(false);
    }, [auth1]);
    // console.log(auth1.isAuthenticated)

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
                        <Route path="/" element={<Login />} />
                        {/*<Route path="/otp" element={<Otp />} />*/}
                        <Route
                            path="/panel/*"
                            element={
                                localStorage.getItem('token') !== null ? (
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
                        <Route path="*" element={<Navigate to={localStorage.getItem('token') !== null ? '/panel' : '/'} replace />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;
