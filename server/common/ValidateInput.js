import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

export default function ValidateInput(data) {
    let errors = {};
    if(Validator.isEmpty(data.name)) errors.name = 'Need name field input';
    if(Validator.isEmpty(data.password)) errors.password = 'Need password field input';
    if(data.newUser) {
        if(!Validator.isEmail(data.email)) errors.email = 'Must be correct E-mail';
        if(Validator.isEmpty(data.email)) errors.email = 'Need E-mail field input';
        if(!Validator.equals(data.passwordConfirm, data.password)) errors.passwordConfirm = 'Passwords must be equals';
        if (Validator.isEmpty(data.passwordConfirm)) errors.passwordConfirm = 'Need passwordConfirm field input';
    };

    return {
        isValid: isEmpty(errors),
        errors
    };
};