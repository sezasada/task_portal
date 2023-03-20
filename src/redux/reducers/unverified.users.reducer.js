const unverifiedUsersReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_UNVERIFIED_USERS':
            return action.payload;

        // Filters out the approved user from the list of
        // unverified users by checking their IDs when the approve button is clicked.
        case 'REMOVE_UNVERIFIED_USER':
            return state.filter(user => user.id !== action.payload.id);
        case 'UNSET_UNVERIFIED_USERS':
            return [];
        default:
            return state;
    }
};

export default unverifiedUsersReducer;

