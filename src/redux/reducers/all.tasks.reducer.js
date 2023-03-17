const allTasksReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_TASKS':
            return action.payload;
        case 'UNSET_ALL_TASKS':
            return [];
        default:
            return state;
    }
};

export default allTasksReducer;