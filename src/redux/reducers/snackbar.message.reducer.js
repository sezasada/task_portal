const snackbarMessageReducer = (state = "", action) => {
    switch (action.type) {
        case 'SET_SNACKBAR_MESSAGE':
            return action.payload;
        case 'UNSET_SNACKBAR_MESSAGE':
            return "";
        default:
            return state;
    }
};

export default snackbarMessageReducer;