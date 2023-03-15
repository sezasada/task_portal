const unverifiedUsersReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_UNVERIFIED_USERS':
            return action.payload;
        case 'UNSET_UNVERIFIED_USERS':
            return [];
        default:
            return state;
    }
};

// user will be on the redux state at:
// state.user
export default unverifiedUsersReducer;
