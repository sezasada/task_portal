const allTagsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_TAGS':
            return action.payload;
        case 'UNSET_ALL_TAGS':
            return [];
        default:
            return state;
    }
};

export default allTagsReducer;