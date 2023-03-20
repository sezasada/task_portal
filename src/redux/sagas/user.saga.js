import axios from 'axios';
import { checkPropTypes } from 'prop-types';
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
    console.log('this is response', response);
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

//to send initial email
function* reset_password(action) {
  try {
    let email = action.payload;
    const response = yield axios.put('/api/user/reset_password', email);
  } catch (error) {
    console.log('reset password failed', error);
  }
}
//to check if user is valid
function* check_if_valid(action) {
  const history = action.payload.history;
  try {
    let token = action.payload.token;
    const response = yield axios.put('/api/user/check_if_valid', {token});
    console.log(response.data);
    if (response.data === "invalid"){
      alert('Invalid');
      history.push('/login');


    }else if (response.data === "expired"){
      alert("Expired")
      history.push('/login');

    }else if (response.data === "valid"){

    }
  
  } catch (error) {
    console.log('reset password failed', error);
  }
}
//after valid, to set new password
function* set_new_password(action) {
  try {
    let password = action.payload.newPassword;
    const response = yield axios.put('/api/user/set_new_password', {password});
  
  } catch (error) {
    console.log('reset password failed', error);
  }
}



function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('FETCH_UNVERIFIED_USERS', fetchUnverifiedUsersSaga);
  yield takeLatest('FETCH_VERIFIED_USERS', fetchVerifiedUsersSaga);
  yield takeLatest('RESET_PASSWORD', reset_password);
  yield takeLatest('NEW_PASSWORD', set_new_password);
  yield takeLatest('CHECK_IF_VALID', check_if_valid);

  
}

export default userSaga;
