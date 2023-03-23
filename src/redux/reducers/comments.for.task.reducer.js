const commentsForTaskReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_COMMENTS_FOR_TASK':
            return action.payload;
        case 'UNSET_ALL_COMMENTS_FOR_TASK':
            return [];
        default:
            return state;
    }
};

export default commentsForTaskReducer;
