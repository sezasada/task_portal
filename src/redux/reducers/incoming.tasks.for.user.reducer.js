const incomingTasksForUserReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_INCOMING_TASKS_FOR_USER':
            return action.payload;
        case 'UNSET_INCOMING_TASKS':
            return [];
        default:
            return state;
    }
};

export default incomingTasksForUserReducer;