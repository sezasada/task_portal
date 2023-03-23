const allTasksForUserReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_TASKS_FOR_USER':
            return action.payload;
        case 'UNSET_ALL_TASKS_FOR_USER':
            return [];
        default:
            return state;
    }
};

export default allTasksForUserReducer;