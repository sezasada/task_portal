
function tasksReducer(state = {}, action) {
    switch (action.type) {
        case "TAKE_TASK_SUCCESS":
            return {
                ...state, ...action.payload,
            };
        case "DROP_TASK_SUCCESS":
            return {
                ...state, ...action.payload,
            };
        default:
            return state;
    }
}
export default tasksReducer;