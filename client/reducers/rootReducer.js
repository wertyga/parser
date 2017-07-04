import { combineReducers } from 'redux';
import cars from './cars';
import message from './messages';
import auth from './auth';

export default combineReducers({
    cars,
    message,
    auth
});