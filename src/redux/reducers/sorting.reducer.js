const sortingTasksReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_TASKS_BY_LOCATION':
            return action.payload;
        case 'SET_TASKS_BY_TAGS':
            return action.payload;
        case 'SET_TASKS_BY_STATUS':
            return action.payload;
        case 'UNSORT_TASKS':
            return [];
        default:
            return state;
    }
};

export default sortingTasksReducer;
