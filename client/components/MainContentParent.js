import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import MainContent from './MainContent';

import { fetchCars } from '../actions/actions';

import './style/MainContentParent.sass';


const MainContentParent = createReactClass({

    componentDidMount() {
        if(this.props.match.params) {
            let brand = this.props.match.params.brand;
            let price = this.props.location.search.split('=')[1];
            let page = this.props.match.params.page;
            this.props.getFields({ brand, price, page });
        };
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.match.params) {
            let page = this.props.match.params.page;
            if(this.props.user !== prevProps.user) {
                this.props.fetchCars({id: this.props.user, page})
            };
            if(this.props.match.params.page !== prevProps.match.params.page) {
                this.props.fetchCars({id: this.props.user, page}).then(() => window.scrollTop = 0)
            };
        };

    },

    buttons() {
        let page = this.props.match.params.page;
        let totalPages = this.props.totalPages;
        let next = <Link className="btn btn-primary" to={`/choose/${this.props.match.params.brand}/${+this.props.match.params.page + 1}/?price=${this.props.location.search.split('=')[1]}`}>Next page</Link>
        let previous = <Link className="btn btn-primary" to={`/choose/${this.props.match.params.brand}/${+this.props.match.params.page - 1}/?price=${this.props.location.search.split('=')[1]}`}>Previous page</Link>
        if(totalPages > 1) {
            if(page < totalPages && page > 1 && this.props.cars > 0) {
                return (
                    <div className="buttons">
                        {previous}
                        {next}
                    </div>
                );
            } else if(page < totalPages && page < 2 && this.props.cars > 0) {
                return (
                    <div className="buttons">
                        {next}
                    </div>
                );
            } else if(page == totalPages && this.props.cars > 0) {
                return (
                    <div className="buttons">
                        {previous}
                    </div>
                );
            };
        };

    },

    render() {
        return (
            <div className="MainContentParent">

                <MainContent/>

                {this.buttons()}

            </div>
        );
    }
});

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        totalPages: state.totalPages,
        cars: state.cars.length
    }
};

export default connect(mapStateToProps, { fetchCars })(MainContentParent);