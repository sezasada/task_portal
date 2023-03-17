import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchAllTagsSaga() {
    try {
        const response = yield axios.get('/api/tasks/tags');
        yield put({ type: 'SET_ALL_TAGS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching all tags:', error);
    }
}

function* tagsSaga() {
    yield takeLatest("FETCH_ALL_TAGS", fetchAllTagsSaga);
}

export default tagsSaga;
