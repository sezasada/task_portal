import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* fetchUnverifiedUsersSaga() {
  try {
    const response = yield axios.get('/api/user/unverified');
    console.log(response);
    yield put({ type: 'SET_UNVERIFIED_USERS', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* fetchVerifiedUsersSaga() {
  try {
    const response = yield axios.get('/api/user/verified');
    console.log(response);
    yield put({ type: 'SET_VERIFIED_USERS', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* reset_password(action) {

  try {
    let email = action.payload;
    
    const response = yield axios.put('/api/user/reset_password', email);
    console.log(response);
    //yield put({ type: 'SET_VERIFIED_USERS', payload: response.data });
  } catch (error) {
    console.log('reset password failed', error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('FETCH_UNVERIFIED_USERS', fetchUnverifiedUsersSaga);
  yield takeLatest('FETCH_VERIFIED_USERS', fetchVerifiedUsersSaga);
  yield takeLatest('RESET_PASSWORD', reset_password);
}

export default userSaga;
