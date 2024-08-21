importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDDmrzATc65gLNfF5UuC1TgOGaynUsN62I",
    authDomain: "nicode-bef0e.firebaseapp.com",
    databaseURL: "https://nicode-bef0e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nicode-bef0e",
    storageBucket: "nicode-bef0e.appspot.com",
    messagingSenderId: "332753227048",
    appId: "1:332753227048:web:cf6efdfaf3dfc83811941d",
    measurementId: "G-ZNW6KBZYZ3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
