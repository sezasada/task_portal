const allAvailableTasksReducer = (state = [], action) => {
    switch (action.type) {
      case "SET_ALL_AVAILABLE_TASKS":
        return action.payload;
      case "UNSET_ALL_AVAILABLE_TASKS":
        return [];
      default:
        return state;
    }
  };
  
  export default allAvailableTasksReducer;
  