const allCompletedTasksReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_COMPLETED_TASKS':
            return action.payload;
        case 'UNSET_ALL_COMPLETED_TASKS':
            return [];
        default:
            return state;
    }
};

export default allCompletedTasksReducer;