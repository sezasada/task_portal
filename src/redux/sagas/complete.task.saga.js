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
  
function* completeTask(action) {
  console.log("in complete task saga", moment().format("YYYY-MM-DD HH:mm:ss"));

    try {
      const { task_id  } = action.payload;  
      const status = "Completed";
      const time_completed = moment().format("YYYY-MM-DD HH:mm:ss");
          
      // console.log("saga id, time and status", task_id, time_completed, status );
      yield call(axios.put, '/api/tasks/user_complete_task', { task_id, time_completed, status });  
      yield put({ type: 'FETCH_ALL_TASKS' });
      yield put({ type: 'FETCH_ALL_TASKS_FOR_ADMIN' });
      yield put({ type: 'FETCH_ALL_TASKS_FOR_USER' });
      yield put({ type: 'FETCH_ALL_COMPLETED_TASKS' });
      yield put({ type: 'FETCH_COMPLETED_USER_TASKS' });      

    } catch (error) {
      console.log('Error completing task:', error);
    }
}
function* allCompletedTasksSaga() {
  yield takeEvery('COMPLETE_TASK', completeTask);
}

export default allCompletedTasksSaga;
