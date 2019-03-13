import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer';
import userReducer from './userReducer';
import driverReducer from './driverReducer';

export default combineReducers({
	transactionReducer: transactionReducer,
	userReducer: userReducer,
	driverReducer: driverReducer
});
