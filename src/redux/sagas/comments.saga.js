import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchAllCommentsForTaskSaga() {
    // To do for Drew: Create get axios request maybe?
}

function* addCommentToTaskSaga() {
    // To do for Drew: Create post axios request
}


function* commentsSaga() {
    yield takeLatest('FETCH_COMMENTS_FOR_TASK', fetchAllCommentsForTaskSaga);
    yield takeLatest('ADD_COMMENT_TO_TASK', addCommentToTaskSaga);
}

export default commentsSaga;