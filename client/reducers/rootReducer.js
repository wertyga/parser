import { combineReducers } from 'redux';
import cars from './cars';
import message from './messages';
import auth from './auth';
import totalPages from './totalPages';

export default combineReducers({
    cars,
    message,
    auth,
    totalPages
});