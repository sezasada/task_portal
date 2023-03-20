const allTasksForAdminReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_TASKS_FOR_ADMIN':
            return action.payload;
        case 'UNSET_ALL_TASKS_FOR_ADMIN':
            return [];
        default:
            return state;
    }
};

export default allTasksForAdminReducer;