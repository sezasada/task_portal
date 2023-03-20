import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import swal from 'sweetalert';

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

    yield put({ type: 'SET_UNVERIFIED_USERS', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* fetchVerifiedUsersSaga() {
  try {
    const response = yield axios.get('/api/user/verified');
   
    yield put({ type: 'SET_VERIFIED_USERS', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

//to send initial email
function* reset_password(action) {
  try {
    let history = action.payload.history
    let email = action.payload.email;
    const response = yield axios.put('/api/user/reset_password', email);

    if (response.data === "email doesnt exist"){
      //the email does not exist so no email was sent, BUT we still push user to the page that says email was sent
        console.log("invalid email, email not sent");
        history.push("/email_sent");
    }else if (response.data === "email sent") {
      //email matches email in our db, so we sent a link to that email to reset password and then pushed user to email sent page
      console.log("email sent");
      history.push("/email_sent");
    }
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
    // token does not exist in the db
    if (response.data === "invalid"){
      history.push('/login');
      swal("Invalid link", "Please retry reseting password", "error");
    //token is expired
    }else if (response.data === "expired"){
      history.push('/login');
      swal("Expired link", "Please retry reseting password", "error");
    //token is valid
    }else {
      let token_id = response.data.id;
      
    }
  } catch (error) {
    console.log('reset password failed', error);
  }
}
//after valid, to set new password
function* set_new_password(action) {
  
  try {

    let newObject = {
     password: action.payload.newPassword,
     token: action.payload.token,
    }

    //pull out the token id from the reducer and then make send with the new password
    
    const response = yield axios.put('/api/user/set_new_password', newObject);
      
      history.push('/login');
      swal("Password Reset!", "Please login using new password", "success");

  
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
