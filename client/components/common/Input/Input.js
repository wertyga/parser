import './Input.sass';

const Input = createReactClass ({

    getInitialState() {
        return {
            value: '',
            focus: false
        }

    },

    onFocus() {
        this.setState({
            focus: true
        });
    },

    onBlur() {
        this.setState({
            focus: false
        });
    },
    onChange(e) {
        this.setState({
            value: e.target.value
        });
    },

    render() {
        return (
            <div className={this.state.focus ? 'focus Input' : 'Input'} style={this.props.error && {color: 'red'}}>
                <div style={{ position: 'relative' }}>
                <input
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    type={this.props.type || 'text'}
                    style={this.props.style}
                    placeholder={this.props.placeholder}
                    className={this.state.focus && 'focus'}
                    value={this.props.value || this.state.value}
                    onChange={this.props.onChange || this.onChange}
                    name={this.props.name}
                />
                <floatText className={(this.state.focus || (this.props.value || this.state.value)) && 'focus'} style={this.props.error && {color: 'red'}}>{this.props.floatText}</floatText>
                <div className={this.state.focus ? 'focus after' : 'after'}></div>
                </div>
                {this.props.error && <error>{this.props.error}</error>}
            </div>

        );
    }
});

export default Input;