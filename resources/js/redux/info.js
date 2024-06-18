const initialState = {
    isAuthenticated: localStorage.getItem('token') !== null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                isAuthenticated: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
