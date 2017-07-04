import axios from 'axios';

export const GET_CARS = 'GET_CARS';
export const MESSAGE = 'MESSAGE';
export const CLEAR_LIST = 'CLEAR_LIST';

export function fetchData() {
    return dispatch => {
        return axios.post('/api/fetch-data')
    };
};

export function getCars(car, price, userId) {
    return dispatch => {
        //...get id from LocalStorage
        return axios.post('/api/get-cars', { car, price, userId })
            .then(cars => {
                let id = cars.data.id;
                dispatch(message('Data recived...'));
                dispatch(carsGet(false));
                axios.post('/api/clear-base', { id });
                return cars;
            })
            .then(async cars => {
                let id = await cars.data.id;
                cars = await cars.data.result;

                if(cars.length < 1) {
                    return dispatch(message(''))
                } else {
                   let steps = await Math.ceil(cars.length / 20);
                    for(let i = 0; i < steps; i++) {
                        let newCars = await cars.splice(0, Math.min(20, cars.length));
                        await axios.post('/api/collect-cars', { cars: newCars, id })
                            .then(carList => {
                            dispatch(carsGet(carList.data)).catch(err => dispatch(message(false)));
                            if(i < 1) {
                                dispatch(message(false))
                            };
                        }).catch(err => dispatch(message(false)))
                    };
                };

            })
            .catch(err => dispatch(message('')))
    };
};
function carsGet(carList) {
    if(!carList) {
        return {
            type: CLEAR_LIST
        }
    } else {
        return {
            type: GET_CARS,
            carList
        }
    }

};

function message(message) {
    return {
        type: MESSAGE,
        message
    }
};