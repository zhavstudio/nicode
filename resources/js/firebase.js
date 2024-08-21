import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDDmrzATc65gLNfF5UuC1TgOGaynUsN62I",
    authDomain: "nicode-bef0e.firebaseapp.com",
    databaseURL: "https://nicode-bef0e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nicode-bef0e",
    storageBucket: "nicode-bef0e.appspot.com",
    messagingSenderId: "332753227048",
    appId: "1:332753227048:web:cf6efdfaf3dfc83811941d",
    measurementId: "G-ZNW6KBZYZ3"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
    try {
        await Notification.requestPermission();
        const token = await getToken(messaging, { vapidKey: 'BBZ0skQiSeVCsQeOxqOy9TGyGnlEk8H2hWV99G4jm1Vs5FmRkogmfYtFNTDQnBMnK5DTeJ04fqFIu20QDe-jnHo' });
        return token;
    } catch (error) {
        console.error("An error occurred while retrieving token. ", error);
        throw error;
    }
}
// export async function requestNotificationPermission() {
//     try {
//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//             const token = await getToken(messaging, {
//                 vapidKey: 'BBZ0skQiSeVCsQeOxqOy9TGyGnlEk8H2hWV99G4jm1Vs5FmRkogmfYtFNTDQnBMnK5DTeJ04fqFIu20QDe-jnHo',
//                 serviceWorkerRegistration: null // This disables the service worker
//             });
//             return token;
//         } else {
//             throw new Error('Notification permission denied');
//         }
//     } catch (error) {
//         console.error("An error occurred while retrieving token. ", error);
//         throw error;
//     }
// }

export async function sendTokenToBackend(token) {
    try {
        const response = await fetch('/api/web/v1/user/fcm-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust based on your auth method
            },
            body: JSON.stringify({ fcm_token: token })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('FCM token updated successfully:', data);
    } catch (error) {
        console.error('Error updating FCM token:', error);
        throw error;
    }
}

export function onMessageListener() {
    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
}
