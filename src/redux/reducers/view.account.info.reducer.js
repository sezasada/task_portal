const viewAccountInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case 'VIEW_ACCOUNT_INFO':
            return action.payload;
        case 'APPROVE_USER': // Add this case
            if (state.id === action.payload.id) {
                return { ...state, is_verified: true };
            } else {
                return state;
            }
        case 'UNVIEW_ACCOUNT_INFO':
            return {};
        default:
            return state;
    }
};

// user will be on the redux state at:
// state.user
export default viewAccountInfoReducer;