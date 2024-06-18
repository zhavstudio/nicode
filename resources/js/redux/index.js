import { configureStore } from '@reduxjs/toolkit';
import authReducer from './info';


const store = configureStore({
    reducer: {
        information : authReducer
    },
})

export default store;
