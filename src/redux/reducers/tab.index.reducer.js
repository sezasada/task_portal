const tabIndexReducer = (state = 0, action) => {
    switch (action.type) {
        case 'SET_TAB_INDEX':
            return action.payload;
        case 'UNSET_TAB_INDEX':
            return 0;
        default:
            return state;
    }
};

export default tabIndexReducer;