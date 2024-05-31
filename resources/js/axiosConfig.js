import axios from 'axios';
// console.log(import.meta.env.VITE_APP_URL);
console.log(document.head.querySelector('meta[name="csrf-token"]').getAttribute("content"))

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_URL,
    withCredentials: true,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Accept':'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').getAttribute("content"),
    },
});

export default instance;
