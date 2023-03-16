import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* fetchAllTasksSaga() {
    try {
        const response = yield axios.get('/api/tasks');
        yield put({ type: 'SET_ALL_TASKS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching all tasks:', error);
    }
}

function* fetchIncomingTasksSaga() {
    try {
        const response = yield axios.get('/api/tasks/admin');
        yield put({ type: 'SET_INCOMING_TASKS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching incoming tasks:', error);
    }
}

function* tasksSaga() {
    yield takeLatest('FETCH_ALL_TASKS', fetchAllTasksSaga);
    yield takeLatest('FETCH_INCOMING_TASKS', fetchIncomingTasksSaga);
}

export default tasksSaga;
