import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* approveUser(action) {
    try {
      const updatedUser = { ...action.payload, is_verified: true };
      yield call(axios.put, '/api/user/update_verified', updatedUser);
      yield put({ type: 'APPROVE_USER', payload: updatedUser });
      yield put({ type: 'ADD_VERIFIED_USER', payload: updatedUser });
      yield put({ type: 'REMOVE_UNVERIFIED_USER', payload: updatedUser }); // Add this line
    } catch (error) {
      console.error(error);
    }
  }
  


function* denyUser(action) {
    try {
        yield call(axios.put, '/api/user/update_verified', action.payload);
        yield put({ type: 'DENY_USER', payload: action.payload });
    } catch (error) {
        console.error(error);
    }
}

function* approveDenySaga() {
    yield takeLatest('APPROVE_USER_REQUEST', approveUser);
    yield takeLatest('DENY_USER_REQUEST', denyUser);
}

export default approveDenySaga;
