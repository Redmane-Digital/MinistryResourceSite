export const updateAuth = (data) => {
    return async (dispatch) => {
        dispatch({ type: "UPDATE_AUTH", payload: data })
    }
};