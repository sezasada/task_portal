const allLocationsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_LOCATIONS':
            return action.payload;
        case 'UNSET_ALL_LOCATIONS':
            return [];
        default:
            return state;
    }
};

export default allLocationsReducer;