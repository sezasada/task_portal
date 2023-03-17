import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchAllTagsSaga() {

}

function* tagsSaga() {
    yield takeLatest("FETCH_ALL_TAGS", fetchAllTagsSaga);
}

export default tagsSaga;
