import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';

// function* completeTask(action) {
  
//     try {
//     const updatedComplete = { ...action.payload, time_completed: new Date().toISOString(), status: "Completed", taskId: infoOfSpecificTask.task_id};
//       yield call(axios.put, '/api/tasks/user_complete_task', updatedComplete)
//       yield put({ type: 'SET_ALL_TASKS', payload: updatedComplete});
//       console.log("this is updatedComplete", updatedComplete);
//     } catch (error) {
//       console.log('Error completing task:', error);
//     }
//   }
  
function* takeTaskSaga(action) {
  console.log("in take task saga");

    try {
      const { task_id, assigned_to_id  } = action.payload;  
      const status = "In Progress";
      const time_completed = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log("saga id and status", task_id, status, assigned_to_id, time_completed );
      yield call(axios.put, '/api/tasks/user_assign', { task_id, status, assigned_to_id, time_completed });  
      yield put({ type: 'FETCH_ALL_TASKS' });

    } catch (error) {
      console.log('Error completing task:', error);
    }
}
function* takeTasksSaga() {
  yield takeEvery('TAKE_TASK', takeTaskSaga);
}

export default takeTasksSaga;
