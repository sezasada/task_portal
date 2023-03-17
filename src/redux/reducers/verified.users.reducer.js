const verifiedUsersReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_VERIFIED_USERS':
            return action.payload;
        case 'UNSET_VERIFIED_USERS':
            return [];
        default:
            return state;
    }
};

export default verifiedUsersReducer;