import Circular from 'material-ui/CircularProgress';
import MuiTheme from 'material-ui/styles/MuiThemeProvider';

import { connect } from 'react-redux';

import './style/LoadingComponent.sass';

const LoadingComponent = createReactClass({
    render() {
        return (
            <div className="LoadingComponent">
                <MuiTheme>
                    <Circular
                        color="#0275d8"
                    />
                </MuiTheme>
                <br/>
                <div className="message">{this.props.message}</div>
            </div>
        );
    }
});

export default LoadingComponent;