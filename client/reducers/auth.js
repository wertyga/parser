import { SET_CURRENT_USER } from '../actions/authActions';
import isEmpty from 'lodash/isEmpty';

let initialState = {
    isAuthentificate: false,
    user: {}
}

export default function login(state = initialState, action = {}) {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthentificate: !isEmpty(action.user),
                user: action.user.id
            }
        default: return state;
    }
};