/**
 * Created by elly on 2017/8/30.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {throttle, getElementTop} from './util';

class Lazyload extends Component {
    constructor(props) {
        super(props);
        this._inited = [];
        this._height = 800;
    }

    componentDidMount() {
        let {leading, leadingSize, callback, children} = this.props;
        if (leading && leadingSize && children.length) {
            for (let i = 0; i < leadingSize; i++) {
                this.refs[i][callback]();
                this._inited.push(i);
            }
        }
        this._height = window.innerHeight || window.screen.availHeight;
        this.init();
         window.addEventListener('scroll', throttle(this.init.bind(this), 200), false);
    }

    init() {
        let _loadIndex = null, _loadElement = null;
        let len = this.props.children.length;
        if (len === this._inited.length) return;
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        for (let i = 0; i < len; i++) {
            if (!_loadElement && !~this._inited.indexOf(i)) {
                let element = this.refs[i];
                let offsetTop = getElementTop(ReactDOM.findDOMNode(element));
                if (offsetTop - scrollTop + this._height >= 0 && offsetTop - scrollTop < this._height * 2) {
                    _loadIndex = i;
                    _loadElement = element;
                    break
                }
            }
        }

        if (_loadElement) this.getData(_loadIndex, _loadElement);
    }

    getData(index, element) {
        this._inited.push(index);
        element[this.props.callback]();
        this.init();
    }


    render() {
        let i = 0;
        let {children} = this.props;
        return (
            <div className="lazyload">
                {React.Children.map(children, (elm) => {
                    return React.cloneElement(elm, {ref: i++});
                })}
            </div>
        )
    }
}


Lazyload.defaultProps = {
    leadingSize: 1
};

module.exports = Lazyload;
