import { MESSAGE } from '../actions/actions';

export default function(state = '', action = {}) {
    switch(action.type) {

        case MESSAGE:
            return action.message

        default: return state;
    };
};