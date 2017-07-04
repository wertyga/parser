import './style/CarElement.sass';


const CarElement = createReactClass({

    imgClick(e) {
        let img = e.target.id;
        document.getElementById(img).classList.add('zoom')
    },

    render() {
        return (
            <div className="CarElement">
                <div className="img">
                    {this.props.imgs.map((img, i) => {
                        return <img key={i} onClick={this.imgClick} id={`${this.props.model}-${i}`} src={img} alt={this.props.model}/>
                    })}

                </div>

                <div className="details">
                    <p className="model"><strong>Model:</strong> {this.props.model}</p>
                    <p className="year"><strong>Year:</strong> {this.props.year}</p>
                    <p className="price"><strong>Price:</strong> {this.props.price}</p>
                    <p className="middlePrice"><strong>Middle price:</strong> {this.props.middlePrice}</p>
                    <p className="descr"><strong>Description:</strong> {this.props.descr}</p>
                </div>
            </div>
        );
    }
});

export default CarElement;