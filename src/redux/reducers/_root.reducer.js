import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import unverifiedUsersReducer from './unverified.users.reducer';
import viewAccountInfoReducer from './view.account.info.reducer';
import allTasksReducer from './all.tasks.reducer';
import incomingTasksReducer from './incoming.tasks.reducer';
import viewTaskInfoReducer from './view.task.info.reducer';
import allTagsReducer from './all.tags.reducer';
import allLocationsReducer from './all.locations.reducer';
import verifiedUsersReducer from './verified.users.reducer';
import tabIndexReducer from './tab.index.reducer';
import approveDenyUserReducer from './approve.deny.user.reducer';
import allTasksForAdminReducer from './all.tasks.for.admin.reducer';
import allCompletedTasksReducer from './all.completed.tasks.reducer';
import tasksReducer from './take.drop.task.reducer';
import commentsForTaskReducer from './comments.for.task.reducer';
import allCompletedUserTaskReducer from './all.completed.user.tasks.reducer';
import allTasksForUserReducer from './all.tasks.for.user.reducer';
import allAvailableTasksReducer from './all.available.tasks.reducer';
// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  unverifiedUsersReducer,
  viewAccountInfoReducer,
  allTasksReducer,
  incomingTasksReducer,
  viewTaskInfoReducer,
  allTagsReducer,
  allLocationsReducer,
  verifiedUsersReducer,
  tabIndexReducer,
  allTasksForAdminReducer,
  approveDenyUserReducer,
  allTasksForAdminReducer,
  allCompletedTasksReducer,
  tasksReducer,
  commentsForTaskReducer,
  allCompletedUserTaskReducer,
  allTasksForUserReducer,
  allAvailableTasksReducer
});

export default rootReducer;
