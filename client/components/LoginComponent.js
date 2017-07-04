import './style/LoadingComponent.sass';
import ValidateInput from '../../server/common/ValidateInput';
import { fetchUser } from '../actions/authActions';
import { login } from '../actions/authActions';
import { connect } from 'react-redux';

import Input from './common/Input/Input';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const RegComponent = createReactClass({

    getInitialState() {
        return {
            name: '',
            password: '',
            passwordConfirm: '',
            email: '',
            loading: false,
            errors: {}
        }
    },

    onChange(e) {
        if(this.state.errors[e.target.name]) delete this.state.errors[e.target.name];
        this.setState({
            [e.target.name]: e.target.value
        });
    },

    onSubmitClick() {
        this.setState({ loading: true });
        const {isValid, errors} = ValidateInput(Object.assign({}, this.state, { newUser: true } ));
        if(!isValid) {
            this.setState({
                errors,
                loading: false
            });
        } else {
            this.props.fetchUser(Object.assign({}, this.state, { newUser: true }))
                .then(res => {
                    this.setState({
                        name: '',
                        password: '',
                        passwordConfirm: '',
                        email: '',
                        loading: false,
                        errors: {}

                    });
                    this.props.logout(true);
                })
                .catch(err => {
                    this.setState({
                        errors: err.response.data,
                        loading: false
                    });
                    if(err.response.status === 405) {
                        this.setState({
                            loading: false,
                            errors: {
                                global: 'Cant connect to DataBase'
                            }
                        });
                    }
                })
        };
    },

    loginClick() {
        this.setState({ loading: true });
        const {errors, isValid} = ValidateInput(this.state);

        if(!isValid) {
            this.setState({
                errors,
                loading: false
            });
        } else {
            this.props.login(this.state)
                .then(res => {
                    this.setState({
                        name: '',
                        password: '',
                        passwordConfirm: '',
                        email: '',
                        loading: false,
                        errors: {}

                    });

                    this.props.logout(true);
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                        errors: err.response.data
                    });
                    if(err.response.status === 405) {
                        this.setState({
                            loading: false,
                            errors: {
                                global: 'Cant connect to DataBase'
                            }
                        });
                    };
                })
        }
    },


    render() {

        return (

            <div className='LoginComponent'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1>{this.props.header}</h1>

                            {this.state.errors.global && <div style={{ color: 'red' }}>{this.state.errors.global}</div>}
                            {this.state.loading &&
                            <MuiThemeProvider>
                                <CircularProgress color="#007fb1"/>
                            </MuiThemeProvider>}

                            <div className="inputs">
                                <Input
                                    type="text"
                                    placeholder={this.props.login ? "Enter your name or E-mail" : "Enter your name"  }
                                    floatText={this.props.login ? "Name/E-mail" : "Name" }
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    name="name"
                                    error={this.state.errors.name}
                                />
                                {/*{ !this.props.loginCard &&*/}
                                {/*<Input*/}
                                    {/*type="email"*/}
                                    {/*placeholder="Enter E-mail"*/}
                                    {/*floatText="E-mail"*/}
                                    {/*value={this.state.email}*/}
                                    {/*onChange={this.onChange}*/}
                                    {/*name="email"*/}
                                    {/*error={this.state.errors.email}*/}
                                {/*/>*/}
                                {/*}*/}
                                <Input
                                    type="password"
                                    placeholder="Enter your password..."
                                    floatText="Password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    name="password"
                                    error={this.state.errors.password}
                                />
                                { !this.props.loginCard &&
                                <Input
                                    type="password"
                                    placeholder="Confirm your password..."
                                    floatText="Confirm password"
                                    value={this.state.passwordConfirm}
                                    onChange={this.onChange}
                                    name="passwordConfirm"
                                    error={this.state.errors.passwordConfirm}
                                />
                                }

                                <div className="text-right" style={{ width: '30%', marginTop: '50px' }}>
                                    <button onClick={!this.props.loginCard ? this.onSubmitClick : this.loginClick} disabled={this.state.loading}>Submit</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

        );
    }
});


export default connect(null, {fetchUser, login})(RegComponent);