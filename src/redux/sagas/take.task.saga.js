import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';

function* takeTaskSaga(action) {
  console.log("in take task saga");

  try {
    const { task_id } = action.payload;
    const status = "In Progress";
    const assigned_to_id = action.payload.assigned_to_id 
    const time_assigned = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("saga id and status", task_id, status, assigned_to_id, time_assigned);
    yield call(axios.put, '/api/tasks/user_assign', { task_id, assigned_to_id, time_assigned });
    yield call(axios.put, '/api/tasks/user_status_change', { task_id, status });  

    yield put({ type: 'FETCH_ALL_TASKS' });
    yield put({ type: "FETCH_ALL_TASKS_FOR_ADMIN" });
    yield put({ type: "FETCH_ALL_AVAILABLE_TASKS" });


  } catch (error) {
    console.log('Error completing task:', error);
  }
}
function* dropTaskSaga(action) {
  console.log("in drop task saga");

  try {
    const { task_id } = action.payload;
    const status = "Available";
    const assigned_to_id = null;
    const time_assigned = null;
    console.log("task id status, assignedto, time assigned", task_id, status, assigned_to_id, time_assigned);
    yield call(axios.put, '/api/tasks/user_unassign', { task_id, assigned_to_id, time_assigned });
    yield call(axios.put, '/api/tasks/user_status_change', { task_id, status });  

    yield put({ type: 'FETCH_ALL_TASKS' });
    yield put({ type: "FETCH_ALL_TASKS_FOR_ADMIN" });
    yield put({ type: "FETCH_ALL_AVAILABLE_TASKS" });



  } catch (error) {
    console.log('Error dropping task:', error);
  }
}

function* takeTasksSaga() {
  yield takeEvery('TAKE_TASK', takeTaskSaga);
  yield takeEvery('DROP_TASK', dropTaskSaga);

}

export default takeTasksSaga;
