import axios from 'axios';

console.log(document.head.querySelector('meta[name="csrf-token"]').getAttribute("content"))
console.log(localStorage.getItem('token'))
const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_URL,
    withCredentials: true,
    headers: {
        'Token': localStorage.getItem('token'),
        'Accept':'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').getAttribute("content"),
    },
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Token'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
