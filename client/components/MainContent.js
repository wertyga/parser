import { connect } from 'react-redux';

import CarElement from './CarElement';

const MainContent = createReactClass({

    getInitialState() {
        return {
            cars: []
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.cars !== this.props.cars) {
            if(this.props.cars.length < 1) {
                this.setState({
                    cars: []
                });
            } else {
                this.setState({
                    cars: this.props.cars
                });
            };

        };
    },

    render() {
        return(
            <div className="MainContent">
                {this.state.cars && this.state.cars.map((car, i) => {
                    return <CarElement
                                key={i}
                                model={car.model}
                                year={car.year}
                                price={car.price}
                                descr={car.description}
                                imgs={car.images}
                                middlePrice={car.middlePrice}
                            />
                })}
            </div>
        );
    }
});

function mapStateToProps(state) {
        return {
            cars: state.cars
        }

};

export default connect(mapStateToProps)(MainContent);