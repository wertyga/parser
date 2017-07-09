import webpack from 'webpack';
import express from 'express';
import path from 'path';
import webpackConfig from '../webpack.dev.config';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import BlueBirdPromise from 'bluebird';
import auth from './routes/auth';
import mongoose from 'mongoose';
import User from './models/User';
import request from 'request';
import cheerio from 'cheerio';
mongoose.Promise = BlueBirdPromise;

import { getListAV, getListABW, getCarsAV , getCarsABW, resCarsToSteps } from './common/parserSites';

import {carsCount} from '../client/actions/actions';

mongoose.connect('mongodb://localhost/carsParser');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => console.log('Success to connect to MongoDB'));

import bodyParser from 'body-parser';

const app = express();
const compiler = webpack(webpackConfig);
const port = 3000;

app.use(webpackMiddleware(compiler, {
    noInfo: true,
    hot: true,
    publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

app.use('/', auth);

app.post('/api/fetch-data', getListAV, getListABW, (req, res) => {
    res.json(req.body);
    res.end()
});

app.post('/api/get-cars', getCarsABW, (req, res) => {
});

app.post('/api/clear-base', (req, res) => {
    let id = req.body.id;
    User.findByIdAndUpdate(id, { $set: { cars: [], loaded: { cars: [] } } }).then(result => res.json('Delete cars'));

});

// app.post('/api/collect-cars', (req, res) => {
//     let {cars, id} = req.body;
//
//     resCarsToSteps(cars)
//         .then(result => {
//             User.findById(id)
//                 .then(user => {
//                     if (user.cars) {
//                         user.cars = user.cars.push(result);
//
//                         return user.save().catch(err => res.status(500).json({ error: 'Can\'t update cars list' }));
//                     } else {
//                         res.status(500).json({error: 'Can\'t find user'})
//                     };
//                 })
//                 .then(user => res.json('cars saved'));
//         })
//
// });

app.post('/api/save-middle-result', async (req, res) => {
    let {id, cars} = await req.body;

    let user = await User.findById(id);
    await user.cars.push(cars);
    await User.findByIdAndUpdate(id, { cars: user.cars });
    res.json('cars saved')

});

app.post('/api/fetch-cars', async (req, res) => {
    try {
        const { id, page } = await req.body;

        let user = await User.findById(id);
        let result;
        if(user.loaded.cars[page - 1]) {
            result = await user.loaded.cars[page - 1];
        } else {
            let cars = await user.cars[page - 1];
            result = await resCarsToSteps(cars);
            await user.loaded.cars.push(result);
            await User.findByIdAndUpdate(id, { loaded: { cars: user.loaded.cars } })
        };

        const totalPages = await user.cars.length;

        res.json({result, totalPages})

    } catch(err) {
        res.status(500).json({ error: 'Can\'t fetch cars' })
    }
});







app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => { console.log(`server run on ${port} port`) });






//ABW - https://www.abw.by/car/sell/
//AV - https://av.by