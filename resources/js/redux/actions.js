export const setAuth = (isAuthenticated) => {
    return {
        type: 'SET_AUTH',
        payload: isAuthenticated,
    };
};
