import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* fetchAllTasksSaga() {
    try {
        yield axios.get('/api/tasks');
        yield put({ type: 'LOGIN', payload: action.payload });
    } catch (error) {
        console.log('Error with user registration:', error);
        yield put({ type: 'REGISTRATION_FAILED' });
    }
}

function* tasksSaga() {
    yield takeLatest('FETCH_ALL_TASKS', fetchAllTasksSaga);
}

export default tasksSaga;
