import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

function* completeTask(action) {
    try {
    const updatedComplete = { time_completed: new Date().toISOString(), status: "Completed", taskId: infoOfSpecificTask.task_id};
      yield call(axios.put, '/api/tasks/user_complete_task', updatedComplete)
      yield put({ type: 'SET_ALL_TASKS', payload: updatedComplete});
      console.log("this is updatedComplete", updatedComplete);
    } catch (error) {
      console.log('Error completing task:', error);
    }
  }
  
// function* completeTask(action) {
//     try {
//       const { taskId, status } = action.payload;
//       const time_completed = new Date().toISOString();
//       yield call(axios.put, '/api/tasks/user_complete_task', { task_id: taskId, time_completed, status });
//       const updatedTask = yield call(axios.get, `/api/tasks/${taskId}`);
//       yield put({ type: 'UPDATE_TASK', payload: updatedTask.data });
//     } catch (error) {
//       console.log('Error completing task:', error);
//     }
// }
function* allCompletedTasksSaga() {
  yield takeEvery('COMPLETE_TASK', completeTask);
}

export default allCompletedTasksSaga;
