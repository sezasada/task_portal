import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


// --------- For admin ---------- //
function* fetchTasksByLocationSaga(action) {
    try {
        const response = yield axios.get(`/api/sort_by/location/${action.payload}`);
        yield put({ type: 'SET_TASKS_BY_LOCATION', payload: response.data });
    } catch (error) {
        console.log('Error with fetching tasks by location:', error);
    }
}

function* fetchTasksByTagsSaga(action) {
    try {
        const response = yield axios.get(`/api/sort_by/tags/${action.payload}`);
        yield put({ type: 'SET_TASKS_BY_TAGS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching tasks by tags:', error);
    }
}


function* fetchTasksByStatusSaga(action) {
    try {
        const response = yield axios.get(`/api/sort_by/status/${action.payload}`);
        yield put({ type: 'SET_TASKS_BY_STATUS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching tasks by status:', error);
    }
}

// ----------- For User ---------- // 

function* fetchTasksByLocationForUserSaga(action) {
    try {
        const response = yield axios.get(`/api/sort_by/user/location/${action.payload}`);
        yield put({ type: 'SET_TASKS_BY_LOCATION', payload: response.data });
    } catch (error) {
        console.log('Error with fetching tasks by location:', error);
    }
}

function* fetchTasksByTagsForUserSaga(action) {
    try {
        const response = yield axios.get(`/api/sort_by/user/tags/${action.payload}`);
        yield put({ type: 'SET_TASKS_BY_TAGS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching tasks by tags:', error);
    }
}

function* sortBySaga() {
    yield takeLatest("FETCH_BY_LOCATION", fetchTasksByLocationSaga);
    yield takeLatest("FETCH_BY_TAGS", fetchTasksByTagsSaga);
    yield takeLatest("FETCH_BY_STATUS", fetchTasksByStatusSaga);
    yield takeLatest("FETCH_BY_LOCATION_FOR_USER", fetchTasksByLocationForUserSaga);
    yield takeLatest("FETCH_BY_TAGS_FOR_USER", fetchTasksByTagsForUserSaga);
}

export default sortBySaga;
