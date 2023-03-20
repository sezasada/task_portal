const approveDenyUserReducer = (state = {}, action) => {
    switch (action.type) {
        case 'APPROVE_USER':
            return {
                ...state, ...action.payload,
            };
        case 'DENY_USER':
            return {
                ...state, ...action.payload,
            };
        default:
            return state;
    }
};

export default approveDenyUserReducer;
