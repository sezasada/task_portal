const commentsForTaskReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_COMMENTS_FOR_TASK':
            // console.log("comments reducer", action.payload);
            let unorderedArray = action.payload;
            //sort the comments so they appear in chronological order
            function sortCommentsByCommentId(commentsArray) {
                return commentsArray.sort((a, b) => b.comment_id - a.comment_id);
              }
              const orderedArray = sortCommentsByCommentId(unorderedArray);
            //   console.log("ordered", orderedArray);

            return action.payload;
        case 'UNSET_ALL_COMMENTS_FOR_TASK':
            return [];
        default:
            return state;
    }
};

export default commentsForTaskReducer;
