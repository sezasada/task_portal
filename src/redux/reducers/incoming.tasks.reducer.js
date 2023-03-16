const incomingTasksReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_INCOMING_TASKS':
            return action.payload;
        case 'UNSET_INCOMING_TASKS':
            return [];
        default:
            return state;
    }
};

export default incomingTasksReducer;