import { GET_CARS, CLEAR_LIST } from '../actions/actions';

export default function(state = [], action = {}) {
    switch(action.type) {

        case GET_CARS:
            return action.carList

        case CLEAR_LIST:
            return [];



        default: return state;
    };
};