const viewTaskInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case 'VIEW_TASK_INFO':
            return action.payload;
        case 'UNVIEW_TASK_INFO':
            return {};
        default:
            return state;
    }
};

// user will be on the redux state at:
// state.user
export default viewTaskInfoReducer;