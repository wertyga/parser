import { connect } from 'react-redux';
import { fetchData, getCars, fetchCars, clearUserCars, carsGet } from '../actions/actions';
import FlipMove from 'react-flip-move';
import MuiTheme from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { silentAuth } from '../actions/authActions';

import { Link, Redirect } from 'react-router-dom';

import LoadingComponent from './LoadingComponent';

import './style/InputForm.sass';


const style = {
    progress: {
        marginLeft: 10
    }
};


const InputForm = createReactClass({
    getInitialState() {
        return {
            options: [],
            chosen: '',
            priceRange: '',
            message: '' ,
            error: '',
            redirect: false
        }
    },

    componentDidMount() {
        this.props.silentAuth().then(() => {
            this.props.fetchData(this.props.user)
                .then(res => this.setState({
                options: res.data.cars
            }))
                .then(() => {
                    if(this.props.brand || this.props.price) {
                        let brand = this.state.options.find(brand => brand.toLowerCase() === this.props.brand.toLowerCase());
                        this.setState({
                            chosen: brand || '',
                            priceRange: this.props.price || ''
                        });
                    }
                })

        });
    },

    onChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        });
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.message !== prevProps.message) {
            this.setState({
                message: this.props.message
            });
        };
    },

    onSubmit(e) {
        e.preventDefault();
        if(!this.state.chosen) return;
        this.setState({
            message: 'Loading data...'
        });
        this.props.getCars(this.state.chosen, this.state.priceRange, this.props.user)
            .then(() => {
                this.setState({
                    redirect: true
                })
            })
            .then(() => this.setState({ redirect: false }))
            .then(() => {
                this.props.fetchCars({id: this.props.user, page: this.props.page})
                    .catch(err => {
                        this.setState({
                            error: err.response ? err.response.data.error : err.message,
                            message: ''
                        });
                    });
            })
            .catch(err => {
                this.setState({
                    error: err.response ? err.response.data.error : err.message,
                    message: ''
                });
                window.location.pathname = '/';
            });
    },

    render() {

        const main = (
            <MuiTheme>
                <form className="form-group InputForm" onClick={this.cancelClick}>

                    {this.state.message && <LoadingComponent message={this.state.message}/>}

                    {this.state.error && <div className="error">{this.state.error}</div>}
                    <label htmlFor="selectCar">Select car</label>
                    <select onChange={this.onChange} value={this.state.chosen} name="select" id="chosen" className="form-control">
                        <option disabled>Choose a car</option>
                        {this.state.options.map((car, i) => {
                            return <option key={i}>{car}</option>
                        })}
                    </select>

                    <label htmlFor="price-range" className="price-range">Price range</label>
                    <select id="priceRange" value={this.state.priceRange} onChange={this.onChange} className="form-control">
                        <option disabled>Choose price range</option>
                        <option>50%</option>
                        <option>60%</option>
                        <option>70%</option>
                        <option>80%</option>
                        <option>90%</option>
                        <option>100%</option>
                    </select>

                        <button className="btn btn-primary" onClick={this.onSubmit} disabled={this.state.options.length < 1 || !this.state.chosen}>
                            Get cars
                            {!this.state.options.length > 0 &&
                            <CircularProgress
                                color='white'
                                size={20}
                                style={style.progress}
                            />}
                        </button>
                </form>
            </MuiTheme>
        );

        return (
            <div className="InputForm">
                {this.state.redirect ? <Redirect to={`/choose/${this.state.chosen.toLowerCase()}/${1}/?price=${this.state.priceRange || '100%'}`} /> : main}
            </div>

        );
    }
});

function mapStateToProps(state) {
        return {
            user: state.auth.user,
            message: state.message
        }


};

export default connect(mapStateToProps, { fetchData, getCars, silentAuth, fetchCars,clearUserCars, carsGet })(InputForm);