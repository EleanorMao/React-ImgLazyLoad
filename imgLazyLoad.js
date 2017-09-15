import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {throttle, getElementTop} from './util';
const _height = window.innerHeight || window.screen.availHeight;

class ImgLazyLoad extends Component {
    constructor(props) {
        super(props);
        this._img = null;
        this.complete = false;
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        this.checkImgs();
        window.addEventListener('scroll', throttle(this.checkImgs.bind(this), 300), false);
    }

    inViewPort() {
        let {offsetTop} = this.props;
        let top = getElementTop(ReactDOM.findDOMNode(this._img));
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return top - scrollTop + offsetTop >= 0 && top - scrollTop < (_height + offsetTop);
    }

    preLoadImage() {
        const {imgSrc} = this.props;
        if (!imgSrc) return;
        const self = this;
        const image = new Image();
        image.onload = function () {
            self.complete = true;
            self.setState({loaded: true});
        };
        image.onerror = function () {
            this.complete = true;
        };

        image.src = imgSrc;
    }

    checkImgs() {
        if (this.complete) return;
        if (this.inViewPort()) {
            this.preLoadImage();
        }
    }

    render() {
        let {loaded} = this.state;
        let {defaultImg, imgSrc, ...other} = this.props;
        return (
            <img
                {...other}
                ref={c => this._img = c}
                src={loaded ? imgSrc : defaultImg}
            />
        )
    }
}

ImgLazyLoad.defaultProps = {
    defaultImg: "",
    offsetTop: 0,
    imgSrc: "",
};

module.exports = ImgLazyLoad;
