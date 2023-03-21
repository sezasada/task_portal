import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import tasksSaga from './tasks.saga';
import tagsSaga from './tags.saga';
import locationsSaga from './locations.saga';
import approveDenySaga from './approve.deny.saga';
import promoteDemoteSaga from './promote.demote.saga';
import allCompletedTasksSaga from './complete.task.saga';
import takeTasksSaga from './take.task.saga';
// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    tasksSaga(),
    tagsSaga(),
    locationsSaga(),
    approveDenySaga(),
    promoteDemoteSaga(),
    allCompletedTasksSaga(),
    takeTasksSaga()
  ]);
}
