import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* approveUser(action) {
    try {
        const updatedUser = { ...action.payload, is_verified: true };
        yield call(axios.put, '/api/user/update_verified', updatedUser);
        yield put({ type: 'APPROVE_USER', payload: updatedUser });
        yield put({ type: 'ADD_VERIFIED_USER', payload: updatedUser });
        yield put({ type: 'REMOVE_UNVERIFIED_USER', payload: updatedUser });
    } catch (error) {
        console.error(error);
    }
}



function* denyUser(action) {
    try {
        yield axios.delete(`/api/user/delete_user/${action.payload.id}`);
        yield put({ type: 'DENY_USER', payload: action.payload.id });
        const response = yield axios.get('/api/user/unverified');
        yield put({ type: 'SET_UNVERIFIED_USERS', payload: response.data });
        const response2 = yield axios.get('/api/user/verified');
        yield put({ type: 'SET_VERIFIED_USERS', payload: response2.data });

    } catch (error) {
        console.error('Error in deleting a user', error);
    }
}

function* approveDenySaga() {
    yield takeLatest('APPROVE_USER_REQUEST', approveUser);
    yield takeLatest('DENY_USER_REQUEST', denyUser);
}

export default approveDenySaga;
