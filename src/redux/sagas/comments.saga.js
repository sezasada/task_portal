import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchAllCommentsForTaskSaga(action) {
    try {
        const response = yield axios.get(`/api/tasks/comments/${action.payload.task_id}`);
        yield put({ type: "SET_ALL_COMMENTS_FOR_TASK", payload: response.data });
        

    } catch (error) {
        console.log('Error with fetching comments:', error);
    }
}

function* addCommentToTaskSaga(action) {
    try {
        const response = yield axios.post('/api/tasks/post_comment', action.payload);
        yield put({ type: 'FETCH_COMMENTS_FOR_TASK', payload: response.data[0] });
        
    } catch (error) {
        console.log('Error with posting new comment:', error);
    }
}


function* commentsSaga() {
    yield takeLatest('FETCH_COMMENTS_FOR_TASK', fetchAllCommentsForTaskSaga);
    yield takeLatest('ADD_COMMENT_TO_TASK', addCommentToTaskSaga);
}

export default commentsSaga;