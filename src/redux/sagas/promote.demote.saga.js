import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* promoteUser(action) {
    try {
        const updatedUserStatus = { ...action.payload, is_admin: true };
        yield call(axios.put, '/api/user/update_admin', updatedUserStatus);
        const response = yield axios.get('/api/user/verified');
        yield put({ type: 'SET_VERIFIED_USERS', payload: response.data });
    } catch (error) {
        console.error('Error in demoting a user', error);
    }
}

function* demoteUser(action) {
    try {
        const updatedUserStatus = { ...action.payload, is_admin: false };
        yield call(axios.put, '/api/user/update_admin', updatedUserStatus);
        const response = yield axios.get('/api/user/verified');
        yield put({ type: 'SET_VERIFIED_USERS', payload: response.data });
    } catch (error) {
        console.error('Error in promoting a user', error);
    }
}

function* promoteDemoteSaga() {
    yield takeLatest('PROMOTE_USER', promoteUser);
    yield takeLatest('DEMOTE_USER', demoteUser);
}

export default promoteDemoteSaga;
