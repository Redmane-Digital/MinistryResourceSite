const auth_initState = {
    isAuthenticated: false,
    user: null
};

const auth = (state = auth_initState, action) => {
    switch(action.type) {
        case "UPDATE_AUTH":
            return {
                isAuthenticated: action.payload.isAuthenticated,
                user: action.payload.user
            };
        default:
            return state;
    }
};

export default auth;