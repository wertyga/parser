import InputForm from './InputForm';
import MainContent from './MainContent';
import LoginComponent from './LoginComponent';

import { Route } from 'react-router-dom';

import { connect } from 'react-redux';
import { silentAuth } from '../actions/authActions';

import './style/App.sass';

const App = createReactClass({

    componentDidMount() {
        this.props.silentAuth()
    },

    render() {
        return (
                <div className="jumbotron App">

                    <InputForm />
                    <MainContent />
                </div>
        );
    }
});


export default connect(null, { silentAuth })(App);