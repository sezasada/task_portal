const allTasksReducer = (state = [], action) => {
    switch (action.type) {
      case "SET_ALL_TASKS":
        return action.payload;
      case "UPDATE_TASK":
        return state.map((task) =>
          task.task_id === action.payload.taskId
            ? { ...task, status: action.payload.status }
            : task
        );
      case "UNSET_ALL_TASKS":
        return [];
      default:
        return state;
    }
  };
  
  export default allTasksReducer;
  