import { TOTAL_PAGES } from '../actions/actions';

export default function(state = 1, action = {}) {
    switch(action.type) {

        case TOTAL_PAGES:
            return action.pages

        default: return state;
    };
};