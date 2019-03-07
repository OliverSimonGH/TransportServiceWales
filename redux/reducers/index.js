import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer';
import userReducer from './userReducer';
import ticketReducer from './ticketReducer'

export default combineReducers({
    transactionReducer: transactionReducer,
    userReducer: userReducer,
    ticketReducer: ticketReducer
});