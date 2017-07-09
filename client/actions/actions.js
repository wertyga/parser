import axios from 'axios';

export const GET_CARS = 'GET_CARS';
export const MESSAGE = 'MESSAGE';
export const CLEAR_LIST = 'CLEAR_LIST';
export const TOTAL_PAGES = 'TOTAL_PAGES';
export const carsCount = 50;


export function fetchData() {
    return dispatch => {
        return axios.post('/api/fetch-data')
    };
};

export function getCars(car, price, userId) {
    return dispatch => {
        if(!price) price = '100%';

        return axios.post('/api/get-cars', { car, price, userId })
            .then(async cars => {
                let id = cars.data.id;
                let newCars = await cars.data.result;
                dispatch(message('Data recived...'));
                await axios.post('/api/clear-base', { id })
                await dispatch(carsGet(false));

                let steps = await Math.ceil(newCars.length / carsCount);

                for (let i = 0; i < steps; i++) {
                    await axios.post('/api/save-middle-result', {
                        id,
                        cars: newCars.splice(0, Math.min(carsCount, newCars.length))
                    })
                }

            })


            // .then(async cars => {
            //     let id = await cars.data.id;
            //     cars = await cars.data.result;
            //
            //     if(cars.length < 1) {
            //         return dispatch(message(''))
            //     } else {
            //        let steps = await Math.ceil(cars.length / carsCount);
            //         for(let i = 0; i < steps; i++) {
            //             let newCars = await cars.splice(0, Math.min(carsCount, cars.length));
            //             await axios.post('/api/collect-cars', { cars: newCars, id })
            //                 // .then(carList => {
            //                 // dispatch(carsGet(carList.data)).catch(err => dispatch(message(false)));
            //                 // if(i < 1) {
            //                 //     dispatch(message(false))
            //                 // };
            //             //}).catch(err => dispatch(message(false)))
            //         };
            //     };
            //
            // })
            .catch(err => {
                console.log(err);
                dispatch(message(''));
            })
    };
};

export function clearUserCars(id) {
    return dispatch => {
        axios.post('/api/clear-base', { id })
            .then(dispatch(carsGet(false)));
    }

};

export function carsGet(carList) {
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

function getTotalPages(pages) {
    return {
        type: TOTAL_PAGES,
        pages
    }
};


export function fetchCars(user) {
    return dispatch => {
        dispatch(message('Fetching data...'));
        return axios.post('/api/fetch-cars', { id: user.id, page: user.page })
            .then(data => {
                dispatch(carsGet(data.data.result));
                dispatch(message(''));
                dispatch(getTotalPages(data.data.totalPages))
            })
            .catch(err => {throw err})
    };
};