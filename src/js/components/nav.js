import React, { Component, PropTypes } from 'react';

class Nav extends Component {
    leftClick(e) {
        this.props.leftClick();
        e.preventDefault();
    }

    rightClick(e) {
        this.props.rightClick();
        e.preventDefault();
    }

    renderLeftLink() {
        if (this.props.leftClick)
            return (
              <a className="nav-header--prev" href="left" onClick={e => this.leftClick(e)} />
            );
    }

    renderRightLink() {
        if (this.props.rightClick)
            return (
              <a className="nav-header--next" href="right" onClick={e => this.rightClick(e)} />
            );
    }

    render() {
        return (
          <div className="nav-header">
            <div className="nav-header--link">{this.renderLeftLink()}</div>
            <div className="nav-header--title">{this.props.children}</div>
            <div className="nav-header--link">{this.renderRightLink()}</div>
          </div>
        );
    }
}

Nav.defaultProps = {
    leftClick: undefined,
    rightClick: undefined,
    children: {}
};

Nav.propTypes = {
    leftClick: PropTypes.func,
    rightClick: PropTypes.func,
    children: PropTypes.node
};

export default Nav;
