export const setAuth = (isAuthenticated,token) => {
    return {
        type: 'SET_AUTH',
        payload: {
            isAuthenticated,
            token
        }
    };
};
