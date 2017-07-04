import { connect } from 'react-redux';
import { fetchData, getCars } from '../actions/actions';
import FlipMove from 'react-flip-move';

import LoadingComponent from './LoadingComponent';

import './style/InputForm.sass';


const InputForm = createReactClass({
    getInitialState() {
        return {
            options: [],
            chosen: '',
            priceRange: '',
            message: '' ,
            error: ''
        }
    },

    componentDidMount() {
        this.props.fetchData().then(res => this.setState({
            options: res.data.cars
        }));
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

    onSubmit() {
        this.setState({
            message: 'Loading data...'
        });
        this.props.getCars(this.state.chosen, this.state.priceRange, this.props.user)
            .catch(err => {
            console.log(err)
                this.setState({
                    error: err.response ? err.response.data.error : err.message,
                    message: ''
                })} )
    },

    render() {
        return (

            <form className="form-group InputForm">

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
                </select>

                <div className="btn btn-primary" onClick={this.onSubmit}>Get cars</div>
            </form>

        );
    }
});

function mapStateToProps(state) {
        return {
            user: state.auth.user,
            message: state.message
        }


};

export default connect(mapStateToProps, { fetchData, getCars })(InputForm);