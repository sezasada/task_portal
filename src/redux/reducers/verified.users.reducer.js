const verifiedUsersReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_VERIFIED_USERS':
            return action.payload;
        
        // Add an approved user to the list of verified users
        case 'ADD_VERIFIED_USER': 
            return [...state, action.payload];
        case 'UNSET_VERIFIED_USERS':
            return [];
        default:
            return state;
    }
};

export default verifiedUsersReducer;
