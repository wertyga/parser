import request from 'request';
import cheerio from 'cheerio';
import rp from 'request-promise';

import union from 'lodash/union';
import sortedUniqBy from 'lodash/sortedUniqBy';
import uniqBy from 'lodash/uniqBy';
import lowerCase from 'lodash/lowerCase';


let ABW = 'https://www.abw.by/car/sell';
let AV = 'https://av.by';

export function getListAV(req, res, next) {
    request(AV, (err, resp, body) => {
        if(err) {
            res.status(400).json(`Cant load ${AV} URL`)
        };

        let $ = cheerio.load(body);

        let lis = $('.brandsitem a span').map(function(i, car) {
            if (!/[a-z]/i.test($(this).text())) return;
            if(/Lada/.test($(this).text())) return;
            return $(this).text();
        }).get();

        req.body.cars = lis;
        next();
    });
};

export function getListABW(req, res, next) {
        request(ABW, (err, resp, body) => {
            if(err) {
                res.status(400).json(`Cant load ${ABW} URL`)
            };

            let $ = cheerio.load(body);

            let result;

            let lis = $('select.js-select-marka').last().find('option').map(function(i, car) {
                if (!/[a-z]/i.test($(this).text())) return;
                return $(this).text();
            }).get();

            if(req.body.cars) {
                let av = req.body.cars;
                result = uniqBy(union(av, lis), lowerCase)
            } else {
                result = lis;
            };
            result.sort((a, b) => {
                if(a.toLowerCase() > b.toLowerCase()) return 1;
                if(a.toLowerCase() < b.toLowerCase()) return -1;
            });
            req.body.cars = result;
            next();
        });
};

export function getCarsAV(req, res, next) {
    let link = `https://cars.av.by/${req.body.car.toLowerCase()}`;

    req.body.cars = [];

    request(link, (err, resp, body) => {
        let $ = cheerio.load(body);

        $('li.brandsitem.brandsitem--primary a').each(function(i, model) {
            model = $(model).attr('href');
            request(model, (err, resp, body) => {
                let $ = cheerio.load(body);
                $('.listing-item-title h4 a').each(function(i, car) {
                    car = $(car).attr('href');

                    request(car, (err, resp, body) => {
                        let $ = cheerio.load(body);

                        let carResult = {
                            title: $('.card-title').text(),
                            price: $('.card-price-approx').text()
                        };
                        req.body.cars.push(carResult);
                    });
                });
            });
        });
    });
};

export function getCarsABW(req, res, next) {
    if (!req.body.price) req.body.price = '100%';
    let car = req.body.car;
    let id = req.body.userId;
    if (car.split(' ').length > 1) car = car.split(' ').join('+');
    let link = `https://www.abw.by/car/sell/${car.toLowerCase()}`;

    rp({
        uri: link,
        transform: body => cheerio.load(body)
    }).then($ => {
        return $('.filter-marka-item').map((i, model) => {
            return {
                link: $(model).find('a').attr('href'),
                count: +$(model).find('span.count').text()
            }
        }).get();
    }).then(array => {
        let addLinks = [];
        array.forEach(model => {
            let pages;
            if(model.count) pages = Math.ceil(model.count / 30);

            if(pages > 1) {
                for(let i = 2; i <= pages; i++) {
                    addLinks.push(model.link + '?page=' + i)
                };
            };
        });
        array = array.map(model => model.link).concat(addLinks);

        array = array.map(model => {
            return new Promise((resolve, reject) => {
                request(model, (err, resp, body) => {
                    let $ = cheerio.load(body);

                    let carArray = getCarsList($);

                    resolve(carArray);
                });
            });
        });
        return Promise.all(array);
    }).then(array => {
        let newArr = [];
        array.forEach(arr => {
            for(let i = 0; i < arr.length; i++) {
                newArr.push(arr[i])
            };
        });

        let sortModelYearPriceObj = {};
        newArr.forEach(car => {
            let year = car.year;
            let model = car.model;
            let price = car.price;
            if(sortModelYearPriceObj[model]) {
                if(sortModelYearPriceObj[model][year]) {
                    sortModelYearPriceObj[model][year].push(price);
                } else {
                    sortModelYearPriceObj[model][year] = [price];
                }
            } else {
                sortModelYearPriceObj[model] = { [year]: [price] }
            }
        });
        let centerPrice = calcPrice(sortModelYearPriceObj);

        let resultArr = newArr.filter(car => {
            let needPrice = Math.ceil(centerPrice[car.model][car.year] * (+req.body.price.replace('%', '') / 100));

            if(needPrice >= car.price) {
                return Object.assign(car, { middlePrice: centerPrice[car.model][car.year] })
            }
        });

        return resultArr;

    }).then(result => {
        res.status(200).json({ id, result })
    }).catch(err => res.status(400).json({ error: 'can\'t get cars' }))
};



function calcPrice(car) {
    let result = {};
    for(let key in car) {
        let model = car[key];
        for(let year in model) {
            let centerPrice = model[year].reduce((a, b) => {
                    return a + b
                }, 0) / model[year].length;

            centerPrice = Math.floor(centerPrice);

            if(result[key]) {
                result[key][year] = centerPrice;
            }else {
                result[key] = {
                    [year]: centerPrice
                }
            };

        };

    };
    return result
 };

function getCarsList($) {
    let carsObjArr = $('.product-full-inner').map((i, car) => {
        let carPrice = +$(car).find('.data-price-usd').text().replace(/[~\$ ]/g, '');
        let carYear = +$(car).find('.data-year').children().eq(0).text();
        let mainLink = $(car).find('a.main-link').attr('href');
        let model = $('.breadcrumbs').children().last().text().toLowerCase()

        return {
            model: model,
            link: mainLink,
            year: carYear,
            price: carPrice
        };
    }).get();
    return carsObjArr;
};

export function resCarsToSteps(result) {
    result = result.map(car => {
        return new Promise((resolve, reject) => {
            request(car.link, (err, resp, body) => {
                let $ = cheerio.load(body);

                let carObj = {
                    model: car.model,
                    year: car.year,
                    price: car.price,
                    middlePrice: car.middlePrice,
                    description: $('.product-desc').text(),
                    images: $('.item-thumb-inner').map((i, image) => {
                        return $(image).attr('style').split('\'')[1]
                    }).get()
                };
                resolve(carObj);
            });
        });
    });
    return Promise.all(result);
};

