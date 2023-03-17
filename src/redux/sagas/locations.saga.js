import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* fetchAllLocationsSaga() {
    try {
        const response = yield axios.get('/api/tasks/locations');
        yield put({ type: 'SET_ALL_LOCATIONS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching all locations:', error);
    }
}


function* locationsSaga() {
    yield takeLatest('FETCH_ALL_LOCATIONS', fetchAllLocationsSaga);
}

export default locationsSaga;