import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from './reducers/rootReducer';

import App from './components/App';

import setTokenHeader from '../server/common/setTokenHeader';
import { loginUser } from './actions/authActions';
import jwtDecode from 'jwt-decode';

import './components/style/common/bootstrap.min.css';
import './components/style/common/index.sass';


const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);

ReactDOM.render (
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('app')
);
