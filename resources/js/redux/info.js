const initialState = {
    isAuthenticated: localStorage.getItem('token') !== null,
    token : localStorage.getItem('token')
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                isAuthenticated: action.payload,
                token: action.payload.token,
            };
        default:
            return state;
    }
};

export default authReducer;
