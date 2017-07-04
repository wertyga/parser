import User from '../models/User';
import express from 'express';
import bcrypt from 'bcrypt';
import ValidateInput from '../common/ValidateInput';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

let router = express.Router();

let configJwt = {
    configJwt: 'asdsadasdasw'
};

router.post('/new-user', (req, res) => {
    let user = new User();
    user.save().then(result => {
        let token = jwt.sign({
            id: result._id,
        }, configJwt.configJwt);
        res.json({token});
    }).catch(err => res.status(500).json({ error: 'Cant save new user' }))
});

router.post('/login', (req, res) => {
    let user;
    try{
        user = jwt.verify(req.body.user, configJwt.configJwt);
    } catch(err) {
        res.status(401).json({ error: 'This user is not exist' });
    };

    if(user) {
        User.findById(user.id)
            .then(result => {
                if(result) {
                    res.status(200).json({id: result._id});
                } else {
                    res.status(401).json({ error: 'This user is not exist' })
                }
            }).catch(err => res.status(500).json({ global: 'Cant connect to DataBase' }))
    };

});

export default router;