import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* fetchAllLocationsSaga() {
    try {
        const response = yield axios.get('/api/tasks/locations');
        yield put({ type: 'SET_ALL_LOCATIONS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching all locations:', error);
    }
}
function* deleteLocationSaga(action) {
    console.log("deleteLocationSaga action.payload", action.payload);
    try{
        yield axios.delete(`/api/tasks/delete_location/${action.payload.locationID}`);
        yield put({ type: "FETCH_ALL_LOCATIONS" });
    }catch(error){
        console.log('Error with deleting location:', error);
    }
}
function* addLocationSaga(action) {
    try{
        yield axios.post(`/api/tasks/add_location`, action.payload);
        yield put({ type: "FETCH_ALL_LOCATIONS" });
    }catch(error){
        console.log('Error with adding location:', error);
    }
}


function* locationsSaga() {
    yield takeLatest('FETCH_ALL_LOCATIONS', fetchAllLocationsSaga);
    yield takeLatest('DELETE_LOCATION', deleteLocationSaga);
    yield takeLatest('ADD_LOCATION', addLocationSaga);
}

export default locationsSaga;