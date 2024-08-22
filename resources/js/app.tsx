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
import { requestNotificationPermission, sendTokenToBackend, onMessageListener } from './firebase';

const App = () => {
    const auth1 = useSelector((state) => state.information.isAuthenticated);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);

    function showNotification(title, options) {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            new Notification(title, options);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification(title, options);
                }
            });
        }
    }

    useEffect(() => {
        const setupFCM = async () => {
            if (localStorage.getItem('token') !== null) {
                if (!window.isSecureContext) {
                    console.warn('Firebase Messaging is not fully supported in insecure contexts. Some features may not work.');
                }
                try {
                    const token = await requestNotificationPermission();
                    console.log(token);
                    await sendTokenToBackend(token);
                } catch (error) {
                    console.error('Error setting up FCM:', error);
                }
            }
        };
        setupFCM();

        const unsubscribe = onMessageListener().then(payload => {
            console.log('Received foreground message ', payload);
            showNotification(payload.notification.title, {
                body: payload.notification.body,
                icon: payload.notification.icon || '/path/to/default/icon.png',
                // You can add more options here as needed
            });
        }).catch(err => console.log('failed: ', err));


        // Cleanup function
        return () => {
            unsubscribe;
        };
    }, []);

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
