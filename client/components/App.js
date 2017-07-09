import InputForm from './InputForm';
import MainContent from './MainContent';
import MainContentParent from './MainContentParent';

import { Route } from 'react-router-dom';


import './style/App.sass';

const App = createReactClass({

    getInitialState() {
        return {
            brand: '',
            price: ''
        }
    },

    getFields(options) {
        this.setState({
            brand: options.brand,
            price: options.price,
            page: options.page
        });
    },

    render() {

        return (
                <div className="jumbotron App">

                    <InputForm
                        brand={this.state.brand}
                        price={this.state.price}
                        page={this.state.page}
                    />

                    <Route path="/choose/:brand/:page" render={(props) => {
                        return <MainContentParent
                            getFields={this.getFields}
                            {...props}
                        />
                    }}/>

                </div>
        );
    }
});


export default App;